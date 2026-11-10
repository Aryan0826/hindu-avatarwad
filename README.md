# Light Beyond Lamps — The Avatar Gallery

A buildless Avatarvad exhibition in indigo and gold. The opening presents Bhagavad Gita 4.7–8 with Devanagari, Roman transliteration and an original English rendering, attributed to Bhagwan Shree Krishna. A large X at the top right closes the introduction into the gallery. The former page count and Next button are removed; Escape also opens the gallery.

The gallery continuously moves ten large avatar portraits along a shallow 3D stage. Names, qualities, brief descriptions, gold motifs and slightly enlarged indices accompany the complete paintings. There is no vertical gallery scroll. A spacious “Why Bhagwan incarnates” stop between Kalki and Matsya reopens the Gita introduction. Kalki remains a future prophecy, without a portrait.

Selecting a portrait pauses movement and opens its exhibit. The image fills the left column; the avatar’s identity heads the text on the right. Intent, concise account, gold takeaway and plain shaastra references are visible together. The reference section is labelled “Find out more · Shaastra” and contains no hyperlinks. A large, accessibly labelled X closes the exhibit. Previous/next avatar controls remain visible.

All ten avatars present the narrative supplied by the project owner, with intent, story, essence and values. Existing shaastra-reference entries are retained unchanged. Exact source locators and distinctions between scriptural events and exhibition interpretations are in `docs/exhibition-sources.md`. Visible English uses incarnate/incarnation where appropriate.

## Controls and access

- Mouse movement pauses automatic motion; after five seconds with a stationary pointer it resumes. Display settings offers a 1–30 second delay slider, saved in this browser. Keyboard focus or an open exhibit continues to pause motion. Arrow controls, touch dragging, touchpad wheel input and keyboard arrows support manual exploration. Automatic movement is linear; manual arrows ease between stops.
- One accessible set of cards is backed by visual copies for the seamless loop. Copies remain tappable without becoming focus targets.
- Display settings contains fullscreen, inactivity duration, still mode and a native speed slider. The slider offers 0.25×–3× in 0.05× increments, with live pace labels and Reset to 1×. The previous 12-second-per-card pace remains the 1× default, and browser preferences remain compatible.
- Reduced-motion preferences start the gallery still and remove depth motion. Visitors may explicitly choose Play. Inactivity returns an open exhibit to the gallery after three minutes by default, with a ten-second warning.
- Painting proportions, portrait composition and all previously corrected artwork are retained. Compact reading layouts adjust to keep the full text visible; very small phones omit the portrait to preserve reading space.

## Files and hosting

Static files are in `dist/`; there are no dependencies or build steps. `avatars.js` holds the content and shaastra references; `app.js` controls navigation and motion. `gallery-depth.css` contains the dimensional gallery, and `reader-refresh.css` contains the current exhibit, introduction, close-control and speed-slider refinements. Earlier styles retain the established visual identity.

The existing GPT Site retains its configured audience. For GitHub Pages, use the static files at the repository root with `.nojekyll`. All local asset paths are relative. Google Fonts provides Cormorant Garamond, DM Sans and Noto Serif Devanagari, with system fallbacks. There are no API keys or visitor trackers.

Typography uses Cormorant Garamond for English headings, DM Sans for body text and controls, and Noto Serif Devanagari for Sanskrit. All avatar intent headings share the same font, weight and responsive scale; Matsya has no separate font styling.

The supplied narratives are exhibition prose, not quotations from shaastra. The detail layout retains its existing images, fonts, navigation and references. The essence uses the full reading width to keep longer passages on the exhibition screen; smaller displays can scroll the reading panel when necessary to keep all supplied text accessible.

Enter fullscreen from Display settings to start exhibition mode. The public settings button is hidden in site fullscreen and the dedicated launcher; the operator can open it anytime with Ctrl+Alt+S on the laptop keyboard. Normal browsing and browser fullscreen keep the button available. In exhibition mode the gallery still supports scroll, swipe and primary clicks, while text selection, image dragging, secondary-click menus and common page shortcuts are blocked inside the page.

For a dedicated Chrome exhibition window, add `?exhibition=1` to the gallery URL. This enables visitor input controls even if the browser does not expose its kiosk window as fullscreen to the page. The Windows tablet launcher uses that URL and keeps tablet input on the exhibition display.

Gallery rendering defaults to Auto. It uses Smooth in exhibition mode or on high-resolution displays: the browser animates one flat rail and the page only checks nearby images periodically. Select 3D depth to restore the perspective effects, or Smooth to use the lighter rendering on any display. On Windows, check the TV's refresh rate under Settings → System → Display → Advanced display; if 4K is limited to 30 Hz, try 1080p at 60 Hz.

Gallery artwork is served as WebP. Cards request a smaller responsive image only when visible or approaching the viewport; the detail reader uses the original image dimensions. Rapid wheel and drag input is batched into animation frames.
