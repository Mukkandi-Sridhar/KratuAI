/* ═══════════════════════════════════════════════════════════
   PREMIUM-FX.JS — Spotlight cards, magnetic buttons, counters
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Card spotlight: track cursor per-card ---- */
  document.querySelectorAll('.card, .t-card, .why-item').forEach((el) => {
    el.classList.add('spotlight');
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--sy', `${e.clientY - rect.top}px`);
    });
  });

  /* ---- Magnetic buttons ---- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---- Dot-grid parallax on mouse move ---- */
  const dotGrid = document.querySelector('.dot-grid');
  if (dotGrid && !reduceMotion) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      dotGrid.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const target = parseFloat(el.dataset.counter);
        const decimals = el.dataset.counterDecimals ? parseInt(el.dataset.counterDecimals, 10) : 0;
        const prefix = el.dataset.counterPrefix || '';
        const suffix = el.dataset.counterSuffix || '';
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = prefix + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => io.observe(el));
  }
});
