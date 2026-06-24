/* scroll-anim.js — Kratu v3.2: Motion One Scroll Animations */

document.addEventListener('kratu:ready', () => {
  if (typeof Motion === 'undefined') return;
  const { animate, scroll, inView, stagger } = Motion;

  // Section headlines rise
  inView('[data-anim="rise"]', ({ target }) => {
    animate(target, 
      { opacity: [0, 1], y: [40, 0] }, 
      { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
  });

  // Staggered children scale up
  inView('[data-anim="scale"]', ({ target }) => {
    const children = target.querySelectorAll('[data-anim-child]');
    if(children.length > 0) {
      animate(children,
        { opacity: [0, 1], scale: [0.92, 1], y: [24, 0] },
        { duration: 0.7, delay: stagger(0.08), easing: 'ease-out' }
      );
    }
  });

  // Scroll-linked parallax on hero headline
  const heroSection = document.querySelector('.section-hero');
  if(heroSection) {
    scroll(
      animate('.hero-headline', { y: [0, -80] }),
      { target: heroSection, offset: ['start start', 'end start'] }
    );
  }

  // Section background color transitions
  const solutionSection = document.querySelector('.solution-section');
  if(solutionSection) {
    scroll(
      animate(solutionSection, { backgroundColor: ['#05050D', '#F4F0E6'] }),
      { target: solutionSection, offset: ['start end', 'center center'] }
    );
  }

  // Animate horizontal sticky track in 'how-it-works'
  const stickyTrack = document.querySelector('.how-sticky-track');
  const stickyOuter = document.querySelector('.how-sticky-outer');
  if (stickyTrack && stickyOuter) {
    // Note: since we removed GSAP pinning, we need to handle pinning via CSS or rely on 
    // basic sticky positioned container (already handled in CSS with `position: sticky`).
    // Motion One just maps the scroll of outer to translation of track.
    scroll(
      animate(stickyTrack, { transform: ['translateX(0vw)', 'translateX(-400vw)'] }),
      { target: stickyOuter, offset: ['start start', 'end end'] }
    );
  }
});
