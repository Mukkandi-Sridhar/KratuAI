/* counters.js — Kratu v3.2: CountUp.js */

document.addEventListener('kratu:ready', () => {
  if (typeof countUp === 'undefined') return;

  const easeOutQuint = (t, b, c, d) => {
    t /= d; t--; return c*(t*t*t*t*t + 1) + b;
  };

  // Find all elements with stat-number class that we want to animate
  // Based on user prompt: "Hero stat cards" and "Trust bar stats"
  
  // Hero stat cards
  const heroCounters = [
    { el: '.stat-card:nth-child(1) .stat-number', end: 500, suffix: '+' },
    { el: '.stat-card:nth-child(2) .stat-number', end: 5, suffix: ' days' },
    { el: '.stat-card:nth-child(3) .stat-number', end: 60, suffix: '%' }
  ];

  heroCounters.forEach(({ el, end, suffix }) => {
    const element = document.querySelector(el);
    if (!element) return;
    const counter = new countUp.CountUp(element, end, {
      suffix,
      duration: 2,
      useEasing: true,
      easingFn: easeOutQuint
    });
    if (!counter.error) {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { counter.start(); obs.disconnect(); }
      }, { threshold: 0.5 });
      obs.observe(element);
    } else {
      console.error(counter.error);
    }
  });

  // Trust bar stats
  const trustCounters = [
    { el: '.trust-stats div:nth-child(1) strong', end: 12, suffix: '+' },
    { el: '.trust-stats div:nth-child(2) strong', end: 500, suffix: '+' },
    { el: '.trust-stats div:nth-child(3) strong', end: 5, suffix: '' }
  ];

  trustCounters.forEach(({ el, end, suffix }) => {
    const element = document.querySelector(el);
    if (!element) return;
    const counter = new countUp.CountUp(element, end, {
      suffix,
      duration: 2.5,
      useEasing: true,
      easingFn: easeOutQuint
    });
    if (!counter.error) {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { counter.start(); obs.disconnect(); }
      }, { threshold: 0.5 });
      obs.observe(element);
    }
  });

});
