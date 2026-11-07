# Hindu Avatarwad — The Avatar Gallery

An interactive exhibition display for **Light Beyond Lamps**. It introduces Avatarvad through Bhagavad Gita 4.7–8 and a looping gallery of ten principal avatars.

The display includes Sanskrit and Roman transliteration, concise purpose and values panels, scriptural reading references, complete paintings, animated avatar-specific cursors, touch controls, fullscreen and reduced-motion support. Kalki is represented without a portrait.

## GitHub Pages

This is a static website with no build dependencies. Publish the `main` branch from `/(root)` in **Settings → Pages**. The `.nojekyll` file keeps the site in plain static mode. All site assets use relative paths so the gallery works beneath the repository URL.

To run locally, serve this directory using any static web server (for example `python -m http.server 8000`) and open the server URL.

## Editing

- `index.html` — introduction and gallery shell
- `avatars.js` — avatar purpose, values and granth references
- `app.js` — navigation, slideshow and display settings
- `cursor.js` and `cursors.css` — animated pointer system
- `style.css`, `responsive.css`, `stories.css`, `exhibition.css` — layout and presentation
- `assets/` — local artwork

Paintings are artistic interpretations. Summaries and English renderings are original exhibition text; granth references are shown in each panel. Google Fonts and external reading links require an internet connection.
