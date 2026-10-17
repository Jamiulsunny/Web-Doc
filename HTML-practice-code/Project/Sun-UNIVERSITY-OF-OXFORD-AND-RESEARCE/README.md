# University of Oxford — Digital Campus & Academic Portal

An institutional digital platform concept for the **University of Oxford**, featuring a primary campus website and a dedicated Academic & Research Foundations Portal. Built strictly with semantic **HTML5** and modern **CSS3**, completely free of JavaScript runtime dependencies, CSS frameworks, or external preprocessors...

----------------------------------------------------

## 🏛️ Project Overview

This project implements a multi-page editorial web presence designed to showcase academic heritage, scholarly research, collegiate student life, and structured institutional dossiers.
---------------------------------
### Core Architecture Highlights
- **Multi-Page Interconnected Architecture:**
  - `index.html`: Public-facing institutional portal featuring the campus overview, divisional previews, life at Oxford, and the Academic Explorer Gateway.
  - `academic-portal.html`: Dedicated deep-dive academic webpage containing structured divisional dossiers, flagship cross-disciplinary research tables, statutory endowed chairs, peer-reviewed publications, and direct links to verified external sources.
- **Strictly Vanilla Stack:** 100% pure HTML5 and CSS3. Zero JavaScript, zero npm packages, zero runtime frameworks.
- **CSS-Only Responsive Navigation:** Independent mobile menu drawers built using semantic `<input type="checkbox">` toggles and adjacent sibling combinators (`:checked ~ .site-nav`).
- **Comprehensive Accessibility (a11y):** Skip-to-content bypass links, visible keyboard focus indicators, landmark semantic structuring, accessible color contrast ratios, and `prefers-reduced-motion` overrides.
- **Centralized Design System:** Single tokenized stylesheet (`style.css`) managing color palettes, typography, spacing scales, card components, data tables, and media queries across both pages.

---

## 📁 Directory Structure

```text
oxford-university-website/
├── index.html              # Main campus home & discovery gateway
├── academic-portal.html    # Dedicated academic & research portal
├── style.css               # Shared CSS3 design system & responsive rules
├── README.md               # Project documentation & setup instructions
└── assets/
    └── images/             # Directory for local image assets (offline mode)
