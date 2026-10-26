# Harshu's Portfolio — Glass Minimal · Season-Aware

A glass-minimal, season-aware portfolio. The UI detects India's all-India meteorological season (IMD calendar) and re-themes itself — colours, glows, particles, 3D lighting and micro-copy. A nav switcher lets you preview all four seasons.

## Season palette

| Season | Ritu | Months | Accent |
|---|---|---|---|
| Winter | Shishir | Dec–Feb | Frost blue `#6E93C9` |
| Summer | Grishma | Mar–May | Marigold `#E5924A` |
| Monsoon | Varsha | Jun–Sep | Peacock teal `#4C9B9E` |
| Autumn | Sharad | Oct–Nov | Dusk rose `#C9758C` |

## Repo structure

- `index.html` — **the live site.** A single, fully self-contained file (zero network requests, raw-WebGL 3D hero). Download it and double-click to open — works fully offline on desktop and phone.
- `docs/PRD.md` — the full product requirements & design-system spec.
- `react-portfolio/App.tsx` — the React + Three.js (R3F) version source.

## View it

- **Offline / local:** download `index.html` from this repo and open it in any browser.
- **Private repo:** GitHub Pages needs GitHub Pro for private repos. To publish a public live URL later, flip the repo public and enable Pages (Settings → Pages → main / root).

## Branches

- `main` — stable
- `portfolio-testing` — the working branch where the current design is pushed

## Features

Glassmorphism · season auto-detect + manual switcher · raw-WebGL glass icosahedron with seasonal core, ring & satellites · pointer parallax · snow / rain / light motes / falling petals · 3D tilt cards · magnetic buttons · staggered scroll reveals · scroll progress · crossfading seasonal themes · fully responsive (desktop / tablet / phone) · prefers-reduced-motion support.

© 2026 Harshu — designed in every Indian season.
