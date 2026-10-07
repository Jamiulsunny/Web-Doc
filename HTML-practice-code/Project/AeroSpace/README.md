# 🚀 AeroSpace — Explore Beyond the Limits

A modern, responsive space exploration website built using **HTML5, CSS3, and Vanilla JavaScript**. Designed with a futuristic dark space aesthetic, glassmorphism UI, interactive mission controls, procedural planet spheres, and smooth scroll effects.

---

## 🛠️ Step-by-Step VS Code Guide

### 1. How to Create the Folders
1. Open **Visual Studio Code**.
2. Click **File > Open Folder...** and choose where you want your project to live. Create a new folder named `AeroSpace` and select it.
3. In the Left Sidebar (Explorer), create the following subfolders:
   - Click the **New Folder** icon and name it `css`
   - Click the **New Folder** icon and name it `js`
   - Click the **New Folder** icon and name it `images`

### 2. Where to Put Each File
- Save `index.html` in the root `AeroSpace/` directory.
- Save `style.css` inside the `AeroSpace/css/` folder.
- Save `script.js` inside the `AeroSpace/js/` folder.
- Save `README.md` in the root `AeroSpace/` directory.

### 3. How to Add Images
The HTML file comes pre-loaded with curated Unsplash CDN space photography. If you want to use local offline images:
1. Save your space photos into the `images/` directory with names like `earth.jpg`, `mars.jpg`, `moon.jpg`, `galaxy.jpg`, etc.
2. In `index.html`, replace the image URLs:
   ```html
   <!-- Before -->
   <img src="[https://images.unsplash.com/](https://images.unsplash.com/)..." class="gallery-img" />

   <!-- After -->
   <img src="images/earth.jpg" class="gallery-img" />