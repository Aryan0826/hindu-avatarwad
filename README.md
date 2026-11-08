# Light Beyond Lamps — The Avatar Gallery

A buildless Avatarvad exhibition in indigo and gold. The gallery opens directly on arrival. Its “Why Bhagwan incarnates” stop opens the introduction, which presents Bhagavad Gita 4.7–8 with Devanagari, Roman transliteration and an original English rendering, attributed to Bhagwan Shree Krishna. A large X at the top right closes the introduction into the gallery. The former page count and Next button are removed; Escape also opens the gallery.

The gallery continuously moves ten large avatar portraits along a shallow 3D stage. Names, qualities, brief descriptions, gold motifs and slightly enlarged indices accompany the complete paintings. There is no vertical gallery scroll. A spacious “Why Bhagwan incarnates” stop between Kalki and Matsya reopens the Gita introduction. Kalki remains a future prophecy, without a portrait.

Selecting a portrait pauses movement and opens its exhibit. The image fills the left column; a small avatar name in the top toolbar replaces the repeated identity block. Intent, concise account, gold takeaway and plain shaastra references are visible together. The reference section is labelled “Find out more · Shaastra” and contains no hyperlinks. A large, accessibly labelled X closes the exhibit. Previous/next avatar controls remain visible.

All ten avatars present the narrative supplied by the project owner, with intent, story, essence and values. Existing shaastra-reference entries are retained unchanged. Exact source locators and distinctions between scriptural events and exhibition interpretations are in `docs/exhibition-sources.md`. Visible English uses incarnate/incarnation where appropriate.

## Controls and access

- Mouse movement pauses automatic motion; after five seconds with a stationary pointer it resumes. Display settings offers a 1–30 second delay slider, saved in this browser. Keyboard focus or an open exhibit continues to pause motion. Arrow controls, touch dragging, touchpad wheel input and keyboard arrows support manual exploration. Automatic movement is linear; manual arrows ease between stops.
- One accessible set of cards is backed by visual copies for the seamless loop. Copies remain tappable without becoming focus targets.
- Display settings contains fullscreen, inactivity duration, still mode and a native speed slider. The slider offers 0.25×–3× in 0.05× increments, with live pace labels and Reset to 1×. The previous 12-second-per-card pace remains the 1× default, and browser preferences remain compatible.
- Reduced-motion preferences start the gallery still and remove depth motion. Visitors may explicitly choose Play. Inactivity returns an open exhibit to the gallery after three minutes by default, with a ten-second warning.
- Painting proportions, portrait composition and all previously corrected artwork are retained. Compact reading layouts adjust to keep the full text visible; very small phones omit the portrait to preserve reading space.

## Files and hosting

Static files are at the repository root; there are no dependencies or build steps. `avatars.js` holds the content and shaastra references; `app.js` controls navigation and motion. `gallery-depth.css` contains the dimensional gallery, and `reader-refresh.css` contains the current exhibit, introduction, close-control and speed-slider refinements. Earlier styles retain the established visual identity.

The existing GPT Site retains its configured audience. GitHub Pages publishes `main` from `/(root)`. `.nojekyll` keeps publication in static mode. All local asset paths are relative. Google Fonts provides Cormorant Garamond, DM Sans and Noto Serif Devanagari, with system fallbacks. There are no API keys or visitor trackers.

The supplied narratives are exhibition prose rather than quotations from shaastra. All exhibit panels use “Intent behind the incarnation” and “Essence of the avatar”.

Typography is consistent by role: Cormorant Garamond for English headings, DM Sans for body text and controls, and Noto Serif Devanagari for Sanskrit. All avatar intent headings share the same font, weight and responsive size.

The supplied-content revision is on `avatar-content-refresh`. The existing images, gallery behavior and shaastra references are unchanged. The essence uses the full reading width; smaller displays can scroll the reading panel when necessary to keep all supplied text accessible.

Enter fullscreen from Display settings to start exhibition mode. Display settings close and stay hidden while fullscreen. Visitors can browse with scroll, swipe and primary clicks, while text selection, image dragging, secondary-click menus and common page shortcuts are disabled within the gallery. Press Esc to exit fullscreen and access settings again.
