/**
 * Pundra University of Science & Technology (PUB) - Navigation & Global Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const isExpanded = navMenu.classList.contains('show');
      mobileToggleBtn.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Accessible Mobile Sub-menu handling
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown > a');
  dropdownItems.forEach((dropdownAnchor) => {
    dropdownAnchor.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentItem = dropdownAnchor.parentElement;
        parentItem.classList.toggle('open');
        const submenu = parentItem.querySelector('.dropdown-menu');
        if (submenu) {
          submenu.style.display = parentItem.classList.contains('open') ? 'block' : 'none';
        }
      }
    });
  });

  // Sticky Navigation Header Enhancement
  const navBar = document.querySelector('.pub-nav');
  if (navBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        navBar.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      } else {
        navBar.style.boxShadow = 'var(--pub-shadow-md)';
      }
    });
  }
});