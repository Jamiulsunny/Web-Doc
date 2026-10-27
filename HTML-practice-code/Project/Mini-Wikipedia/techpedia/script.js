// ১. থিম টগল (Dark/Light Mode)
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
const rootHtml = document.documentElement;

// লোকাল স্টোরেজ থেকে আগের থিম চেক করা
const savedTheme = localStorage.getItem('techpedia-theme') || 'light';
setTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = rootHtml.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

function setTheme(theme) {
  rootHtml.setAttribute('data-theme', theme);
  localStorage.setItem('techpedia-theme', theme);
  if (theme === 'dark') {
    themeIcon.textContent = '☀️';
    themeText.textContent = 'লাইট মোড';
  } else {
    themeIcon.textContent = '🌙';
    themeText.textContent = 'ডার্ক মোড';
  }
}

// ২. স্ক্রল প্রগ্রেস বার ইন্ডিকেটর
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('scroll-progress').style.width = scrolled + '%';
});

// ৩. ফর্ম সাবমিশন ও ইন্টারঅ্যাক্টিভ ফিডব্যাক
const submissionForm = document.getElementById('submissionForm');
const formFeedback = document.getElementById('form-feedback');

submissionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('uname').value;
  
  // সাবমিট বাটন লোডিং ইফেক্ট
  const submitBtn = submissionForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = 'প্রসেস হচ্ছে...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    formFeedback.style.display = 'block';
    formFeedback.innerHTML = `ধন্যবাদ, <strong>${name}</strong>! আপনার তথ্য ও আর্টিকেলটি সফলভাবে গৃহীত হয়েছে।`;
    
    submissionForm.reset();

    // ৫ সেকেন্ড পর মেসেজ হাইড করা
    setTimeout(() => {
      formFeedback.style.display = 'none';
    }, 5000);
  }, 800);
});