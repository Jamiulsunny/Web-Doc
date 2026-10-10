/**
 * Alex Vance Portfolio - Vanilla JavaScript Controller
 * Strict Standards: No frameworks, zero runtime dependencies.
 */
(function () {
  'use strict';

  // Respect OS reduced motion settings
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const header = document.getElementById('navbar');
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const yearElement = document.getElementById('current-year');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  /* ------------------------------------------------------------------------
     1. INITIALIZATION & YEAR STAMP
     ------------------------------------------------------------------------ */
  function initYear() {
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /* ------------------------------------------------------------------------
     2. STICKY NAVBAR STATE
     ------------------------------------------------------------------------ */
  function handleNavbarScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ------------------------------------------------------------------------
     3. ACCESSIBLE MOBILE MENU (DRAWER & KEYBOARD TRAP)
     ------------------------------------------------------------------------ */
  function toggleMobileMenu(open) {
    if (!menuBtn || !mobileNav) return;
    const isExpanded = open !== undefined ? open : menuBtn.getAttribute('aria-expanded') !== 'true';
    
    menuBtn.setAttribute('aria-expanded', String(isExpanded));
    mobileNav.setAttribute('aria-hidden', String(!isExpanded));
    mobileNav.classList.toggle('open', isExpanded);

    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      // Focus first link in drawer
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      document.body.style.overflow = '';
      menuBtn.focus();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      toggleMobileMenu();
    });
  }

  // Close mobile drawer upon link selection
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMobileMenu(false);
    });
  });

  // Close drawer if user presses Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  /* ------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK SYNC (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  function initActiveNavObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          updateNavLinks(currentId);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  function updateNavLinks(activeId) {
    desktopLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. PROJECT FILTERING ENGINE (VANILLA JS)
     ------------------------------------------------------------------------ */
  function initProjectFilters() {
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');

        // Update button states
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter projects with ARIA support
        projectCards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.removeAttribute('hidden');
            card.style.opacity = '0';
            setTimeout(function () {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. FORM VALIDATION & DISPATCH HANDLING
     ------------------------------------------------------------------------ */
  function validateEmail(email) {
    // Robust RFC 5322 compatible expression
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(inputElement, errorElement, message) {
    inputElement.classList.add('invalid');
    inputElement.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
  }

  function clearError(inputElement, errorElement) {
    inputElement.classList.remove('invalid');
    inputElement.removeAttribute('aria-invalid');
    errorElement.textContent = '';
  }

  function initContactForm() {
    if (!contactForm) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Real-time cleanup upon input
    [
      { input: nameInput, err: nameError },
      { input: emailInput, err: emailError },
      { input: subjectInput, err: subjectError },
      { input: messageInput, err: messageError }
    ].forEach(function (pair) {
      if (pair.input) {
        pair.input.addEventListener('input', function () {
          clearError(pair.input, pair.err);
          if (formFeedback) formFeedback.hidden = true;
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, nameError, 'Full name is required.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setError(emailInput, emailError, 'Email address is required.');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        setError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError(subjectInput, subjectError, 'Please provide a subject line.');
        isValid = false;
      } else {
        clearError(subjectInput, subjectError);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput, messageError, 'Please enter your message.');
        isValid = false;
      } else if (messageInput.value.trim().length < 15) {
        setError(messageInput, messageError, 'Message must be at least 15 characters.');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please correct the highlighted fields before submitting.';
          formFeedback.hidden = false;
        }
        return;
      }

      // Build fallback mailto URL for transparent, standalone client operation
      const recipient = 'alex.vance.dev@example.com';
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
      const body = encodeURIComponent(
        `Sender: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      );
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // User confirmation feedback
      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `<strong>Input validated!</strong> Launching your native email client to send your message to <code>${recipient}</code>...`;
        formFeedback.hidden = false;
      }

      // Trigger user default email client
      setTimeout(function () {
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  /* ------------------------------------------------------------------------
     7. SCROLL-TO-TOP CONTROL
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    if (!backToTopBtn) return;
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. APP INITIALIZATION
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initActiveNavObserver();
    initProjectFilters();
    initContactForm();
    initBackToTop();

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  });
})();