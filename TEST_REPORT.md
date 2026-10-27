# Test report

## Environment

- Served the integrated project with Python's `http.server` and tested it in the integrated Chromium browser.
- Project is static HTML/CSS/JavaScript; no build or dependency install.
- The site has seven bundled photos, a soundtrack, and the configured H.264/AAC birthday video at `birthday/videos/birthday.mp4`.

## Results

| Check | Result |
|---|---|
| Opening screen, greeting text, Start button | PASS |
| Mouse scratch interaction | PASS — scratched the three panels; sampled clear areas were 94%, 100%, and 61%, and all three clues revealed |
| Touch scratch interaction | NOT TESTED on a physical touch device; browser reported `navigator.maxTouchPoints = 0`. The game uses Pointer Events and keypad interaction was tested at mobile dimensions. |
| Hero and cinema video loading, poster, playback, and controls | PASS — tested at desktop and mobile viewport sizes; no console errors or failed asset requests |
| Cinema seeking | PASS — verified on a local byte-range server; Python's built-in `http.server` does not support byte-range requests |
| Cinema audio and music coordination | PASS — video with sound pauses background music; muting or pausing the video resumes it |
| Reveal All and Continue | PASS — Reveal All appeared after 20 seconds and opened date verification |
| Wrong date feedback and hints | PASS — month hint on attempt 3, day hint on attempt 5, Skip on attempt 8 |
| Correct date and keypad | PASS — entered `28 / 10 / 2004` with the on-screen keypad at 320 × 568 |
| Unlock transition and direct entry | PASS — successful verification displayed the unlock overlay and opened the bundled birthday site directly |
| Birthday site | PASS — Ram personalization, seven gallery images loaded, soundtrack reached ready state and played, wishes/timeline/letter/candle/surprise controls responded |
| Video | NOT AVAILABLE in source archive — no video file was supplied. Its controls are hidden and the page explains how to add a local video; no missing-video request is made. |
| Requested viewport sizes | PASS — measured the birthday page at 390 × 844, 360 × 640, 320 × 568, 844 × 390, and 1366 × 768; document width matched each viewport with no horizontal overflow. At 320 × 568 the entrance's lock screen has a small vertical scroll extent, but the keypad and Unlock button remained in the viewport. |
| Console errors / failed local requests | PASS — none observed during the successful flow and birthday media checks |
| Direct `file://` opening | PASS for the entrance and transition into the birthday page. Chromium could not decode the MP3 under `file://` (`MEDIA_ELEMENT_ERROR: Format error`); the same supplied track loaded and played under the documented local HTTP server. Use the Python server for reliable audio. |

The browser harness marked background tabs as hidden, so the mouse-scratch test explicitly set the page visibility state to visible before dragging. Real user browsers do not need this test-only adjustment.
