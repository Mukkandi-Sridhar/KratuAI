/* ═══════════════════════════════════════════════════════════
   TILT-3D.JS — Perspective cursor-tilt for cards & panels
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const targets = document.querySelectorAll('[data-tilt]');
  if (!targets.length) return;

  targets.forEach((el) => {
    const strength = parseFloat(el.dataset.tiltStrength) || 8;
    let frame = null;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rotY = px * strength * 2;
        const rotX = py * -strength * 2;
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
});
