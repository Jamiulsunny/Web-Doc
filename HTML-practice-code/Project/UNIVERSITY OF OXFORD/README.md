# University of Oxford — Digital Experience Concept

A sophisticated, editorial-grade institutional web platform concept for the **University of Oxford**, engineered strictly with semantic **HTML5** and modern **CSS3**. 

Designed to reflect centuries of academic prestige, intellectual rigor, and multidisciplinary innovation through a refined dark-navy and gold visual identity.

---

## 🏛️ Project Overview

This project serves as an independent educational web design concept showcasing clean semantic structure, WCAG-compliant accessibility, and fluid responsive design—**with zero JavaScript dependencies, CSS preprocessors, or third-party UI frameworks**.

### Key Architectural Highlights
- **Strictly Vanilla Stack:** Pure HTML5 and CSS3 only (no React, Bootstrap, Tailwind CSS, jQuery, or JavaScript runtime).
- **CSS-Only Responsive Drawer:** Fully functional mobile hamburger navigation implemented using the CSS checkbox hack (`:checked` pseudo-class).
- **Accessible & Screen-Reader Ready:** Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`), logical heading trees, skip-to-content bypass link, and visible focus rings.
- **Editorial Design System:** Built on a strict CSS custom property token architecture honoring Oxford’s visual identity (Oxford Navy, Academic Deep Blue, restrained Gold accent, Warm Ivory, and Pure White).
- **Reduced Motion Support:** Dedicated `@media (prefers-reduced-motion: reduce)` block disabling non-essential transitions for vestibular motion sensitivity.

---

## 📁 File Structure

```text
oxford-university-website/
├── index.html                 # Main website markup & semantic landmarks
├── style.css                  # Unified CSS3 stylesheet & design tokens
├── README.md                  # Project documentation & run guide
└── assets/
    └── images/                # Local image directory (optional offline assets)
        ├── oxford-hero.jpg
        ├── oxford-campus.jpg
        ├── humanities.jpg
        ├── medical-sciences.jpg
        ├── physical-sciences.jpg
        ├── social-sciences.jpg
        ├── research.jpg
        ├── student-life.jpg
        └── library.jpg

🎨 Visual Identity & Design TokensThe typography and color scheme are managed centrally via CSS Custom Properties in style.css:TokenHex / ValueSemantic Role--color-oxford-navy#002147Primary brand color, headings, active states--color-academic-blue#00152EDeep background foundation, hero overlay, utility bars--color-gold#C5A253Restrained prestige accent, key borders, CTAs--color-white #FFFFFFPrimary surface cards, clear body contrast--color-ivory#F7F5EFAlternating section backgrounds, search container--color-text-dark#20252BHigh-contrast body copy (meets WCAG AAA standards)--color-text-muted#68717CEditorial subheadings and supporting descriptions--font-serifPlayfair DisplayClassical editorial display headings--font-sansInterClean, highly legible sans-serif UI typography

