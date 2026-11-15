# 🪐 Solar System Explorer // Pure CSS Orrery

An interactive, realistic-looking, and responsive 3D-shaded Solar System model built with **100% Pure HTML5 & CSS3** — absolutely **zero JavaScript**, **zero external images**, and **no third-party dependencies**.

---

## 🌌 Key Highlights

- **Pure HTML & CSS Architecture:** Driven entirely by semantic HTML markup, CSS variables, pseudo-elements, and `@keyframes` animations.
- **Image-Free Procedural Rendering:**
  - Multi-tier parallax starfield and nebula created using layered `box-shadow` values and blurred radial gradients.
  - 3D spherical depth for planets crafted via spherical `radial-gradient` shading and inset shadows.
  - Saturn's rings with tilted 3D perspective using CSS 3D transforms (`rotateX`).
  - Jupiter's banded storm layers rendered through `repeating-linear-gradient`.
- **Hybrid Interactivity (Desktop & Touch):**
  - **Desktop:** Hover over any planetary body to automatically pause its orbital revolution and summon a sci-fi telemetry HUD card.
  - **Mobile/Touch:** Pure-CSS radio button hack (`input[type="radio"]` + `<label>` binding) allows users to tap planets or dock buttons to trigger information overlays without mouse input.
- **Accurate Planetary Telemetry:** Every card details diameter, orbital radius, revolution period, rotation duration, confirmed moons, surface temperature, and a curated observation note.
- **HUD Configuration Toggles:** Pure-CSS toggle switches to reveal/hide orbital tracks and enable a 5x accelerated "Warp Speed" orbit mode.
- **Smooth 60 FPS Orbit Engine:** Independent orbit speeds paired with precise counter-rotation ensures planetary textures, shadows, and labels remain upright throughout full 360-degree sweeps.
- **Accessibility:** Fully supports `@media (prefers-reduced-motion: reduce)` to disable high-frequency animations for motion-sensitive users.

---

## 🎨 Color Palette & CSS Variables

Configured globally within `:root` in `style.css`:

| Variable | Hex Value / Value | Description |
| :--- | :--- | :--- |
| `--space-black` | `#03030a` | Deep universe background core |
| `--space-navy` | `#060919` | Intermediate orbital backdrop |
| `--neon-cyan` | `#00e5ff` | Primary telemetry, Earth, Uranus accents |
| `--neon-purple` | `#8a5cff` | Distant nebula, Neptune highlight |
| `--sun-gold` | `#ffb300` | Solar body, Venus, Saturn, Jupiter glow |
| `--alert-red` | `#ff3366` | Mars planetary signature & warnings |
| `--text-primary` | `#e6f1ff` | High-contrast readable typography |
| `--system-scale` | `min(100vw, 100vh)` | Dynamic viewport scale factor |

---

## 🛠️ Built With

- **HTML5:** Semantic architecture (`<header>`, `<main>`, `<aside>`, `<article>`, `<nav>`, `<footer>`).
- **CSS3:**
  - Custom CSS properties (`:root`)
  - CSS 2D & 3D Transforms (`rotate`, `rotateX`, `rotateY`, `scale`)
  - Advanced Gradients (`radial-gradient`, `linear-gradient`, `repeating-linear-gradient`)
  - CSS `:has()` relational selectors and `:checked` sibling combinations
  - Backdrop filters (`backdrop-filter: blur()`)
- **Google Fonts:**
  - `Orbitron` (Sci-Fi HUD titles and coordinates)
  - `Exo 2` (Telemetry data grids and body text)

---

## 📁 Project Structure

```text
solar-system/
├── index.html        # HTML structure, state controllers & planetary layout
├── style.css         # Reset, variables, gradients, orbits, HUD & keyframes
└── README.md         # Project documentation