// ============================================================
// 1) ANNÉE DANS LE FOOTER
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// 2) NAVIGATION PAR ONGLETS — clic + surbrillance selon la section visible
// ============================================================
document.querySelectorAll('.tab[data-target]').forEach(tab => {
  tab.addEventListener('click', () => {
    document.getElementById(tab.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('a[data-target]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById(link.dataset.target).scrollIntoView({ behavior: 'smooth' });
  });
});

const sections = document.querySelectorAll('main section[id]');
const tabButtons = document.querySelectorAll('.tab[data-target]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tabButtons.forEach(t => t.classList.toggle('active', t.dataset.target === entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ============================================================
// 3) CHANGEMENT DE LANGUE
//    Les textes traduits viennent de l'objet `translations` (lang.js)
// ============================================================
function setLg(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // Applique chaque traduction à tous les éléments data-i18n correspondants
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // Met à jour l'attribut lang de la page (accessibilité / SEO)
  document.documentElement.lang = lang;

  // Met en surbrillance le bouton actif
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  // Mémorise le choix pour la prochaine visite
  localStorage.setItem('portfolio-lang', lang);
}

// Écoute les clics sur les boutons FR / EN
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLg(btn.dataset.lang));
});

// Au chargement : réutilise la langue mémorisée, sinon détecte celle du navigateur
const savedLang = localStorage.getItem('portfolio-lang');
const browserLang = navigator.language.slice(0, 2);
const initialLang = savedLang || (translations[browserLang] ? browserLang : 'fr');
setLg(initialLang);
