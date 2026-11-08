# Light Beyond Lamps — The Avatar Gallery

A buildless Avatarvad exhibition in indigo and gold. The gallery opens directly on arrival. Its “Why Bhagwan incarnates” stop opens the introduction, which presents Bhagavad Gita 4.7–8 with Devanagari, Roman transliteration and an original English rendering, attributed to Bhagwan Shree Krishna. A large X at the top right closes the introduction into the gallery. The former page count and Next button are removed; Escape also opens the gallery.

The gallery continuously moves ten large avatar portraits along a shallow 3D stage. Names, qualities, brief descriptions, gold motifs and slightly enlarged indices accompany the complete paintings. There is no vertical gallery scroll. A spacious “Why Bhagwan incarnates” stop between Kalki and Matsya reopens the Gita introduction. Kalki remains a future prophecy, without a portrait.

Selecting a portrait pauses movement and opens its exhibit. The image fills the left column; a small avatar name in the top toolbar replaces the repeated identity block. Intent, concise account, gold takeaway and plain shaastra references are visible together. The reference section is labelled “Find out more · Shaastra” and contains no hyperlinks. A large, accessibly labelled X closes the exhibit. Previous/next avatar controls remain visible.

Rama and Krishna have expanded, original, scripture-supported accounts. They describe actions and choices rather than declaring the figures to be role models. Exact source locators and distinctions between scriptural events and exhibition interpretations are in `docs/exhibition-sources.md`. Visible English uses incarnate/incarnation where appropriate.

## Controls and access

- Hover, keyboard focus or an open exhibit pauses automatic motion. Arrow controls, touch dragging, touchpad wheel input and keyboard arrows support manual exploration. Automatic movement is linear; manual arrows ease between stops.
- One accessible set of cards is backed by visual copies for the seamless loop. Copies remain tappable without becoming focus targets.
- Display settings contains fullscreen, inactivity duration, still mode and a native speed slider. The slider offers 0.25×–3× in 0.05× increments, with live pace labels and Reset to 1×. The previous 12-second-per-card pace remains the 1× default, and browser preferences remain compatible.
- Reduced-motion preferences start the gallery still and remove depth motion. Visitors may explicitly choose Play. Inactivity returns an open exhibit to the gallery after three minutes by default, with a ten-second warning.
- Painting proportions, portrait composition and all previously corrected artwork are retained. Compact reading layouts adjust to keep the full text visible; very small phones omit the portrait to preserve reading space.

## Files and hosting

Static files are at the repository root; there are no dependencies or build steps. `avatars.js` holds the content and shaastra references; `app.js` controls navigation and motion. `gallery-depth.css` contains the dimensional gallery, and `reader-refresh.css` contains the current exhibit, introduction, close-control and speed-slider refinements. Earlier styles retain the established visual identity.

The existing GPT Site retains its configured audience. GitHub Pages publishes `main` from `/(root)`. The gallery-first and incarnation-reader refinements are on `gallery-incarnation-refinements`; merge that branch into `main` when ready to update Pages. `.nojekyll` keeps publication in static mode. All local asset paths are relative. Google Fonts provides Cormorant Garamond, DM Sans, Bodoni Moda (Matsya’s intent heading) and Noto Serif Devanagari, with system fallbacks. There are no API keys or visitor trackers.

Matsya’s intent uses the requested original exhibition wording about safeguarding creation, set in a warm-gold italic Bodoni heading. It is interpretive exhibition prose, not a quoted shaastra verse. All exhibit panels use “Intent behind incarnation”.
