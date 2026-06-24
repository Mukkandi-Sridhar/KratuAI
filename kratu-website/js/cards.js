/* cards.js — Kratu v3.2: Card interactions and VanillaTilt */

document.addEventListener('kratu:ready', () => {

  if (typeof VanillaTilt !== 'undefined') {
    // How-it-works cards tilt (these are now part of sticky scroll but we can still apply tilt)
    VanillaTilt.init(document.querySelectorAll('.how-card'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      perspective: 1000,
      scale: 1.02,
      gyroscope: false
    });

    // Testimonial and Persona cards
    VanillaTilt.init(document.querySelectorAll('.t-card, .persona-card'), {
      max: 6,
      speed: 500,
      glare: true,
      'max-glare': 0.1,
      perspective: 1200,
      scale: 1.02,
      gyroscope: false
    });
  }

  // How cards scroll entrance — Anime.js + IntersectionObserver
  const howCards = document.querySelectorAll('.how-step');
  if (howCards.length > 0 && typeof anime !== 'undefined') {
    const howObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = [...howCards].indexOf(card);
          const fromLeft = index % 2 === 0;
          anime({
            targets: card,
            translateX: [fromLeft ? -60 : 60, 0],
            opacity: [0, 1],
            duration: 900,
            delay: (index % 2) * 100,
            easing: 'easeOutExpo'
          });
          howObserver.unobserve(card);
        }
      });
    }, { threshold: 0.2 });

    howCards.forEach((c, idx) => {
      // Set initial state
      c.style.opacity = 0;
      howObserver.observe(c);
    });
  }

});
