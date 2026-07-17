
document.getElementById('year').textContent = new Date().getFullYear();


document.querySelectorAll('[data-target]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById(link.dataset.target).scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.topnav').classList.remove('mobile-open');
  });
});

const sections = document.querySelectorAll('main section[id]');
const sideLinks = document.querySelectorAll('.side-link[data-target]');
const topLinks = document.querySelectorAll('.topnav a[data-target]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sideLinks.forEach(l => l.classList.toggle('active', l.dataset.target === entry.target.id));
      topLinks.forEach(l => l.classList.toggle('active', l.dataset.target === entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

document.getElementById('menuToggle').addEventListener('click', () => {
  document.querySelector('.topnav').classList.toggle('mobile-open');
});

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const year = btn.dataset.year;
    projectCards.forEach(card => {
      const show = (year === 'all') || (card.dataset.year === year);
      card.style.display = show ? '' : 'none';
    });
  });
});

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) setTheme(savedTheme);


function setLg(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  localStorage.setItem('portfolio-lang', lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLg(btn.dataset.lang));
});

const savedLang = localStorage.getItem('portfolio-lang');
const browserLang = navigator.language.slice(0, 2);
const initialLang = savedLang || (translations[browserLang] ? browserLang : 'fr');
setLg(initialLang);


const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.addEventListener('click', (e) => {
  if (e.target.matches('.project-media img')) {
    lightboxImg.src = e.target.src;
    lightboxImg.alt = e.target.alt;
    lightbox.classList.add('open');
  }
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
