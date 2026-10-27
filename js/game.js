(function () {
"use strict";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
function safe(fn){ try { return fn(); } catch(e){ console.error("Birthday game:",e); return undefined; } }
function initGame(){
  const cfg = window.BIRTHDAY_CONFIG || {};
  const canvas=$("#scratchCanvas"), wrap=$("#scratchWrap"), ctx=safe(()=>canvas.getContext("2d",{willReadFrequently:true}));
  if(!canvas || !ctx) return {start(){},revealAll(){},destroy(){}};
  let drawing=false, last=null, scratchStarted=0, revealTimer=null, lockTimer=null, raf=0, particles=[], lastParticle=0, audioCtx=null, lastCheck=0, revealed=[false,false,false], started=false;
  const isSmall=()=>window.innerWidth<600;
  const maxParticles=()=>isSmall()?25:65;
  const reduced=()=>window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize(){
    const rect=wrap.getBoundingClientRect(); if(!rect.width||!rect.height)return;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    canvas.style.width=rect.width+"px";canvas.style.height=rect.height+"px";
    ctx.setTransform(canvas.width/rect.width,0,0,canvas.height/rect.height,0,0);
    paintGold(rect.width,rect.height);
    revealed=[false,false,false]; $$(".clue").forEach(el=>el.classList.remove("revealed"));
  }
  function paintGold(w,h){
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#f6d878");g.addColorStop(.2,"#b8902a");g.addColorStop(.43,"#f9e8a5");g.addColorStop(.62,"#c69b35");g.addColorStop(.8,"#f2d16b");g.addColorStop(1,"#9e7422");
    ctx.globalCompositeOperation="source-over";ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    // Fine diagonal foil texture and jewel-toned glitter, deliberately not white.
    for(let i=0;i<Math.min(110,Math.floor(w*h/650));i++){
      const x=Math.random()*w,y=Math.random()*h;ctx.fillStyle=["#8d6ac4","#d47eae","#f2cc5c","#b8902a","#a58bd4"][i%5];ctx.globalAlpha=.28+Math.random()*.45;ctx.beginPath();ctx.arc(x,y,Math.random()*1.5+.3,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;ctx.strokeStyle="#fff0b0";ctx.globalAlpha=.24;for(let x=-h;x<w;x+=18){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+h,h);ctx.stroke();}ctx.globalAlpha=1;
  }
  function ensureAudio(){if(audioCtx)return audioCtx;try{const A=window.AudioContext||window.webkitAudioContext;if(A)audioCtx=new A();}catch(e){}return audioCtx;}
  function scratchSound(){try{const a=ensureAudio();if(!a)return;if(a.state==="suspended")a.resume();const n= a.createBufferSource(),b=a.createBuffer(1,Math.floor(a.sampleRate*.035),a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);n.buffer=b;const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=1100;const g=a.createGain();g.gain.value=.045;n.connect(f);f.connect(g);g.connect(a.destination);n.start();}catch(e){}}
  function addParticles(x,y){
    if(reduced()||document.hidden)return;const now=performance.now();if(now-lastParticle<24)return;lastParticle=now;
    const n=isSmall()?2:3;for(let i=0;i<n&&particles.length<maxParticles();i++){
      const el=document.createElement("span");el.className="scratch-spark";el.textContent=["✦","✧","◆"][Math.floor(Math.random()*3)];
      el.style.left=x+"px";el.style.top=y+"px";el.style.color=["#8d6ac4","#b8902a","#e99ac4","#a58bd4"][Math.floor(Math.random()*4)];
      el.style.setProperty("--sx",((Math.random()-.5)*34)+"px");el.style.setProperty("--sy",(-10-Math.random()*28)+"px");wrap.appendChild(el);particles.push(el);
      setTimeout(()=>{const idx=particles.indexOf(el);if(idx>=0)particles.splice(idx,1);el.remove();},620);
    }
  }
  function particleLoop(){raf=0;if(document.hidden){particles.forEach(p=>p.remove());particles=[];return;}if(particles.length)raf=requestAnimationFrame(particleLoop);}

  function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function erase(p){
    const r=canvas.getBoundingClientRect();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(p.x,p.y,Math.max(20,Math.min(30,r.width*.065)),0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation="source-over";addParticles(p.x,p.y);
    const now=performance.now();if(now-lastCheck>250){lastCheck=now;checkReveal();}
  }
  function panelPercent(index){
    const w=canvas.width,h=canvas.height,scaleX=w/canvas.getBoundingClientRect().width,scaleY=h/canvas.getBoundingClientRect().height,x0=Math.floor(index*w/3),x1=Math.floor((index+1)*w/3),stepX=Math.max(1,Math.round(scaleX*2)),stepY=Math.max(1,Math.round(scaleY*2));let clear=0,total=0;
    const panelWidth=x1-x0,data=ctx.getImageData(x0,0,panelWidth,h).data;
    for(let y=Math.floor(stepY/2);y<h;y+=stepY)for(let x=Math.floor(stepX/2);x<panelWidth;x+=stepX){const idx=(y*panelWidth+x)*4+3;if(data[idx]<80)clear++;total++;}
    return total?clear/total*100:0;
  }
  function checkReveal(){const threshold=Number(cfg.revealThreshold)||60;let count=0;revealed.forEach((v,i)=>{if(!v&&panelPercent(i)>=threshold){revealed[i]=true;const el=$('.clue[data-clue="'+i+'"]');if(el)el.classList.add("revealed");}if(revealed[i])count++;});if(count===3)allRevealed();}
  function start(){
    if(started)return;started=true;resize();scratchStarted=performance.now();
    revealTimer=setTimeout(()=>$("#revealBtn").classList.remove("hidden"),20000);
    canvas.addEventListener("pointerdown",onDown);canvas.addEventListener("pointermove",onMove);canvas.addEventListener("pointerup",onUp);canvas.addEventListener("pointercancel",onUp);canvas.addEventListener("lostpointercapture",onUp);
    window.addEventListener("resize",resize);
  }
  function onDown(e){if(!started||document.hidden)return;e.preventDefault();drawing=true;last=point(e);try{canvas.setPointerCapture(e.pointerId);}catch(err){}scratchSound();erase(last);}
  function onMove(e){if(!drawing)return;e.preventDefault();const p=point(e);if(last){const dx=p.x-last.x,dy=p.y-last.y,dist=Math.hypot(dx,dy),steps=Math.max(1,Math.ceil(dist/9));for(let i=1;i<=steps;i++)erase({x:last.x+dx*i/steps,y:last.y+dy*i/steps});}last=p;if(performance.now()-scratchStarted>20000)$("#revealBtn").classList.remove("hidden");}
  function onUp(){drawing=false;last=null;checkReveal();}
  function allRevealed(){if(!started)return;started=false;clearTimeout(revealTimer);cancelAnimationFrame(raf);particles.forEach(p=>p.remove());particles=[];const status=$("#scratchStatus");if(status&&cfg.texts&&cfg.texts.scratchComplete)status.textContent=cfg.texts.scratchComplete;scratchSound();lockTimer=setTimeout(()=>{lockTimer=null;safe(()=>window.BirthdayApp.showLock());},Number(cfg.lockDelayMs));}
  function revealAll(){if(!started)return;revealed=[true,true,true];$$(".clue").forEach(el=>el.classList.add("revealed"));ctx.clearRect(0,0,canvas.width,canvas.height);allRevealed();}
  function destroy(){clearTimeout(revealTimer);clearTimeout(lockTimer);cancelAnimationFrame(raf);window.removeEventListener("resize",resize);canvas.removeEventListener("pointerdown",onDown);canvas.removeEventListener("pointermove",onMove);canvas.removeEventListener("pointerup",onUp);canvas.removeEventListener("pointercancel",onUp);}
  document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;particles=[];}});
  return {start,revealAll,destroy};
}
window.BirthdayGame={initGame};
})();