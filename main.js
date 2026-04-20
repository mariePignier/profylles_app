/* =========================================================
   PROFYLLES — main.js
   Phase 1 — Routing SPA + comportements globaux.
   Ne pas modifier dans les phases suivantes.
   ========================================================= */

// ---------------------------------------------------------
// 1. ROUTING
// ---------------------------------------------------------
const PAGES = ['home', 'methode', 'formations', 'accompagnements', 'teambuilding', 'ressources', 'contact'];

function showPage(pageId) {
  if (!PAGES.includes(pageId)) pageId = 'home';

  PAGES.forEach(id => {
    const el = document.getElementById('page-' + id);
    if (el) el.hidden = (id !== pageId);
  });

  // Active nav link
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Scroll top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Re-trigger fade-in animations
  requestAnimationFrame(() => triggerFadeIns());
}

function navigateTo(pageId) {
  history.pushState({ page: pageId }, '', '#' + pageId);
  showPage(pageId);
}

// Nav link clicks
document.addEventListener('click', e => {
  const link = e.target.closest('[data-page]');
  if (!link) return;
  e.preventDefault();
  const page = link.dataset.page;
  navigateTo(page);

  // Close mobile menu
  const navLinks = document.getElementById('navLinks');
  const burger   = document.getElementById('burgerBtn');
  if (navLinks && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Browser back/forward
window.addEventListener('popstate', e => {
  const page = e.state?.page || hash() || 'home';
  showPage(page);
});

function hash() {
  return location.hash.replace('#', '') || null;
}

// ---------------------------------------------------------
// 2. NAVBAR — scroll effect & burger
// ---------------------------------------------------------
const navbar   = document.getElementById('navbar');
const burger   = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});

// ---------------------------------------------------------
// 3. FADE-IN AU SCROLL (Intersection Observer)
// ---------------------------------------------------------
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

function triggerFadeIns() {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    fadeObserver.observe(el);
  });
}

// ---------------------------------------------------------
// 4. INIT
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const initialPage = hash() || 'home';
  showPage(initialPage);
});
