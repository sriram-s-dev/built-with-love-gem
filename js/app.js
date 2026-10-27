(function(){
"use strict";
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
function safe(fn){try{return fn();}catch(e){console.error("Birthday app:",e);}}
document.addEventListener("DOMContentLoaded",function(){
 safe(()=>{
  const c=window.BIRTHDAY_CONFIG||{},t=c.texts||{},game=window.BirthdayGame.initGame();
  const screens=["#intro","#scratchScreen","#lockScreen","#birthdayScreen"];
  function show(id){screens.forEach(s=>$(s).classList.toggle("hidden",s!==id));document.body.classList.toggle("birthday-open",id==="#birthdayScreen");}
  const clues=c.clueTexts||[];$$(".clue").forEach((el,i)=>{if(clues[i])$("p",el).textContent=clues[i];});
  document.title=(c.friendName||"A little surprise")+" — birthday surprise";
  function text(id,value){if(value)$(id).textContent=value;}
  text("#scratchLabel",t.scratchLabel);text("#scratchStatus",t.scratchStatus);text("#promptText",t.datePrompt);text("#feedback",t.dateHint);text("#skipBtn",t.skip);text("#unlockBtn",t.unlockButton);
  const title=$("#intro h1");if(t.introTitle)title.innerHTML=t.introTitle;text("#intro .lead",t.introLine);text("#startBtn",t.startButton);text("#scratchScreen h2",t.scratchTitle);text("#scratchScreen .subhead",t.scratchInstruction);text("#revealBtn",t.revealAll);
  $("#startBtn").addEventListener("click",()=>{show("#scratchScreen");game.start();});
  $("#revealBtn").addEventListener("click",()=>game.revealAll());
  window.BirthdayApp={showLock(){show("#lockScreen");}};
  const inputs=[$("#dayInput"),$("#monthInput"),$("#yearInput")];let active=0,tries=0,unlocked=false;
  inputs.forEach((input,i)=>{input.addEventListener("focus",()=>active=i);input.addEventListener("input",()=>{input.value=input.value.replace(/\D/g,"").slice(0,i===2?4:2);if(input.value.length===input.maxLength&&i<2){inputs[i+1].focus();active=i+1;}});input.addEventListener("keydown",e=>{if(e.key==="Enter")checkDate();if(e.key==="Backspace"&&!input.value&&i>0)inputs[i-1].focus();});});
  function clearBoxes(){inputs.forEach(i=>{i.value="";i.classList.remove("correct");});inputs[0].focus();}
  function fail(){tries++;const box=$("#dateBoxes");box.classList.remove("shake");void box.offsetWidth;box.classList.add("shake");let msg=t.wrongDate||"Not quite — try again, there's no rush.";if(tries>=3)msg=t.hintMonth||"Hint: October";if(tries>=5)msg=(t.hintMonth||"Hint: October")+" · "+(t.hintDay||"The day is 28 💛");text("#feedback",msg);clearBoxes();if(tries>=8)$("#skipBtn").classList.remove("hidden");}
  function burst(){if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const symbols=["✦","✧","❀","✿","◆"];for(let i=0;i<46;i++){const s=document.createElement("span");s.className="spark";s.textContent=symbols[i%symbols.length];s.style.left=(window.innerWidth*.5+(Math.random()-.5)*100)+"px";s.style.top=(window.innerHeight*.45+(Math.random()-.5)*50)+"px";s.style.color=["#b8902a","#8d6ac4","#e99ac4","#a58bd4"][i%4];s.style.setProperty("--dx",((Math.random()-.5)*window.innerWidth*.9)+"px");s.style.setProperty("--dy",((Math.random()-.7)*window.innerHeight*.8)+"px");document.body.appendChild(s);setTimeout(()=>s.remove(),1250);}}
  function openBirthday(){const frame=$("#birthdayFrame");if(!frame.hasAttribute("src")){frame.addEventListener("load",()=>frame.focus(),{once:true});frame.src="birthday/index.html";}show("#birthdayScreen");frame.focus();}
  function unlock(){if(unlocked)return;unlocked=true;inputs.forEach(i=>i.classList.add("correct"));text("#feedback","A little birthday magic, just for you ✨");burst();const overlay=$("#celebration");overlay.classList.remove("hidden");try{const A=window.AudioContext||window.webkitAudioContext;if(A){const a=new A(),o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.setValueAtTime(680,a.currentTime);o.frequency.exponentialRampToValueAtTime(990,a.currentTime+.18);g.gain.setValueAtTime(.001,a.currentTime);g.gain.exponentialRampToValueAtTime(.12,a.currentTime+.02);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.35);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.36);}}catch(e){}const delay=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?120:1400;setTimeout(()=>{overlay.classList.add("hidden");openBirthday();},delay);}
  function checkDate(){if(unlocked)return;const vals=inputs.map(i=>i.value);if(vals.some(v=>!v)){text("#feedback","Fill in the day, month and year.");return;}if(Number(vals[0])===Number(c.birthDay||28)&&Number(vals[1])===Number(c.birthMonth||10)&&Number(vals[2])===Number(c.birthYear||2004)){unlock();}else fail();}
  $("#unlockBtn").addEventListener("click",checkDate);
  $("#keypad").addEventListener("click",e=>{const b=e.target.closest("button[data-key]");if(!b)return;const k=b.dataset.key;if(k==="clear"){clearBoxes();return;}if(k==="back"){let i=inputs[active];if(i.value)i.value=i.value.slice(0,-1);else if(active>0){active--;inputs[active].focus();}return;}let i=inputs[active];if(i.value.length>=i.maxLength){if(active<2){active++;i=inputs[active];i.focus();}}if(i.value.length<i.maxLength){i.value+=k;if(i.value.length===i.maxLength&&active<2){active++;inputs[active].focus();}}});
  $("#skipBtn").addEventListener("click",()=>{if(tries>=8){unlocked=false;openBirthday();}});
 });
});
})();