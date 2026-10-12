# Table by Bruno Verjus — Paris | Digital Gastronomic Experience

A luxurious, editorial-grade restaurant website designed for **Table by Bruno Verjus** (Paris), celebrating its Two Michelin Stars and worldwide recognition on The World’s 50 Best Restaurants list.

Built strictly with clean, semantic **HTML5** and modern **CSS3**, this project delivers a bespoke fine-dining digital presence with zero JavaScript, frameworks, or runtime dependencies.

---

## 🍽️ Project Overview

This project embodies the culinary ethos of Chef Bruno Verjus: **"The Art of the Living Food"**—instinctive cooking honoring organic produce, micro-terroirs, and unhurried service.

### Key Highlights
- **Strictly Vanilla Stack:** 100% pure HTML5 and CSS3. Zero JavaScript, zero external component frameworks (No React, Vue, Bootstrap, or Tailwind CSS).
- **Multi-Page Experience:** Complete internal navigation across 8 dedicated HTML pages with persistent state styling.
- **CSS-Only Interactions:**
  - Responsive mobile drawer powered by hidden checkbox and `:checked` pseudo-selectors.
  - Interactive reservation confirmation modal powered entirely by the pure CSS `:target` state machine.
- **Gastronomic Design Tokens:** A curated color scheme reflecting fine-dining materials: Noir (`#0a0a08`), Anthracite (`#141412`), Signature Gold (`#c5a059`), and Warm Parchment (`#eae5d9`).
- **Typography & Atmosphere:** Pairing classic editorial serif typography (*Cormorant Garamond*) with crisp geometric sans-serif details (*Montserrat*).
- **Accessibility (a11y):** Integrated skip-to-content bypass links, keyboard focus rings (`:focus-visible`), WCAG-compliant contrast ratios, and semantic structure. 

---

## 📁 Directory Structure

```text
table-by-bruno-verjus/
├── index.html              # Main homepage & restaurant overview
├── story.html              # History, culinary vision & terroirs
├── chef.html               # Profile & manifesto of Bruno Verjus
├── menu.html               # Seasonal carte blanche & signature dishes
├── experience.html         # Atmosphere, the pewter counter & wine cellar
├── gallery.html            # Visual editorial of dishes and dining room
├── contact.html            # Address, opening hours & access directions
├── booking.html            # Dedicated table reservation page
├── css/
│   ├── style.css           # Global design system & main site styles
│   └── booking.css         # Reservation form UX & confirmation modal styles
├── assets/
│   └── images/             # Local images directory (optional offline mode)
└── README.md               # Project documentation