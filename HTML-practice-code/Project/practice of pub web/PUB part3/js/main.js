(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Mobile menu toggle
  const burger = $(".burger"), nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const o = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", o);
    });
  }

  // Dropdown menus
  const closeAll = (e) => $$(".has-sub.open").forEach(l => {
    if (!e || !l.contains(e)) {
      l.classList.remove("open");
      const btn = $("button", l);
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  });

  $$(".has-sub > button").forEach(b => {
    const li = b.parentElement;
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const o = !li.classList.contains("open");
      $$(":scope > .sub > .has-sub.open", li.parentElement).forEach(x => {
        if (x !== li) {
          x.classList.remove("open");
          const ob = $("button", x);
          if (ob) ob.setAttribute("aria-expanded", "false");
        }
      });
      li.classList.toggle("open", o);
      b.setAttribute("aria-expanded", o);
    });

    li.addEventListener("mouseenter", () => {
      if (matchMedia("(min-width:1025px)").matches) b.setAttribute("aria-expanded", "true");
    });
    li.addEventListener("mouseleave", () => {
      if (matchMedia("(min-width:1025px)").matches) b.setAttribute("aria-expanded", "false");
    });
    li.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        li.classList.remove("open");
        b.setAttribute("aria-expanded", "false");
        b.focus();
      }
    });
  });

  document.addEventListener("click", (e) => closeAll(e.target));

  // Slider
  const sl = $(".slider");
  if (sl) {
    const s = $$(".slide", sl);
    const d = $(".dots", sl);
    let i = 0, t;

    if (d) {
      s.forEach((_, k) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Slide " + (k + 1));
        b.onclick = () => go(k);
        d.append(b);
      });
    }

    const go = (k) => {
      i = (k + s.length) % s.length;
      s.forEach((x, n) => x.classList.toggle("on", n === i));
      if (d) {
        $$("button", d).forEach((b, n) => b.setAttribute("aria-current", n === i ? "true" : "false"));
      }
    };

    const prevBtn = $(".prev", sl);
    const nextBtn = $(".next", sl);
    if (prevBtn) prevBtn.onclick = () => go(i - 1);
    if (nextBtn) nextBtn.onclick = () => go(i + 1);
    go(0);

    if (!matchMedia("(prefers-reduced-motion:reduce)").matches) {
      t = setInterval(() => go(i + 1), 5000);
      sl.addEventListener("mouseenter", () => clearInterval(t));
      sl.addEventListener("mouseleave", () => {
        clearInterval(t);
        t = setInterval(() => go(i + 1), 5000);
      });
    }
  }

  // Tabs
  $$(".tabs").forEach(tb => {
    const tabs = $$("[role=tab]", tb);
    tabs.forEach(t => t.addEventListener("click", () => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        const panel = $("#" + x.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }));
  });

  // Contact Form
  const f = $("#contactForm");
  if (f) {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", f).forEach(x => {
        const bad = !x.value.trim() || (x.type === "email" && !/^\S+@\S+\.\S+$/.test(x.value));
        x.classList.toggle("err", bad);
        if (bad) ok = false;
      });
      const note = $("#formNote");
      if (note) {
        note.textContent = ok
          ? "ধন্যবাদ! আপনার বার্তাটি গ্রহণ করা হয়েছে।"
          : "অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন।";
        note.style.color = ok ? "green" : "red";
      }
    });
  }

  // Back to top
  const top = $("#top");
  if (top) {
    addEventListener("scroll", () => top.hidden = scrollY < 400);
    top.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  }
})();
