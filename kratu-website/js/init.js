/* init.js — Kratu v3.1 */

// Global state
let lenis;
let isTouch = false;

function initCore() {
  // Touch detection
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    isTouch = true;
    document.body.classList.add('is-touch');
  }

  // Set viewport height CSS var to fix mobile 100vh issue
  const setVH = () => {
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  };
  setVH();
  window.addEventListener('resize', () => {
    clearTimeout(window.vhTimeout);
    window.vhTimeout = setTimeout(setVH, 150);
  });

  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.opacity = '1';
    return;
  }

  // === LENIS SMOOTH SCROLL ===
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.4,
    infinite: false
  });
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// === SCROLL PROGRESS BAR ===
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  const update = () => {
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const scrolled = window.scrollY;
    const pct = Math.min(100, (scrolled / (docH - winH)) * 100);
    bar.style.width = pct + '%';
  };

  if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const pct = Math.min(100, (scroll / (docH - winH)) * 100);
      bar.style.width = pct + '%';
    });
  } else {
    window.addEventListener('scroll', update, { passive: true });
  }
}

// === PAGE TRANSITION SYSTEM ===
function initPageTransitions() {
  if (typeof anime === 'undefined') return;

  // Create overlay if it doesn't exist
  let overlay = document.getElementById('page-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-overlay';
    document.body.appendChild(overlay);
  }

  // On page enter: animate overlay OUT (top to hidden)
  overlay.style.transformOrigin = 'top';
  anime({
    targets: overlay,
    scaleY: [1, 0],
    duration: 600,
    easing: 'easeInOutExpo',
    delay: 50
  });

  // Intercept all non-anchor internal link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;
    // Skip: external, anchor-only, mailto, tel, javascript
    if (href.startsWith('http') || href.startsWith('//') ||
        href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('javascript:')) return;
    // Skip: same-page anchor references
    if (href.includes('#') && href.split('#')[0] === '') return;

    e.preventDefault();

    overlay.style.transformOrigin = 'bottom';
    anime({
      targets: overlay,
      scaleY: [0, 1],
      duration: 500,
      easing: 'easeInQuad',
      complete: () => {
        window.location.href = href;
      }
    });
  });
}

// === MAIN INIT ===
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Splitting !== 'undefined') {
    Splitting();
  }
  initCore();
  initScrollProgress();
  initPageTransitions();
  initSectionProgress();
});

// === SECTION PROGRESS SIDEBAR ===
function initSectionProgress() {
  const sidebar = document.querySelector('.section-progress');
  if (!sidebar) return;

  const sections = ['hero', 'problem', 'solutions', 'how-it-works', 'product', 'customers'];
  const labels = document.querySelectorAll('.sp-labels span');
  const fill = document.querySelector('.sp-fill');

  if (!labels.length || !fill) return;

  const observer = new IntersectionObserver((entries) => {
    let activeId = '';
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeId = entry.target.id || entry.target.className.split(' ')[1];
      }
    });

    if (activeId && typeof anime !== 'undefined') {
      labels.forEach((s, i) => {
        const targetId = s.getAttribute('data-target').substring(1);
        const isActive = targetId === activeId;
        
        anime({
          targets: s,
          opacity: isActive ? 1 : 0.3,
          scale: isActive ? 1.1 : 1,
          color: isActive ? '#4F46E5' : '#4A4862',
          duration: 300,
          easing: 'easeOutQuart'
        });

        if (isActive) {
          const pct = (i / (labels.length - 1)) * 100;
          fill.style.height = pct + '%';
        }
      });
    }
  }, { rootMargin: '-40% 0px -40% 0px' });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
}
