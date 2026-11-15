/**
 * TAP TO BLOOM — BOTANICAL TULIP ENGINE
 * Bezier Petal S-Curves, Layered Cup Anatomy & Subsurface Glow
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clearBtn");

let width = 0;
let height = 0;
let dpr = 1;
let flowers = [];
let backgroundStars = [];
let globalTime = 0;

// Vivid Botanical Color Palettes
const BOTANICAL_PALETTES = [
  {
    name: "Imperial Vivid Magenta",
    receptacle: "rgba(255, 185, 30, 0.95)",
    baseCore: "#ff6a00",
    shadowVelvet: "#7a0026",
    midCrimson: "#e6005c",
    vibrantBody: "#ff1a75",
    lightMargin: "#ff99c2",
    rimSpecular: "#ffffff",
    ambientAura: "rgba(255, 26, 117, 0.38)",
    stemTop: "#66ff99"
  },
  {
    name: "Luminous Porcelain Rose",
    receptacle: "rgba(255, 200, 50, 0.9)",
    baseCore: "#ff7733",
    shadowVelvet: "#992244",
    midCrimson: "#e04d7e",
    vibrantBody: "#ff75a0",
    lightMargin: "#ffebf2",
    rimSpecular: "#ffffff",
    ambientAura: "rgba(255, 117, 160, 0.32)",
    stemTop: "#80ffaa"
  },
  {
    name: "Pure Ethereal White & Blush",
    receptacle: "rgba(255, 215, 60, 0.95)",
    baseCore: "#ffa64d",
    shadowVelvet: "#8c6b79",
    midCrimson: "#d9aab7",
    vibrantBody: "#fae8f0",
    lightMargin: "#ffffff",
    rimSpecular: "#ffffff",
    ambientAura: "rgba(255, 240, 248, 0.35)",
    stemTop: "#a3ffcc"
  },
  {
    name: "Royal Electric Fuchsia",
    receptacle: "rgba(255, 170, 0, 0.9)",
    baseCore: "#e63900",
    shadowVelvet: "#660022",
    midCrimson: "#cc0052",
    vibrantBody: "#ff0066",
    lightMargin: "#ff80b3",
    rimSpecular: "#fff5f8",
    ambientAura: "rgba(255, 0, 102, 0.42)",
    stemTop: "#5cd68a"
  }
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

// Draw 3D-curved organic tulip petal
function renderPetal(ctx, len, w, rot, arch, curl, palette, depthTier) {
  ctx.save();
  ctx.rotate(rot);

  const grad = ctx.createLinearGradient(0, 0, arch * 12, -len);
  if (depthTier === "rear") {
    grad.addColorStop(0, palette.baseCore);
    grad.addColorStop(0.18, palette.shadowVelvet);
    grad.addColorStop(0.65, palette.midCrimson);
    grad.addColorStop(0.92, palette.vibrantBody);
    grad.addColorStop(1, palette.lightMargin);
  } else {
    grad.addColorStop(0, palette.baseCore);
    grad.addColorStop(0.14, palette.shadowVelvet);
    grad.addColorStop(0.48, palette.vibrantBody);
    grad.addColorStop(0.84, palette.lightMargin);
    grad.addColorStop(1, palette.rimSpecular);
  }

  ctx.beginPath();
  ctx.moveTo(0, 0);

  ctx.bezierCurveTo(
    -w * (0.68 + arch * 0.15), -len * 0.22,
    -w * (1.12 + arch * 0.3) + curl * 5, -len * 0.74,
    0, -len
  );

  ctx.bezierCurveTo(
    w * (1.12 - arch * 0.3) + curl * 5, -len * 0.74,
    w * (0.68 - arch * 0.15), -len * 0.22,
    0, 0
  );
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();

  // Median vein
  ctx.beginPath();
  ctx.moveTo(0, -len * 0.08);
  ctx.quadraticCurveTo(curl * 4, -len * 0.55, 0, -len * 0.95);
  ctx.strokeStyle = depthTier === "rear" ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.38)";
  ctx.lineWidth = 1.1;
  ctx.stroke();

  // Specular rim light
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    -w * (0.68 + arch * 0.15), -len * 0.22,
    -w * (1.12 + arch * 0.3) + curl * 5, -len * 0.74,
    0, -len
  );
  ctx.bezierCurveTo(
    w * (1.12 - arch * 0.3) + curl * 5, -len * 0.74,
    w * (0.68 - arch * 0.15), -len * 0.22,
    0, 0
  );
  ctx.strokeStyle = depthTier === "rear" ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = depthTier === "rear" ? 0.7 : 1.25;
  ctx.stroke();

  ctx.restore();
}

class BotanicalTulip {
  constructor(originX, originY) {
    this.originX = originX;
    this.originY = originY;

    this.stemHeight = 240 + Math.random() * 150;
    this.flowerScale = 0.92 + Math.random() * 0.26;
    this.stemBend = (Math.random() - 0.5) * 60;
    this.stemThickness = 2.4 + Math.random() * 0.8;

    this.palette = BOTANICAL_PALETTES[Math.floor(Math.random() * BOTANICAL_PALETTES.length)];
    this.swayRate = 0.75 + Math.random() * 0.45;
    this.swayPhase = Math.random() * Math.PI * 2;
    this.swayMagnitude = 6 + Math.random() * 8;

    this.growth = 0;
    this.growthSpeed = 0.0085 + Math.random() * 0.0035;
    this.bloom = 0;
    this.bloomSpeed = 0.011 + Math.random() * 0.004;

    this.leaves = [
      {
        side: -1,
        attach: 0.16 + Math.random() * 0.06,
        len: 140 + Math.random() * 45,
        w: 20 + Math.random() * 6,
        angle: -0.42 - Math.random() * 0.18,
        curve: -38 - Math.random() * 18
      },
      {
        side: 1,
        attach: 0.33 + Math.random() * 0.07,
        len: 160 + Math.random() * 55,
        w: 22 + Math.random() * 6,
        angle: 0.40 + Math.random() * 0.18,
        curve: 40 + Math.random() * 18
      }
    ];

    if (Math.random() > 0.6) {
      this.leaves.push({
        side: Math.random() > 0.5 ? 1 : -1,
        attach: 0.52 + Math.random() * 0.06,
        len: 110 + Math.random() * 35,
        w: 16 + Math.random() * 5,
        angle: (Math.random() - 0.5) * 0.35,
        curve: (Math.random() - 0.5) * 32
      });
    }
  }

  update(dt) {
    if (this.growth < 1) {
      this.growth = Math.min(1, this.growth + this.growthSpeed * dt);
    } else if (this.bloom < 1) {
      this.bloom = Math.min(1, this.bloom + this.bloomSpeed * dt);
    }
  }

  getPoint(t, swayWeight, time) {
    const g = easeOutCubic(this.growth);
    const currH = this.stemHeight * g * t;
    const sway = Math.sin(time * this.swayRate + this.swayPhase) * this.swayMagnitude * swayWeight;
    const bend = this.stemBend * Math.pow(t, 1.55);

    return {
      x: this.originX + bend + sway * Math.pow(t, 2),
      y: this.originY - currH
    };
  }

  render(ctx, time) {
    const g = easeOutCubic(this.growth);
    if (g <= 0.01) return;

    const p0 = this.getPoint(0, 0, time);
    const pMid = this.getPoint(0.5, 0.4, time);
    const pTop = this.getPoint(1, 1, time);

    // Ground reflection
    ctx.save();
    const refLen = 50 * g;
    const refGrad = ctx.createLinearGradient(p0.x, p0.y, p0.x, p0.y + refLen);
    refGrad.addColorStop(0, "rgba(54, 255, 120, 0.35)");
    refGrad.addColorStop(0.5, "rgba(20, 160, 70, 0.12)");
    refGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.ellipse(p0.x, p0.y + 4, 18, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(50, 255, 110, 0.28)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p0.x - 2, p0.y);
    ctx.lineTo(p0.x + 2, p0.y);
    ctx.lineTo(p0.x + Math.sin(time * 2.2) * 5, p0.y + refLen);
    ctx.strokeStyle = refGrad;
    ctx.lineWidth = this.stemThickness * 1.6;
    ctx.stroke();
    ctx.restore();

    // Stem
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(pMid.x, pMid.y, pTop.x, pTop.y);
    ctx.strokeStyle = "rgba(50, 255, 120, 0.22)";
    ctx.lineWidth = this.stemThickness * 3.6;
    ctx.lineCap = "round";
    ctx.stroke();

    const sGrad = ctx.createLinearGradient(p0.x, p0.y, pTop.x, pTop.y);
    sGrad.addColorStop(0, "#083316");
    sGrad.addColorStop(0.5, "#14ad4a");
    sGrad.addColorStop(0.9, "#38ef7d");
    sGrad.addColorStop(1, this.palette.stemTop);

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(pMid.x, pMid.y, pTop.x, pTop.y);
    ctx.strokeStyle = sGrad;
    ctx.lineWidth = this.stemThickness;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(pMid.x, pMid.y, pTop.x, pTop.y);
    ctx.strokeStyle = "rgba(240, 255, 245, 0.8)";
    ctx.lineWidth = Math.max(0.7, this.stemThickness * 0.3);
    ctx.stroke();
    ctx.restore();

    // Leaves
    for (const leaf of this.leaves) {
      if (g < leaf.attach) continue;
      const leafProg = easeOutCubic(Math.min(1, (g - leaf.attach) / (1 - leaf.attach)));
      if (leafProg <= 0.02) continue;

      const leafBase = this.getPoint(leaf.attach, leaf.attach, time);
      const lLen = leaf.len * leafProg;
      const lW = leaf.w * leafProg;

      ctx.save();
      ctx.translate(leafBase.x, leafBase.y);
      const dynamicLeafSway = Math.sin(time * this.swayRate + this.swayPhase + leaf.attach) * 0.07;
      ctx.rotate(leaf.angle + dynamicLeafSway);

      const leafGrad = ctx.createLinearGradient(0, 0, leaf.curve * 0.7, -lLen);
      leafGrad.addColorStop(0, "rgba(8, 48, 22, 0.9)");
      leafGrad.addColorStop(0.45, "rgba(22, 160, 68, 0.8)");
      leafGrad.addColorStop(0.85, "rgba(65, 245, 130, 0.9)");
      leafGrad.addColorStop(1, "rgba(225, 255, 235, 0.98)");

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -lW * 0.4 + leaf.curve * 0.25, -lLen * 0.28,
        -lW * 0.9 + leaf.curve * 0.65, -lLen * 0.68,
        leaf.curve, -lLen
      );
      ctx.bezierCurveTo(
        lW * 0.2 + leaf.curve * 0.65, -lLen * 0.65,
        lW * 0.5 + leaf.curve * 0.22, -lLen * 0.24,
        0, 0
      );
      ctx.closePath();
      ctx.fillStyle = leafGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.curve * 0.45, -lLen * 0.5, leaf.curve, -lLen);
      ctx.strokeStyle = "rgba(210, 255, 225, 0.75)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.strokeStyle = "rgba(100, 255, 160, 0.45)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    }

    // Flower Head
    if (this.growth < 0.84) return;
    const headStage = easeOutCubic((this.growth - 0.84) / 0.16);
    const bStage = easeInOutSine(this.bloom);

    ctx.save();
    ctx.translate(pTop.x, pTop.y);

    const pPrev = this.getPoint(0.96, 1, time);
    const tilt = Math.atan2(pTop.y - pPrev.y, pTop.x - pPrev.x) + Math.PI / 2;
    ctx.rotate(tilt * 0.68);

    const sc = this.flowerScale * (0.42 + headStage * 0.58);
    ctx.scale(sc, sc);

    // Soft Ambient Aura
    const aura = ctx.createRadialGradient(0, -38, 4, 0, -38, 85);
    aura.addColorStop(0, this.palette.ambientAura);
    aura.addColorStop(0.6, this.palette.ambientAura.replace(/[\d\.]+\)$/, "0.1)"));
    aura.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -38, 85, 0, Math.PI * 2);
    ctx.fill();

    const pL = 86;
    const pW = 29;

    // Layer 1: Rear interior petals
    const rearSpread = 0.20 + bStage * 0.22;
    renderPetal(ctx, pL * 0.95, pW * 0.90, -rearSpread, -0.2, 0.1, this.palette, "rear");
    renderPetal(ctx, pL * 0.95, pW * 0.90, rearSpread, 0.2, 0.1, this.palette, "rear");
    renderPetal(ctx, pL * 1.00, pW * 0.86, 0, 0, 0, this.palette, "rear");

    // Layer 2: Side intermediate petals
    const sideSpread = 0.32 + bStage * 0.26;
    renderPetal(ctx, pL * 0.94, pW * 0.98, -sideSpread, -0.4, 0.15, this.palette, "mid");
    renderPetal(ctx, pL * 0.94, pW * 0.98, sideSpread, 0.4, 0.15, this.palette, "mid");

    // Layer 3: Front overlapping petals
    const frontSpread = 0.17 + bStage * 0.18;
    renderPetal(ctx, pL * 0.90, pW * 0.96, -frontSpread, -0.15, 0.22, this.palette, "front");
    renderPetal(ctx, pL * 0.90, pW * 0.96, frontSpread, 0.15, 0.22, this.palette, "front");

    // Layer 4: Center focal petal
    renderPetal(ctx, pL * 0.92, pW * 1.06, 0, 0, 0.25, this.palette, "center");

    // Layer 5: Golden amber receptacle glow
    const receptGlow = ctx.createRadialGradient(0, 0, 0, 0, -8, 24);
    receptGlow.addColorStop(0, "rgba(255, 245, 170, 0.98)");
    receptGlow.addColorStop(0.35, this.palette.receptacle);
    receptGlow.addColorStop(1, "rgba(255, 120, 0, 0)");
    ctx.fillStyle = receptGlow;
    ctx.beginPath();
    ctx.arc(0, -6, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function handleResize() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.resetTransform();
  ctx.scale(dpr, dpr);

  // Background Stars
  backgroundStars = [];
  const starCount = Math.floor((width * height) / 9500);
  for (let i = 0; i < starCount; i++) {
    backgroundStars.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      r: Math.random() * 0.9 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      pulseSpeed: Math.random() * 0.6 + 0.3,
      phase: Math.random() * Math.PI * 2
    });
  }
}
window.addEventListener("resize", handleResize);
handleResize();

function addTulip(x, y) {
  const groundY = Math.min(height - 30, Math.max(height * 0.56, y + 110));
  flowers.push(new BotanicalTulip(x, groundY));
  countEl.textContent = flowers.length;
}

function clearAll() {
  flowers = [];
  countEl.textContent = "0";
}
clearBtn.addEventListener("click", clearAll);

let lastPointerTime = 0;
canvas.addEventListener("pointerdown", (e) => {
  if (e.clientX < 180 && e.clientY < 110) return;
  const now = performance.now();
  if (now - lastPointerTime < 80) return;
  lastPointerTime = now;
  addTulip(e.clientX, e.clientY);
});

// Seed initial 12 tulips matching Reference Image 2
function seedInitialGarden() {
  const initialPositions = [
    { x: 0.07, y: 0.68 }, { x: 0.14, y: 0.77 }, { x: 0.23, y: 0.70 },
    { x: 0.34, y: 0.65 }, { x: 0.39, y: 0.78 }, { x: 0.46, y: 0.62 },
    { x: 0.54, y: 0.81 }, { x: 0.61, y: 0.67 }, { x: 0.68, y: 0.73 },
    { x: 0.76, y: 0.64 }, { x: 0.83, y: 0.78 }, { x: 0.92, y: 0.69 }
  ];

  initialPositions.forEach((pos, idx) => {
    setTimeout(() => {
      const f = new BotanicalTulip(pos.x * width, pos.y * height);
      f.growth = 1;
      f.bloom = 1;
      flowers.push(f);
      countEl.textContent = flowers.length;
    }, idx * 60);
  });
}
setTimeout(seedInitialGarden, 100);

// Animation Loop
let lastTime = performance.now();
function animate(now) {
  const dt = Math.min(2.0, (now - lastTime) / 16.666);
  lastTime = now;
  globalTime = now * 0.0015;

  ctx.clearRect(0, 0, width, height);

  // 1. Stars
  for (let s of backgroundStars) {
    const twinkle = Math.sin(globalTime * s.pulseSpeed + s.phase) * 0.25 + 0.75;
    ctx.fillStyle = `rgba(225, 240, 255, ${s.alpha * twinkle})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Y-Depth Sorting
  flowers.sort((a, b) => a.originY - b.originY);

  // 3. Flowers
  for (let flower of flowers) {
    flower.update(dt);
    flower.render(ctx, globalTime);
  }

  // 4. Ground vignette
  const groundGrad = ctx.createLinearGradient(0, height * 0.78, 0, height);
  groundGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  groundGrad.addColorStop(0.75, "rgba(1, 4, 3, 0.45)");
  groundGrad.addColorStop(1, "rgba(0, 2, 1, 0.85)");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, height * 0.76, width, height * 0.24);

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);