# Ram's Birthday Surprise

A single, no-build-step birthday website that starts with the Golden Scratch Card and transitions directly into the bundled birthday surprise. It uses plain HTML, CSS, and JavaScript.

## Run locally

1. Open this folder and double-click `index.html` in a modern browser.
2. If the browser restricts local files or audio, run a local server from this folder:

   ```bash
   python -m http.server 8000
   ```

3. Visit <http://localhost:8000>.

No package installation or build step is required.

## Deploy on Vercel

Import this project with the repository root as the **Root Directory** (`.`). Choose **Other** as the framework preset, leave the build command empty, and set the output directory to `.`. Vercel serves the root `index.html` as the entry point; `vercel.json` explicitly maps `/` to that file. Keep the `birthday/`, `css/`, and `js/` folders alongside the root files so the entrance and embedded birthday page can load their assets.

## The experience

1. Start the greeting and scratch each of the three golden panels. Mouse and touch/pen input are supported. Each clue appears after about 60% of its panel has been cleared; **Reveal all** appears after 20 seconds.
2. Continue to the date keypad and enter `28 / 10 / 2004`. Wrong attempts shake the date boxes; the month hint appears after three tries, the day after five, and Skip after eight.
3. The short unlock animation transitions directly into the actual birthday site. Its slideshow, wishes, photo gallery/lightbox, timeline, letter, candle interaction, surprise message, and music remain part of the bundled experience.

The date check is client-side and is intended as a playful birthday gate, not secure authentication.

## Personalize the greeting and date

Edit `js/config.js`:

- `friendName`: the name used by the entrance.
- `birthDay`, `birthMonth`, `birthYear`: expected date; the month is numeric.
- `clueTexts`: the three scratch-card clues.
- `revealThreshold`: scratch percentage required to reveal each clue.
- `texts`: entrance wording and button labels.

The birthday website has its own settings in `birthday/js/config.js`, including its name, wishes, letter, quotes, timeline, gallery captions, soundtrack, and video paths. Its video files are in `birthday/videos/`; `birthday.mp4` is the configured cinema source.

## Project structure

- `index.html`, `css/`, `js/`: scratch-card entrance, date verification, and unlock flow.
- `birthday/`: the birthday site's page, styling, interactive JavaScript, and assets.
- `birthday/images/`: gallery images, posters, and preserved source photos in `originals/`.
- `birthday/audio/music.mp3`: configured soundtrack; additional source audio is preserved in `originals/`.
- `birthday/videos/birthday.mp4`: configured inline cinema video.
- `TEST_REPORT.md`: checks actually run for this integrated project.

All paths are relative, so the folder can be moved or hosted as a static site. The browser must allow JavaScript and canvas for the scratch effect. Sound begins after visitor interaction as required by browser audio policies.
