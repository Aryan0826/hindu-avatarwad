# Light Beyond Lamps — The Avatar Gallery

A buildless Avatarvad exhibition in indigo and gold. The introduction presents Bhagavad Gita 4.7–8 with Devanagari, Roman transliteration and a concise English meaning. Its Next button opens a single-screen gallery.

The gallery is a continuous horizontal procession of ten large portraits. Each shows the avatar’s name, qualities and a short description of the form. Complete paintings use `object-fit: contain`. There is no vertical page scroll or separate hero section. The procession wraps seamlessly from Kalki to Matsya; Kalki has a typographic future placeholder, never a portrait.

Select a portrait to pause movement and open its exhibit. Identity appears with the painting. The reading area begins with *Intent behind this avatar* and a large purpose heading, followed by a concise account, a gold takeaway and plain shaastra references. References name ancient scriptures and precise skandha, chapter and verse locations; there are no outbound source links, modern publication recommendations or reading tabs. Takeaways are exhibition interpretations, not quotations attributed to an avatar.

## Interaction and access

- Pause/play and previous/next controls remain visible. Hovering a portrait or navigating it by keyboard pauses motion; leaving it resumes motion. Touch dragging, touchpad wheel movement and arrow keys support manual exploration.
- A single accessible set of ten cards is backed by visual duplicates for the seamless loop. Duplicate cards remain tappable but are excluded from keyboard order and accessibility output.
- Reduced-motion preferences start the gallery still. Visitors may explicitly choose Play. Display settings set speed, inactivity time and still mode.
- An open exhibit pauses the procession. Three minutes of inactivity returns to the gallery by default, with a ten-second warning. Previous/next avatar controls and a clear return button remain available.
- The two-page introduction/gallery navigation, fullscreen control and avatar-specific vector cursors are retained.

## Files and hosting

Static files are at the repository root; no dependencies or build step are required. `loop-gallery.css` contains the procession and revised exhibit layout. `app.js` controls movement and dialogs; `avatars.js` holds content and shaastra references. Source research locators are in `docs/exhibition-sources.md`.

The existing GPT Site retains its configured audience. GitHub Pages currently publishes `main` from `/(root)`. This revision is on `exhibition-loop-gallery`; merge it into `main` when ready to update GitHub Pages. `.nojekyll` keeps publication in static mode. All local asset paths are relative, including under the project’s GitHub Pages subpath.

Artwork consists of existing generated artistic interpretations; this revision changes layout and reference presentation, not the paintings. Google Fonts supplies Cormorant Garamond, DM Sans and Noto Serif Devanagari with system fallbacks. There are no API keys or visitor trackers.

## Dimensional gallery refinement

The gallery now fills the screen above its compact bottom controls. Fullscreen is in Display settings. Between Kalki and Matsya, a generously spaced “Why Bhagwan manifests” stop opens the Bhagavad Gita introduction. It is included in arrow, swipe and keyboard navigation without becoming an eleventh avatar.

`gallery-depth.css` adds shallow perspective, beveled gold edges, pointer-responsive lighting, avatar motifs and responsive title plaques. Portrait widths follow available image height, reducing side padding while preserving the complete paintings. Automatic movement remains linear; manual arrows use an eased transition. Still and reduced-motion modes remove depth motion.
