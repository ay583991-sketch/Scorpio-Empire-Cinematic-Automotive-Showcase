# Scorpio Empire — Cinematic Automotive Showcase

A portfolio-ready, responsive redesign of the supplied Scorpio Empire website. It uses the **same original four photographs** provided with the project; no replacement stock car photos are used.

## Run locally

**Quickest:** extract the ZIP and open `index.html` in a modern browser.

**Recommended local preview:** from this folder, run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

There is no build step and no npm dependency. Google Fonts load from the internet; system-font fallbacks are included.

## Project structure

- `index.html` — semantic page structure, social metadata and page content
- `style.css` — responsive visual system, depth, card tilt styling, transitions and reduced-motion support
- `script.js` — mobile navigation, scroll indicator, reveal-on-scroll, pointer tilt, photo lightbox and form validation
- `assets/hero.jpg`, `assets/scorpio1.jpg`, `assets/scorpio2.jpg`, `assets/scorpio3.jpg` — the original supplied photos, kept unchanged
- `assets/favicon.svg` — matching site icon

## Included experience

- Cinematic hero section with layered depth and pointer-responsive photo tilt
- Dark premium design with a controlled orange accent palette
- Scroll reveal, current-section navigation and progress indicator
- Interactive detail cards
- Responsive photo archive with accessible fullscreen lightbox
- Responsive mobile menu and keyboard/focus support
- Reduced-motion preference support and a skip-to-content link
- SEO description and social sharing metadata
- Portfolio credit in the footer

## Before publishing

1. The contact form is currently a **front-end demo**. It validates the fields but does not transmit or save enquiries. Connect a backend or reputable form provider before using it publicly.
2. This version uses CSS perspective and the supplied photos to create a 3D-inspired presentation. It does **not** include a rotatable polygonal 3D vehicle. A properly licensed `.glb`/`.gltf` vehicle model is needed for a true 360-degree viewer.
3. Review the brand language and all vehicle claims before presenting the page as an official manufacturer or dealer website. The feature copy here is conceptual marketing copy, not a verified technical specification list.
4. Replace or adjust the portfolio credit if you want a different public attribution.

## Deploy

The static site can be hosted on GitHub Pages, Netlify, Cloudflare Pages or any standard static web host. Upload the complete project folder and keep the `assets` folder in place so image paths remain valid.
