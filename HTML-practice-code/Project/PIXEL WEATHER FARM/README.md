# 🌾 Pixel Weather Farm // Pure HTML & CSS Game

A charming, playable retro browser game built using **100% Pure HTML5 & CSS3** — absolutely **zero JavaScript**, **no external image files/sprites/SVGs**, and **no canvas**. Every pixel, character, animation, and game loop is drawn and orchestrated solely through CSS techniques.

---

## 🎮 Game Concept & Rules

Take control of the weather over a peaceful pixel-art farm! Each weather mode alters the visual environment and summons unique blessings to collect:

- **☀️ SUN Mode:** Harvest 8 floating golden sun sparkles. Sunflowers turn to face the light, birds flutter overhead, and the farmer surveys the fields.
- **🌧️ RAIN Mode:** Catch 8 falling pixel raindrops. Rain streaks across the sky, puddles form, crops grow taller, the farmer pops open an umbrella, and frogs leap from the pond.
- **🌙 NIGHT Mode:** Collect 8 glowing fireflies drifting across the darkness. A pixel moon and twinkling starfield appear, the farmhouse lights click on, the farmer rests inside, and the scarecrow's eyes glow.

---

## 🚀 Key Highlights & Mechanics

- **Zero-JavaScript Architecture:** The entire game loop, interactivity, score tracking, and win states run on pure CSS selectors and standard HTML5 form controls.
- **CSS Counters Scoring:** Live in-game telemetry powered by `counter-reset` and `counter-increment`, displaying real-time counts for individual weather items and the total score (`24/24`).
- **Interactive Collectibles & Pop Effect:** Collectibles are styled `<label>` elements linked to hidden checkboxes. Tapping or clicking triggers a CSS-based `@keyframes` popping animation that removes the item and increments your score.
- **Box-Shadow Pixel Art:** All graphics—including the farmer, farmhouse, crops, animals, sun, and raindrops—are rendered using pure CSS box-shadow coordinate matrices and gradients.
- **Infinite Parallax Backgrounds:** Continuous horizontal looping layers (mountains, hills, trees) driven by `@keyframes` using the `steps()` timing function for an authentic retro feel.
- **Instant Game Reset:** Wrapped in an HTML `<form>`, allowing the "NEW GAME" button (`<button type="reset">`) to clear all checks and reset the game state natively without JavaScript.
- **Responsive & Touch Friendly:** Scaled using a central `--px` CSS variable with `clamp()` and `vmin` units, ensuring seamless gameplay on desktop, tablet, and mobile touchscreens.

---

## 🛠️ Built With

- **HTML5:** Semantic form controls (`<form>`, `<input type="radio">`, `<input type="checkbox">`, `<label>`, `<main>`, `<header>`, `<footer>`).
- **CSS3:**
  - CSS Custom Properties / Variables (`:root`)
  - CSS Counters (`counter()`, `counter-increment`)
  - CSS Sibling Combinators (`~`)
  - Box-shadow pixel mapping
  - Stepped keyframe animations (`steps()`)
- **Google Fonts:**
  - `Press Start 2P` (Retro 8-bit arcade typography)

---

## 📁 Project Structure

```text
pixel-weather-farm/
├── index.html        # Game DOM, input state controllers & pixel scenery
├── style.css         # CSS engine, pixel sprites, weather states & animations
└── README.md         # Documentation