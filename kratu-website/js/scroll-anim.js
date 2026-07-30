/* ═══════════════════════════════════════════════════════════
   SCROLL-ANIM.JS — Motion One bindings
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Motion === 'undefined') return;
  const { animate, inView, stagger } = Motion;

  // Add the JS class to html so CSS knows to hide elements before animation
  document.documentElement.classList.add('js-ready');

  // Skip animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('js-ready');
    return;
  }

  // Fade & Rise for individual elements
  inView('[data-reveal]', ({ target }) => {
    animate(target,
      { opacity: [0, 1], y: [30, 0] },
      { duration: 0.6, easing: [0.16, 1, 0.3, 1] }
    );
  });

  // Staggered reveal for children
  inView('[data-reveal-stagger]', ({ target }) => {
    const children = target.children;
    if (children.length > 0) {
      animate(children,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.5, delay: stagger(0.1), easing: 'ease-out' }
      );
    }
  });
});
