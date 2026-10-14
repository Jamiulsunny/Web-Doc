"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const menuButton = document.getElementById("menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const themeButtons = document.querySelectorAll("[data-theme-choice]");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".project-card");
  const year = document.getElementById("current-year");
  const contactForm = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (year) year.textContent = String(new Date().getFullYear());

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileNav.classList.remove("open");
  }
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation menu" : "Close navigation menu");
      mobileNav.setAttribute("aria-hidden", String(open));
      mobileNav.classList.toggle("open", !open);
    });
    mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 780) closeMenu(); });
  }

  function applyTheme(theme) {
    const valid = ["blue", "amber", "violet"];
    const chosen = valid.includes(theme) ? theme : "blue";
    root.dataset.theme = chosen;
    themeButtons.forEach(button => {
      const active = button.dataset.themeChoice === chosen;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const colors = { blue: "#0b1020", amber: "#211a19", violet: "#171329" };
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", colors[chosen]);
    try { localStorage.setItem("portfolio-theme", chosen); } catch (_) { /* Storage can be disabled. */ }
  }
  let savedTheme = "blue";
  try { savedTheme = localStorage.getItem("portfolio-theme") || "blue"; } catch (_) {}
  applyTheme(savedTheme);
  themeButtons.forEach(button => button.addEventListener("click", () => applyTheme(button.dataset.themeChoice)));

  filterButtons.forEach(button => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(card => { card.hidden = !(filter === "all" || card.dataset.category === filter); });
    });
  });

  if (contactForm) contactForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      if (feedback) feedback.textContent = "Please complete all fields before continuing.";
      return;
    }
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    if (feedback) feedback.textContent = "Your email application should open with the message prepared. Review it and press Send to deliver it.";
    window.location.href = `mailto:jamiulsunny476@gmail.com?subject=${subject}&body=${body}`;
  });

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }), { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
});
