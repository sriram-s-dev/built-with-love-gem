# A Special Day — Cinematic Birthday Website 💜

A responsive, no-build-step birthday experience made with plain HTML, CSS, and JavaScript. No frameworks or JavaScript CDNs are required. Google Fonts are an optional enhancement; local/system fallbacks are built in. The experience remains usable if media files are missing.

## Quick start

1. Unzip the folder.
2. Open `index.html` in a modern browser, or serve the folder locally (recommended for media uploads and fullscreen APIs).
3. For the full experience, add your own media to the folders below.

### Run with Python
From inside the `birthday-grand` folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

### Run on Android with Termux
1. Install Termux and Python (`pkg update && pkg install python`).
2. Move/extract this folder somewhere accessible to Termux, then `cd` into `birthday-grand`.
3. Run `python -m http.server 8000`.
4. Open `http://127.0.0.1:8000` in your phone browser. Stop the server with `Ctrl+C`.

## Customize everything
Open `js/config.js`. Change `friendName` and `yourName`, then edit `wishes`, `letter`, `quotes`, `timeline`, `photos`, `cinemaVideoPath`, `videoPath`, and `musicPath`. Keep strings in quotes and separate list entries with commas.

Example:

```js
friendName: "Mithra",
yourName: "Sriram",
```

## Media folders
- Gallery photos and posters are in `images/`; preserved source photos are in `images/originals/`.
- The inline cinema video is `videos/birthday.mp4`, configured as `cinemaVideoPath`.
- The configured soundtrack is `audio/music.mp3`; additional source audio is preserved in `audio/originals/`.
- Update `js/config.js` when changing configured image, video, or music paths. The original cinema video plays inline with sound when Play is pressed.

## Publish online

### GitHub Pages
1. Create a repository and upload the contents of this folder (keep `index.html` at the repository root).
2. In repository **Settings → Pages**, choose the branch and root folder, then save.
3. Wait for GitHub Pages to publish and open the provided URL. Ensure any media filenames match letter-for-letter (hosting is case-sensitive).

### Netlify
1. Sign in to Netlify and choose **Add new site → Deploy manually**.
2. Drag the unzipped `birthday-grand` folder into the deploy area, or connect the repository.
3. Netlify serves `index.html` automatically; no build command is needed.

## Notes
- Everything is plain HTML/CSS/JS; scripts are loaded at the end of the body and initialize after `DOMContentLoaded`.
- Animations respect `prefers-reduced-motion`; particle counts are lower on small screens.
- Music and video autoplay may be blocked until the visitor interacts with the page. The intro button is the intended gesture.
- The page works without optional photos/audio/video. Missing assets are shown as graceful placeholders rather than fatal errors.


## Media customization (folder-based)
- Photos: add files under `images/` and list their paths/captions in `js/config.js` → `photos`.
- Dashboard video: set `videoPath` in `js/config.js` (currently `videos/birthday.mp4`).
- Original cinema video: set `cinemaVideoPath` in `js/config.js` (currently `videos/birthday.mp4`).
- Music: place your MP3 in `audio/` and set `musicPath` in `js/config.js`; it starts after the Enter button click.
- The cinema player loads `cinemaVideoPath` from the project automatically; press Play to watch it inline.
- Navigation is slide-by-slide: use Next/Back or the section dots; page scrolling is disabled.

## Updated lavender slide experience
- The experience is navigated by slide Next/Back buttons and the section dots; scrolling is disabled.
- Add photos to `images/` and list them in `js/config.js` → `photos`.
- Set the dashboard video with `videoPath` in `js/config.js`.
- Put the soundtrack MP3 in `audio/` and set `musicPath` in `js/config.js`. Music begins when the Enter button is clicked.
- The original cinema video loads from `cinemaVideoPath` in `js/config.js`. MP4 with H.264 video and AAC audio is recommended for broad compatibility.
