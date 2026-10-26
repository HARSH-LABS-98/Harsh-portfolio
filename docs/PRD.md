# PRD — Harshu's Portfolio
**Direction: "Glass Minimal" · Season-aware UI · v2 (supersedes the "Quiet Coffee House" warm-cream direction for this product)**

---

## 1. Product Overview

A personal portfolio website for **Harsh ("Harshu")** — designer, developer and product thinker from India. The site presents Harshu's journey (not a finished career): a student exploring **health, wealth and financial independence** while building products and businesses.

The signature feature: the **UI adapts to India's seasons**. The site reads the current month, detects the active all-India meteorological season, and re-themes the entire interface — accent colour, ambient glows, particles, 3D scene lighting and micro-copy. A manual season switcher lets any visitor preview all four looks.

| # | Product in the suite | Status |
|---|---|---|
| P1 | **Harshu's Portfolio** (this PRD, this build) | ✅ Built now |
| P2 | Test variant 1 — *proposed: "Quiet Coffee House" warm-cream edition* (uses the earlier saved token set) | To be discussed |
| P3 | Test variant 2 — *proposed: dark "Aurora Glass" edition* | To be discussed |
| P4 | Test variant 3 — *proposed: monochrome brutalist test* | To be discussed |

> P2–P4 are placeholders only. The user will define them later; this PRD covers P1.

---

## 2. Goals & Success Criteria

**Goals**
1. First impression in < 2 seconds: clear identity, calm aesthetic, one focal 3D object.
2. Season-aware theming that feels magical, not gimmicky — colours stay minimal and glass stays white.
3. Fully responsive: desktop, tablet and phone.
4. Portfolio-grade motion: staggered reveals, springy 3D tilt, pointer parallax, floating particles, magnetic buttons.
5. Frame the journey: honest, story-driven copy (no fake client logos, no lorem ipsum).

**Success metrics**
- Lighthouse-style budget met (see §9 Performance).
- Every interactive element has hover + focus states.
- Zero layout shift at 360 px, 768 px, 1024 px and 1440 px widths.
- Season switcher works in ≤ 1 tap; theme transition ≤ 1.2 s crossfade.

---

## 3. Audience

| Segment | Need |
|---|---|
| Recruiters / collaborators | Quickly judge craft + range, find contact in one tap |
| Design/dev peers | Enjoy the 3D and seasonal detail, share the link |
| Harshu himself | A living home for projects, experiments and the journey |

---

## 4. The Season System (signature feature)

**All-India meteorological seasons (IMD calendar):**

| Season | Ritu | Months | Accent | Soft tint (surfaces/glows) | Deep (accessible text/links) | Ambient particle | Mood copy |
|---|---|---|---|---|---|---|---|
| **Winter** | Shishir | Dec–Feb | `#6E93C9` frost blue | `#EAF1FA` | `#33517A` | Soft snowfall | "Frost-tipped glass, warm hearts." |
| **Summer** | Grishma | Mar–May | `#E5924A` marigold | `#FBEFDD` | `#8A4E1C` | Rising light motes | "Marigold mornings, mango afternoons." |
| **Monsoon** | Varsha | Jun–Sep | `#4C9B9E` peacock teal | `#E0F1F0` | `#1F5A5D` | Falling rain streaks | "Petrichor, chai and fresh code." |
| **Autumn** | Sharad | Oct–Nov | `#C9758C` dusk rose | `#F8E7EC` | `#8A3A55` | Drifting petals | "Festival skies, marigold light." |

**Behaviour**
- Default mode: **Auto** — season derived from `new Date().getMonth()`; one season spans the whole of India (no city-level detection in v1).
- Nav switcher: `Auto` + 4 season icons; active state uses the accent.
- Theme transitions: background/glow layers **crossfade over ~1.2 s** (gradients can't interpolate, so layers are swapped with animated opacity).
- 3D scene: accent material colour and light colours **lerp smoothly** each frame toward the season target.
- Particles: per-season field (snow / motes / rain / petals) with crossfade; pure CSS keyframes, `pointer-events: none`.
- Toast confirms a manual switch; a hero line names the current season.

---

## 5. Design Tokens (DESIGN.md contract)

### 5.1 Mood
Minimal **glass-white**: a quiet, sunlit interface of frosted surfaces floating over soft seasonal light. Calm chrome, one accent per season, typography doing the talking. 3D is atmospheric — never a diorama.

### 5.2 Colour tokens
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F8FAFD → #EEF2F8` (gradient) | Page background |
| `--surface` | `rgba(255,255,255,.55)` + `backdrop-blur 18px` + 1px `rgba(255,255,255,.70)` border | Glass cards, nav, chips |
| `--ink` | `#1B2432` | Headings, primary text |
| `--muted` | `#5B6575` | Body/secondary text |
| `--accent` | seasonal (table §4) | ~10% of surface: buttons, links, highlights, 3D core, particles |
| `--accent-soft` | seasonal | Ambient glows, tints, project thumbnails |
| `--accent-deep` | seasonal | Accessible accent text & gradient ends |
| `--shadow` | `0 8px 32px rgba(31,38,135,.08)` | Card depth |
| Grain | SVG noise overlay @ ~3.5% opacity | Paper-feel finish |

Contrast: body text ≥ 4.5:1 on background; accent-deep used for small accent text on light surfaces.

### 5.3 Typography
- **Display / body sans:** system UI stack (`font-sans`). Headings `600–700`, tracking `-0.02…-0.03em`, line-height 1.05–1.2.
- **Aesthetic accent:** serif italic (`Georgia, 'Times New Roman', serif`) for one expressive word per heading, in the season accent — the signature "aesthetic" typographic move.
- **Labels:** 11–12px, uppercase, tracking `0.25–0.3em`, accent-deep or muted.
- **Scale:** 12 / 14 / 16–18 / 20 / 28 / 40 / 56–88px. Body line-height 1.6–1.8, max ~68ch.

### 5.4 Space, radius, depth
- Spacing scale: 4/8 base; sections `py-20 md:py-28`; container `max-w-6xl px-6`.
- Radii: cards `24px` (`rounded-3xl`), buttons/inputs `16–20px`, pills full.
- Depth: layered — page gradient → accent radial glows → grain → glass surfaces → 3D canvas → particles.
- Tilt cards: max **7°** spring rotation on pointer; inner content `translateZ` for parallax.

### 5.5 Motion
- Reveals: fade + 30px rise, `0.8s`, ease `[0.22,1,0.36,1]`, stagger `0.08–0.12s`, `whileInView` once.
- Hover: lift `scale 1.02–1.05 / y -2–4px`; press `scale .97`; magnetic primary CTA (~25% pointer pull).
- 3D: slow auto-rotation ≤ 0.15 rad/s, `Float` bobbing, pointer parallax via lerp (never jumps).
- All motion gated by `prefers-reduced-motion` (static render, no tilt/float/particles animation).

---

## 6. Information Architecture

1. **Nav (fixed glass):** wordmark `harshu.portfolio` · links (About, Skills, Work, Journey, Contact) · season switcher · "Let's talk" CTA · mobile menu.
2. **Hero:** eyebrow label, display headline with serif-italic accent word, season-aware tagline, 2 CTAs (magnetic), 3 glass chips, live 3D glass sculpture with inner seasonal core.
3. **About:** story card + value chips (Curiosity · Craft · Consistency · Courage).
4. **Skills:** 4 glass cards — Product & UI/UX Design · Frontend Engineering · Product Strategy · Building in Public — icon, one-liner, tag chips.
5. **Work:** 3 project cards — *Ai-studio* (open source), *FinFit* (product design), *Ritu UI* (this site's design system) — tinted gradient thumbs, 3D tilt, external link affordances.
6. **Journey:** vertical timeline 2024 → 2025 → 2026 → "Next", glass dots, final entry faded/dashed (the horizon).
7. **Contact:** split layout — pitch + GitHub/email chips, glass form (name, email, message) with focus rings and inline success state (no backend in v1).
8. **Footer:** "© 2026 Harshu — designed in every Indian season." + GitHub link.

**Real content anchors:** Harshu's GitHub `HARSH-LABS-98` (repo: Ai-studio). Bio, photo and project links are placeholders to be replaced with real assets.

---

## 7. 3D Spec (React Three Fiber + drei)

- One focal object: **glass icosahedron** (flat-shaded, `MeshPhysicalMaterial`: transmission, roughness ~0.15, ior 1.45, clearcoat) with an **inner seasonal core sphere** (accent, emissive) — the season literally lives inside the glass.
- Thin metallic ring + 3 small frosted satellites on independent `Float`s.
- Lighting: ambient + directional key + accent point light + **procedural `<Environment>` with `Lightformer`s** (no external HDR fetches — offline-safe), soft `ContactShadows` floor.
- Pointer parallax: lerped group rotation; slow auto-rotation.
- Budget: ≤ 10 meshes, `dpr ≤ 1.5`, no per-frame allocations (reused vectors/colors), ≤ 150k triangles (actual ≪ 10k).
- Static-screenshot rule: the scene must look composed even when not moving.
- Fallback: reduced-motion → no float/rotation; scene still renders.

---

## 8. Responsive Matrix

| | Phone < 640px | Tablet 640–1024px | Desktop > 1024px |
|---|---|---|---|
| Nav | Logo + season switcher + hamburger; glass dropdown panel | Full links | Full links + CTA |
| Hero | Stacked; 3D scene 288px tall below text | Stacked; 3D ~380px | 2-col; 3D ~560px |
| Skills | 1 col | 2 col | 4 col (lg:2xl 2×2) |
| Work | 1 col | 2 col → 1 col at sm edge cases | 3 col |
| Contact | 1 col | 2 col at md+ | 2 col |
| Particles | Reduced counts (perf) | Standard | Standard |
| Tap targets | ≥ 44px | — | — |

---

## 9. Accessibility & Performance

- Focus-visible rings (accent-tinted), semantic headings, `aria-label`s on icon-only buttons, labels on all inputs.
- Contrast per §5.2; accent text always `--accent-deep` on light.
- `prefers-reduced-motion` respected globally.
- Perf budget: single R3F canvas; CSS-only particles; capped DPR; no network requests at runtime (fonts are system stacks, env map is procedural).

---

## 10. Acceptance Criteria (v1)

- [x] Glass-white minimal aesthetic, one seasonal accent, no off-token colours.
- [x] Season auto-detection (IMD months) + manual switcher + smooth crossfade.
- [x] 3D glass hero with seasonal core, parallax, soft shadows; looks good as a still.
- [x] Tilt cards, staggered reveals, magnetic CTA, particles, grain, glows.
- [x] Works at 360px → 1440px+ with no horizontal scroll.
- [x] Real content structure (story-driven, Harshu's actual GitHub).
- [ ] Replace placeholder bio/email/project imagery with real assets (user, later).
- [ ] Hook the contact form to a real inbox/endpoint (later phase).

---

## 11. Open Questions (for later discussion)

1. Real bio text, portrait/photo treatment, and resume PDF?
2. The 3 test websites: keep the proposed P2–P4 directions, or new ones?
3. Custom domain + deployment target (Vercel/Netlify/GitHub Pages)?
4. Analytics and SEO meta (title, description, OG image per season?).