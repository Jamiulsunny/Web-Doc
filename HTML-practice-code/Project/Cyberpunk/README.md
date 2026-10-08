# ⚡ NEON-GRID // Cyberpunk Sci-Fi Control Panel Dashboard

A visually stunning, futuristic, neon-drenched Sci-Fi Control Panel and Telemetry Dashboard built strictly using **100% Pure HTML5 & CSS3** — absolutely **zero JavaScript**, **zero external image files**, and **no third-party frameworks**.

---

## 📸 Key Features

- **Strict Zero-JS Architecture:** Every single interactive state, animation, and UI element is driven purely by CSS (pseudo-classes, `@keyframes`, and CSS variables).
- **Glitch Text Effect:** High-tech digital glitch animations using CSS `::before` / `::after` layers, `clip-path: inset()`, and cyan/magenta offsets.
- **Threat Radar Scanner:** 360-degree continuous circular radar sweep powered by CSS `conic-gradient()` with pulsing hostile telemetry dots.
- **Spinning Fusion Reactor:** Concentric multi-speed counter-rotating rings with a pulsating core.
- **Pure-CSS Checkbox Hack:** Fully functional, responsive collapsible navigation drawer on mobile viewports using hidden checkboxes and connected labels.
- **Glassmorphic Sci-Fi Aesthetic:** Dark navy background, moving 3D floor perspective grid, ambient CRT scanline flickers, and polygon cut-corner cards (`clip-path`).
- **Live Terminal Simulator:** Streaming command terminal with typing animation using `steps()` timing and a blinking cursor.
- **Performance & Accessibility:** Fully responsive design (CSS Grid + Flexbox) paired with `@media (prefers-reduced-motion: reduce)` to accommodate motion sensitivity.

---

## 🎨 Color Palette & Design Tokens

Defined centrally via CSS custom properties in `:root`:

| Token | Hex Value | Preview / Usage |
| :--- | :--- | :--- |
| `--bg-dark` | `#05060f` | Main background depth |
| `--neon-cyan` | `#00f0ff` | Primary telemetry, gauges, active states |
| `--neon-magenta`| `#ff2bd6` | Glitch split, threat alerts, memory ring |
| `--neon-purple` | `#9b5cff` | Fusion reactor rings, histogram accents |
| `--neon-yellow` | `#f9f002` | Sub-system warnings, degraded server pills |
| `--neon-green` | `#39ff14` | Status online dots, network speeds, uptime |

---

## 🛠️ Built With

- **HTML5:** Semantic architecture (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<table>`).
- **CSS3:**
  - CSS Custom Variables (`:root`)
  - CSS Grid & Flexbox (12-column modular dashboard layout)
  - `conic-gradient()` & `radial-gradient()` (Circular meters and radar)
  - `clip-path: polygon()` (Angled cyberpunk card corners and toggles)
  - CSS Keyframe Animations & Transitions
- **Google Fonts:**
  - `Orbitron` (Sci-Fi headers, labels, metrics)
  - `Share Tech Mono` (Terminal logs, telemetry readouts)

---

## 📁 Project Structure

```text
cyberpunk-dashboard/
├── index.html        # Semantic dashboard structure & icons
├── style.css         # Reset, variables, grid layout, components & keyframes
└── README.md         # Documentation