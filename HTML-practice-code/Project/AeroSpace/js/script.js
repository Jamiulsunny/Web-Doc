/**
 * AeroSpace — Space Exploration Platform
 * Vanilla JavaScript UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Apply dark glass background once scrolled
    if (scrollPos > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Toggle Back to Top button
    if (scrollPos > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // Smooth Back to Top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 2. MOBILE HAMBURGER MENU
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile drawer when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // 3. ACTIVE NAVIGATION LINK INDICATOR ON SCROLL
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once for performance
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 5. PLANET DETAILS MODAL INTERACTION
  const planetModal = document.getElementById('planetModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const discoverButtons = document.querySelectorAll('.btn-planet-info');

  // Planet database
  const planetData = {
    Mercury: {
      tag: 'TERRESTRIAL // SOL-1',
      desc: 'Mercury is the closest planet to the Sun. It has no substantial atmosphere, causing wild temperature swings ranging from -180°C at night to 430°C by day.',
      orbitalPeriod: '88 Earth Days',
      gravity: '3.7 m/s²',
      moons: '0'
    },
    Venus: {
      tag: 'TERRESTRIAL // SOL-2',
      desc: 'Venus is shrouded in thick carbon dioxide clouds and sulfuric acid, driving surface temperatures high enough to melt lead. It rotates in retrograde.',
      orbitalPeriod: '225 Earth Days',
      gravity: '8.87 m/s²',
      moons: '0'
    },
    Earth: {
      tag: 'HABITABLE OASIS // SOL-3',
      desc: 'Our home planet is the only known world harboring life, plate tectonics, and vast liquid water oceans shielded by a powerful magnetosphere.',
      orbitalPeriod: '365.25 Days',
      gravity: '9.81 m/s²',
      moons: '1 (Luna)'
    },
    Mars: {
      tag: 'THE RED PLANET // SOL-4',
      desc: 'Home to Olympus Mons, the largest volcano in the Solar System, and vast canyon networks that were carved by primordial liquid water.',
      orbitalPeriod: '687 Earth Days',
      gravity: '3.71 m/s²',
      moons: '2 (Phobos & Deimos)'
    },
    Jupiter: {
      tag: 'GAS GIANT // SOL-5',
      desc: 'More than twice as massive as all other planets combined. Jupiter features the Great Red Spot, an ancient storm larger than planet Earth.',
      orbitalPeriod: '11.86 Earth Years',
      gravity: '24.79 m/s²',
      moons: '95 Recognized'
    },
    Saturn: {
      tag: 'RINGED JEWEL // SOL-6',
      desc: 'Famous for its dazzling system of rings made of ice and dust. Saturn is a gas giant with a density lower than that of liquid water.',
      orbitalPeriod: '29.45 Earth Years',
      gravity: '10.44 m/s²',
      moons: '146 Recognized'
    },
    Uranus: {
      tag: 'ICE GIANT // SOL-7',
      desc: 'An ice giant with a blue-green hue caused by atmospheric methane. Uranus rotates at an extreme tilt of 98 degrees, essentially rolling on its side.',
      orbitalPeriod: '84 Earth Years',
      gravity: '8.69 m/s²',
      moons: '28 Recognized'
    },
    Neptune: {
      tag: 'ICE GIANT // SOL-8',
      desc: 'The most distant major planet in our solar neighborhood. Neptune endures supersonic methane storms with winds topping 2,100 km/h.',
      orbitalPeriod: '164.8 Earth Years',
      gravity: '11.15 m/s²',
      moons: '16 Recognized'
    }
  };

  discoverButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.planet-card');
      const planetName = card.getAttribute('data-planet');
      const data = planetData[planetName];

      if (data) {
        modalBody.innerHTML = `
          <span class="section-tag" style="margin-bottom: 8px;">${data.tag}</span>
          <h2 class="section-title gradient-text" style="font-size: 2rem; margin-bottom: 12px;">${planetName}</h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.6;">${data.desc}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid var(--border-glass); padding-top: 16px;">
            <div>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-heading);">ORBITAL PERIOD</span>
              <p style="font-weight: 700; color: var(--neon-cyan);">${data.orbitalPeriod}</p>
            </div>
            <div>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-heading);">SURFACE GRAVITY</span>
              <p style="font-weight: 700; color: var(--neon-cyan);">${data.gravity}</p>
            </div>
            <div>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-heading);">NATURAL MOONS</span>
              <p style="font-weight: 700; color: var(--neon-cyan);">${data.moons}</p>
            </div>
            <div>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-heading);">SECURITY PROTOCOL</span>
              <p style="font-weight: 700; color: var(--neon-green);">UNRESTRICTED</p>
            </div>
          </div>
        `;
        planetModal.classList.add('active');
        planetModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Close modal
  const closeModal = () => {
    planetModal.classList.remove('active');
    planetModal.setAttribute('aria-hidden', 'true');
  };

  modalClose.addEventListener('click', closeModal);
  planetModal.addEventListener('click', (e) => {
    if (e.target === planetModal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && planetModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 6. DYNAMIC MISSION CONTROL SIMULATION (LIVE TICKER)
  const telemetryDist = document.getElementById('telemetryDistance');
  let simulatedDist = 225000000;

  setInterval(() => {
    // Increment distance by ~14 km per second
    simulatedDist += Math.floor(Math.random() * 8) + 10;
    const millions = (simulatedDist / 1000000).toFixed(2);
    if (telemetryDist) {
      telemetryDist.textContent = `${millions}M KM`;
    }
  }, 1200);
});