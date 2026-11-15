import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * প্রফেশনাল লুমিনাস বোটানিক্যাল কালার প্যালেট
 * প্রতিটি শেডে ইন্টার্নাল শ্যাডো, বডি কালার, রিম লাইট এবং গোল্ডেন বেস গ্লো ক্যালিব্রেট করা।
 */
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

// স্মুথ অর্গানিক গ্রোথ ইজিং
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export default function TulipGarden() {
  const canvasRef = useRef(null);
  const [tulipCount, setTulipCount] = useState(0);
  const engineRef = useRef({
    flowers: [],
    stars: [],
    dpr: 1,
    width: 0,
    height: 0,
    animationFrameId: null,
    globalTime: 0
  });

  /**
   * অর্গানিক টিউলিপ পাপড়ি ড্রয়িং ইঞ্জিন
   * ন্যাচারাল কার্ভড উইংস, ভেসেল লাইন এবং ট্রান্সলুসেন্ট রিম লাইটিং
   */
  const renderPetal = useCallback((ctx, len, w, rot, arch, curl, palette, depthTier) => {
    ctx.save();
    ctx.rotate(rot);

    // ১. থ্রি-ডাইমেনশনাল ব্যাকগ্রাউন্ড-টু-টিপ লিনিয়ার গ্রেডিয়েন্ট
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

    // ২. রিয়ালিস্টিক টিউলিপ কার্ভড আউটলাইন (Double Bezier Taper)
    ctx.beginPath();
    ctx.moveTo(0, 0);

    // বাম পাশের পাপড়ির খাঁজ ও আউটওয়ার্ড আর্ক
    ctx.bezierCurveTo(
      -w * (0.68 + arch * 0.15), -len * 0.22,
      -w * (1.12 + arch * 0.3) + curl * 5, -len * 0.74,
      0, -len
    );

    // ডান পাশের পাপড়ির সূক্ষ্ম ফ্ল্যাঞ্জ
    ctx.bezierCurveTo(
      w * (1.12 - arch * 0.3) + curl * 5, -len * 0.74,
      w * (0.68 - arch * 0.15), -len * 0.22,
      0, 0
    );
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    // ৩. সাবসারফেস মিডিয়ান ভেইন (পাপড়ির ভেতরের শিরদাঁড়া)
    ctx.beginPath();
    ctx.moveTo(0, -len * 0.08);
    ctx.quadraticCurveTo(curl * 4, -len * 0.55, 0, -len * 0.95);
    ctx.strokeStyle = depthTier === "rear"
      ? "rgba(255, 255, 255, 0.12)"
      : "rgba(255, 255, 255, 0.38)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // ৪. সেকেন্ডারি মাইক্রো-ভেইন্স (পাতলা আর্টেরিয়াল স্ট্রাকচার)
    if (depthTier !== "rear") {
      ctx.beginPath();
      ctx.moveTo(-w * 0.3, -len * 0.35);
      ctx.quadraticCurveTo(-w * 0.4, -len * 0.6, 0, -len * 0.9);
      ctx.moveTo(w * 0.3, -len * 0.35);
      ctx.quadraticCurveTo(w * 0.4, -len * 0.6, 0, -len * 0.9);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }

    // ৫. আল্ট্রা-শার্প ব্রাইট রিম লাইট (ফোটন রিফ্লেকশন)
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
    ctx.strokeStyle = depthTier === "rear"
      ? "rgba(255, 255, 255, 0.22)"
      : "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = depthTier === "rear" ? 0.7 : 1.25;
    ctx.stroke();

    ctx.restore();
  }, []);

  /**
   * ফুল ও বোঁটার ম্যাথমেটিক্যাল ক্লাস
   */
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

    getPoint(t, swayWeight, globalTime) {
      const g = easeOutCubic(this.growth);
      const currH = this.stemHeight * g * t;
      const sway = Math.sin(globalTime * this.swayRate + this.swayPhase) * this.swayMagnitude * swayWeight;
      const bend = this.stemBend * Math.pow(t, 1.55);

      return {
        x: this.originX + bend + sway * Math.pow(t, 2),
        y: this.originY - currH
      };
    }

    render(ctx, globalTime) {
      const g = easeOutCubic(this.growth);
      if (g <= 0.01) return;

      const p0 = this.getPoint(0, 0, globalTime);
      const pMid = this.getPoint(0.5, 0.4, globalTime);
      const pTop = this.getPoint(1, 1, globalTime);

      // --- ১. গ্রাউন্ড রিফ্লেকশন ---
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
      ctx.lineTo(p0.x + Math.sin(globalTime * 2.2) * 5, p0.y + refLen);
      ctx.strokeStyle = refGrad;
      ctx.lineWidth = this.stemThickness * 1.6;
      ctx.stroke();
      ctx.restore();

      // --- ২. লুমিনাস বোঁটা (Stem) ---
      ctx.save();
      // সফট গ্রিন আউটার গ্লো
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(pMid.x, pMid.y, pTop.x, pTop.y);
      ctx.strokeStyle = "rgba(50, 255, 120, 0.22)";
      ctx.lineWidth = this.stemThickness * 3.6;
      ctx.lineCap = "round";
      ctx.stroke();

      // মূল বোটানিক্যাল গ্রেডিয়েন্ট
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

      // ফিলামেন্ট লাইট সেন্টার
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(pMid.x, pMid.y, pTop.x, pTop.y);
      ctx.strokeStyle = "rgba(240, 255, 245, 0.8)";
      ctx.lineWidth = Math.max(0.7, this.stemThickness * 0.3);
      ctx.stroke();
      ctx.restore();

      // --- ৩. তলোয়ার আকৃতির অর্গানিক পাতা (Leaves) ---
      for (const leaf of this.leaves) {
        if (g < leaf.attach) continue;
        const leafProg = easeOutCubic(Math.min(1, (g - leaf.attach) / (1 - leaf.attach)));
        if (leafProg <= 0.02) continue;

        const leafBase = this.getPoint(leaf.attach, leaf.attach, globalTime);
        const lLen = leaf.len * leafProg;
        const lW = leaf.w * leafProg;

        ctx.save();
        ctx.translate(leafBase.x, leafBase.y);
        const dynamicLeafSway = Math.sin(globalTime * this.swayRate + this.swayPhase + leaf.attach) * 0.07;
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

        // পাতার উজ্জ্বল মধ্য শিরা
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

      // --- ৪. বাস্তবসম্মত ফুলের পাপড়ি ও ব্লুম (Flower Head) ---
      if (this.growth < 0.84) return;
      const headStage = easeOutCubic((this.growth - 0.84) / 0.16);
      const bStage = easeInOutSine(this.bloom);

      ctx.save();
      ctx.translate(pTop.x, pTop.y);

      // ট্যাঞ্জেন্ট অ্যাঙ্গেল হিসাব করে ফুলকে স্বাভাবিকভাবে বাঁকানো
      const pPrev = this.getPoint(0.96, 1, globalTime);
      const tilt = Math.atan2(pTop.y - pPrev.y, pTop.x - pPrev.x) + Math.PI / 2;
      ctx.rotate(tilt * 0.68);

      const sc = this.flowerScale * (0.42 + headStage * 0.58);
      ctx.scale(sc, sc);

      // অ্যাম্বিয়েন্ট অরা গ্লো (সফট ব্যাকলাইট)
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

      // লেয়ার ১: ভেতরের পেছনের ৩টি ডার্ক পাপড়ি (Background Cup)
      const rearSpread = 0.20 + bStage * 0.22;
      renderPetal(ctx, pL * 0.95, pW * 0.90, -rearSpread, -0.2, 0.1, this.palette, "rear");
      renderPetal(ctx, pL * 0.95, pW * 0.90, rearSpread, 0.2, 0.1, this.palette, "rear");
      renderPetal(ctx, pL * 1.00, pW * 0.86, 0, 0, 0, this.palette, "rear");

      // লেয়ার ২: সাইডের ইন্টারমিডিয়েট ফ্ল্যাঙ্ক পাপড়ি (Mid Cup Curve)
      const sideSpread = 0.32 + bStage * 0.26;
      renderPetal(ctx, pL * 0.94, pW * 0.98, -sideSpread, -0.4, 0.15, this.palette, "mid");
      renderPetal(ctx, pL * 0.94, pW * 0.98, sideSpread, 0.4, 0.15, this.palette, "mid");

      // লেয়ার ৩: ফোরগ্রাউন্ড ওভারল্যাপিং সামনের দুটি পাপড়ি (Front Wings)
      const frontSpread = 0.17 + bStage * 0.18;
      renderPetal(ctx, pL * 0.90, pW * 0.96, -frontSpread, -0.15, 0.22, this.palette, "front");
      renderPetal(ctx, pL * 0.90, pW * 0.96, frontSpread, 0.15, 0.22, this.palette, "front");

      // লেয়ার ৪: সেন্ট্রাল সেন্টারপিস পাপড়ি (Main Front Cup Petal)
      renderPetal(ctx, pL * 0.92, pW * 1.06, 0, 0, 0.25, this.palette, "center");

      // লেয়ার ৫: গোল্ডেন রিসেপ্টাকল বেস (টিউলিপের নিচের জীবন্ত অ্যাম্বার আলো)
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

  // নতুন টিউলিপ যোগ করার ফাংশন
  const plantTulip = useCallback((clientX, clientY) => {
    const { height, flowers } = engineRef.current;
    const groundY = Math.min(height - 30, Math.max(height * 0.56, clientY + 110));
    const newFlower = new BotanicalTulip(clientX, groundY);

    flowers.push(newFlower);
    setTulipCount(flowers.length);
  }, []);

  // ক্লিয়ার অল স্টেট
  const handleClear = useCallback(() => {
    engineRef.current.flowers = [];
    setTulipCount(0);
  }, []);

  // উইন্ডো রিসাইজ এবং রেটিনা স্কেলিং
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      engineRef.current.dpr = dpr;
      engineRef.current.width = w;
      engineRef.current.height = h;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // স্টারফিল্ড জেনারেশন
      const starCount = Math.floor((w * h) / 9500);
      const newStars = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          r: Math.random() * 0.9 + 0.3,
          alpha: Math.random() * 0.4 + 0.1,
          pulseSpeed: Math.random() * 0.6 + 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
      engineRef.current.stars = newStars;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // প্রাথমিক ১২টি ফুল দিয়ে বাগান সাজানো (রেফারেন্স ২ এর নিখুঁত ভারসাম্য)
    const initialOffsets = [
      { x: 0.07, y: 0.68 }, { x: 0.14, y: 0.77 }, { x: 0.23, y: 0.70 },
      { x: 0.34, y: 0.65 }, { x: 0.39, y: 0.78 }, { x: 0.46, y: 0.62 },
      { x: 0.54, y: 0.81 }, { x: 0.61, y: 0.67 }, { x: 0.68, y: 0.73 },
      { x: 0.76, y: 0.64 }, { x: 0.83, y: 0.78 }, { x: 0.92, y: 0.69 }
    ];

    initialOffsets.forEach((pos, idx) => {
      setTimeout(() => {
        const f = new BotanicalTulip(
          pos.x * engineRef.current.width,
          pos.y * engineRef.current.height
        );
        f.growth = 1;
        f.bloom = 1;
        engineRef.current.flowers.push(f);
        setTulipCount(engineRef.current.flowers.length);
      }, idx * 60);
    });

    // ৬০ FPS স্মুথ গ্লোবাল রেন্ডার লুপ
    let lastTime = performance.now();
    const renderLoop = (now) => {
      const dt = Math.min(2.0, (now - lastTime) / 16.666);
      lastTime = now;
      engineRef.current.globalTime = now * 0.0015;

      const { width: w, height: h, stars, flowers, globalTime } = engineRef.current;

      ctx.clearRect(0, 0, w, h);

      // ১. স্থির ব্যাকগ্রাউন্ড স্টারফিল্ড
      for (let s of stars) {
        const twinkle = Math.sin(globalTime * s.pulseSpeed + s.phase) * 0.25 + 0.75;
        ctx.fillStyle = `rgba(225, 240, 255, ${s.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ২. ডেপথ সর্টিং (পেছনের ফুলগুলো আগে রেন্ডার হবে)
      flowers.sort((a, b) => a.originY - b.originY);

      // ৩. ফুল আপডেট ও রেন্ডার
      for (let flower of flowers) {
        flower.update(dt);
        flower.render(ctx, globalTime);
      }

      // ৪. ড্রামাটিক গ্রাউন্ড অ্যাটমোস্ফিয়ার ভিনিয়েট
      const groundGrad = ctx.createLinearGradient(0, h * 0.78, 0, h);
      groundGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      groundGrad.addColorStop(0.75, "rgba(1, 4, 3, 0.45)");
      groundGrad.addColorStop(1, "rgba(0, 2, 1, 0.85)");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h * 0.76, w, h * 0.24);

      engineRef.current.animationFrameId = requestAnimationFrame(renderLoop);
    };

    engineRef.current.animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (engineRef.current.animationFrameId) {
        cancelAnimationFrame(engineRef.current.animationFrameId);
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#000" }}>
      {/* ফ্লোটিং ফ্রস্টেড গ্লাস ইউআই প্যানেল */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(16, 20, 26, 0.65)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "8px 16px",
            color: "#f1f5f9",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 14px rgba(255, 20, 117, 0.2)"
          }}
        >
          <span style={{ fontSize: "16px", filter: "drop-shadow(0 0 6px #ff1a75)" }}>🌷</span>
          <span>
            Tulips: <strong style={{ color: "#ff80bf", textShadow: "0 0 10px rgba(255, 128, 191, 0.7)" }}>{tulipCount}</strong>
          </span>
        </div>

        <button
          onClick={handleClear}
          style={{
            pointerEvents: "auto",
            alignSelf: "flex-start",
            background: "rgba(16, 20, 26, 0.65)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            color: "#cbd5e1",
            padding: "7px 18px",
            fontSize: "13px",
            fontWeight: "500",
            letterSpacing: "0.4px",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "rgba(255, 128, 191, 0.5)";
            e.currentTarget.style.boxShadow = "0 0 14px rgba(255, 20, 117, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(16, 20, 26, 0.65)";
            e.currentTarget.style.color = "#cbd5e1";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.4)";
          }}
        >
          Clear
        </button>
      </div>

      {/* মেইন ক্যানভাস ভিউপোর্ট */}
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          if (e.clientX < 180 && e.clientY < 110) return;
          plantTulip(e.clientX, e.clientY);
        }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "crosshair",
          touchAction: "none"
        }}
      />
    </div>
  );
}