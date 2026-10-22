/* ==========================================================================
   Shahid Bulbul Govt. College, Pabna - Portal Engine & Grade Calculator
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------------------------------
  // YOUR ORIGINAL GRADE CALCULATOR JAVASCRIPT (Preserved Exactly)
  // -------------------------------------------------------------
  
  // Element গুলো ধরো
  const input = document.getElementById("mark");
  const btn   = document.getElementById("btn");
  const out   = document.getElementById("out");

  // grade বের করার function
  function getGrade(m) {
      if (m >= 80) return { g: "A+", pass: true,  msg: "চমৎকার!" };
      if (m >= 70) return { g: "A",  pass: true,  msg: "খুব ভালো!" };
      if (m >= 60) return { g: "B",  pass: true,  msg: "ভালো!" };
      if (m >= 50) return { g: "C",  pass: true,  msg: "আরো effort লাগবে" };
      if (m >= 33) return { g: "D",  pass: true,  msg: "কোনোরকম pass!" };
      return { g: "F", pass: false, msg: "Fail - আবার চেষ্টা করো।" };
  }

  // button click এ কাজ
  btn.addEventListener("click", () => {
      const m = Number(input.value);
      if (Number.isNaN(m) || m < 0 || m > 100) {
          out.className = "result fail";
          out.textContent = "0-100 এর মধ্যে দাও";
          return;
      }

      const r = getGrade(m);
      out.className = "result " + (r.pass ? "pass" : "fail");
      out.textContent = "Grade: " + r.g + " — " + r.msg;
  });

  // Enter key দিয়েও কাজ করবে
  input.addEventListener("keydown", (e) => { 
      if (e.key === "Enter") btn.click(); 
  });


  // -------------------------------------------------------------
  // PORTAL FUNCTIONALITY: Mobile Menu, Notice Filter, Modal
  // -------------------------------------------------------------

  // Mobile Hamburger Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Mobile Sub-menu accordion
  const dropdownItems = document.querySelectorAll(".has-dropdown > a");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = item.parentElement;
        parent.classList.toggle("open");
      }
    });
  });

  // Notice Board Category Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const noticeItems = document.querySelectorAll(".notice-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");

      noticeItems.forEach((item) => {
        if (category === "all" || item.getAttribute("data-category") === category) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Notice View Modal Handling
  const noticeModal = document.getElementById("noticeModal");
  const modalClose = document.getElementById("modalClose");
  const modalConfirmBtn = document.getElementById("modalConfirmBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const viewBtns = document.querySelectorAll(".view-notice");

  const closeModal = () => {
    if (noticeModal) noticeModal.classList.remove("active");
  };

  viewBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-title");
      if (modalTitle && modalBody && noticeModal) {
        modalTitle.textContent = title;
        modalBody.innerHTML = `
          <p><strong>বিজ্ঞপ্তি:</strong> ${title}</p>
          <p style="margin-top: 10px; color: #64748b;">শহীদ বুলবুল সরকারি কলেজের সংশ্লিষ্ট সকল ছাত্র-ছাত্রীকে নোটিশটি সতর্কতার সাথে অনুসরণ করার নির্দেশ দেওয়া হলো।</p>
        `;
        noticeModal.classList.add("active");
      }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", closeModal);
  if (noticeModal) {
    noticeModal.addEventListener("click", (e) => {
      if (e.target === noticeModal) closeModal();
    });
  }
});