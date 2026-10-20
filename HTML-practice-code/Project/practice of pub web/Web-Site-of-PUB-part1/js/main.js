/**
 * Pundra University of Science & Technology (PUB) - Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Carousel Controller
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  function startSlideShow() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  if (slides.length > 0) {
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetSlideInterval();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetSlideInterval();
      });
    }

    startSlideShow();
  }

  // 2. Real-time Notice Board Search Filter
  const noticeSearchInput = document.getElementById('noticeSearchInput');
  const noticeRows = document.querySelectorAll('.notice-row');

  if (noticeSearchInput) {
    noticeSearchInput.addEventListener('keyup', (e) => {
      const term = e.target.value.toLowerCase().trim();
      noticeRows.forEach((row) => {
        const title = row.querySelector('.notice-title-link').textContent.toLowerCase();
        const category = row.querySelector('.notice-category-pill').textContent.toLowerCase();
        if (title.includes(term) || category.includes(term)) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // 3. Tab Filter Component (for Academics & Notice archive)
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');

      const filterItems = document.querySelectorAll('.filterable-item');
      filterItems.forEach((item) => {
        if (target === 'all' || item.getAttribute('data-category') === target) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 4. Modal Document Viewer Simulation for PDF notices
  const pdfButtons = document.querySelectorAll('.btn-download-pdf');
  pdfButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const docName = btn.getAttribute('data-doc') || 'Document';
      alert(`[PUB Local Repository]: Opening official document "${docName}". In a production environment, this streams from assets/documents/${docName}.pdf`);
    });
  });
});