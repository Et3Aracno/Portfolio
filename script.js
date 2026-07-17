
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

// ============================================================
// ZOOM SUR LES IMAGES DE GALERIE — grandit depuis sa position
// ============================================================
const zoomBackdrop = document.createElement('div');
zoomBackdrop.className = 'zoom-backdrop';
document.body.appendChild(zoomBackdrop);

const zoomClose = document.createElement('button');
zoomClose.className = 'zoom-close';
zoomClose.innerHTML = '✕';
zoomClose.setAttribute('aria-label', 'Fermer');
document.body.appendChild(zoomClose);

let zoomClone = null;
let zoomOriginRect = null;

function openZoom(img) {
  zoomOriginRect = img.getBoundingClientRect();

  zoomClone = document.createElement('img');
  zoomClone.src = img.src;
  zoomClone.alt = img.alt;
  zoomClone.className = 'zoom-clone';
  zoomClone.style.top = zoomOriginRect.top + 'px';
  zoomClone.style.left = zoomOriginRect.left + 'px';
  zoomClone.style.width = zoomOriginRect.width + 'px';
  zoomClone.style.height = zoomOriginRect.height + 'px';
  document.body.appendChild(zoomClone);

  zoomBackdrop.classList.add('open');

  // force le navigateur à prendre en compte la position de départ
  // avant d'appliquer la taille finale (sinon pas d'animation)
  requestAnimationFrame(() => {
    const maxW = window.innerWidth * 0.85;
    const maxH = window.innerHeight * 0.85;
    const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    const finalW = img.naturalWidth * ratio;
    const finalH = img.naturalHeight * ratio;
    const finalTop = (window.innerHeight - finalH) / 2;
    const finalLeft = (window.innerWidth - finalW) / 2;

    zoomClone.style.top = finalTop + 'px';
    zoomClone.style.left = finalLeft + 'px';
    zoomClone.style.width = finalW + 'px';
    zoomClone.style.height = finalH + 'px';

    zoomClose.style.top = (finalTop - 14) + 'px';
    zoomClose.style.left = (finalLeft + finalW - 14) + 'px';
    zoomClose.classList.add('open');
  });
}

function closeZoom() {
  if (!zoomClone) return;
  zoomClose.classList.remove('open');
  zoomBackdrop.classList.remove('open');

  zoomClone.style.top = zoomOriginRect.top + 'px';
  zoomClone.style.left = zoomOriginRect.left + 'px';
  zoomClone.style.width = zoomOriginRect.width + 'px';
  zoomClone.style.height = zoomOriginRect.height + 'px';

  setTimeout(() => {
    if (zoomClone) zoomClone.remove();
    zoomClone = null;
  }, 300);
}

document.addEventListener('click', (e) => {
  if (e.target.matches('.project-media img')) openZoom(e.target);
});
zoomBackdrop.addEventListener('click', closeZoom);
zoomClose.addEventListener('click', closeZoom);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeZoom(); });
