/* cursor.js — Kratu two-layer magnetic cursor v3.2 */

(function () {
  'use strict';

  function initCursor() {
    // No cursor on touch devices
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    // === CREATE ELEMENTS ===
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    // Force style for the fix just in case
    ring.style.background = 'transparent !important';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // State
    const mouse = { x: -200, y: -200 };
    const ringPos = { x: -200, y: -200 };
    let isVisible = false;

    // === RAF LOOP: Ring lerp ===
    function loop() {
      ringPos.x += (mouse.x - ringPos.x) * 0.12;
      ringPos.y += (mouse.y - ringPos.y) * 0.12;

      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;

      requestAnimationFrame(loop);
    }
    loop();

    // === MOUSE TRACKING ===
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    }, { passive: true });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isVisible = true;
    });

    // === HOVER STATES ===
    const hoverTargets = 'a, button, .industry-card, .bento-card, .how-card, .persona-card, .price-card, [role="button"]';
    const primaryTargets = '.btn-primary';

    document.addEventListener('mouseover', (e) => {
      const isPrimary = e.target.closest(primaryTargets);
      const isHover = e.target.closest(hoverTargets);

      if (isPrimary) {
        document.body.classList.add('cursor-primary');
        document.body.classList.remove('cursor-hover');
      } else if (isHover) {
        document.body.classList.add('cursor-hover');
        document.body.classList.remove('cursor-primary');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const isPrimary = e.target.closest(primaryTargets);
      const isHover = e.target.closest(hoverTargets);

      if (isPrimary || isHover) {
        if (!e.relatedTarget || !e.relatedTarget.closest(hoverTargets + ', ' + primaryTargets)) {
          document.body.classList.remove('cursor-hover', 'cursor-primary');
        }
      }
    });

    // === MAGNETIC PULL on buttons (Anime.js) ===
    const MAGNETIC_RADIUS = 80;
    const MAX_PULL = 0.3;

    function applyMagnetic(btn) {
      if(btn.dataset.mag === '1') return;
      btn.dataset.mag = '1';
      
      btn.addEventListener('mousemove', (e) => {
        if (typeof anime === 'undefined') return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS) {
          anime({
            targets: btn,
            translateX: dx * MAX_PULL,
            translateY: dy * MAX_PULL,
            duration: 400,
            easing: 'easeOutQuad'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (typeof anime === 'undefined') return;
        anime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          duration: 600,
          easing: 'easeOutElastic(1, .5)'
        });
      });
    }

    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(applyMagnetic);

    // Dynamic magnetic: re-apply to dynamically added buttons
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.btn-primary, .btn-ghost').forEach(applyMagnetic);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCursor, 50);
  });
})();
