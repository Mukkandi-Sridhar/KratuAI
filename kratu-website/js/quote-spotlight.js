/* ═══════════════════════════════════════════════════════════
   QUOTE-SPOTLIGHT.JS — Paged testimonial spotlight
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const spotlight = document.querySelector('.quote-spotlight');
  if (!spotlight) return;

  const slides = spotlight.querySelectorAll('.quote-slide');
  const navBtns = spotlight.querySelectorAll('.quote-nav-btn');
  const current = spotlight.querySelector('.quote-counter-current');
  const total = spotlight.querySelector('.quote-counter-total');
  const progressBar = spotlight.querySelector('.quote-progress i');
  if (!slides.length) return;

  const pad = (n) => String(n).padStart(2, '0');
  let index = 0;

  if (total) total.textContent = pad(slides.length);
  if (progressBar) progressBar.style.width = `${100 / slides.length}%`;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    if (current) current.textContent = pad(index + 1);
    if (progressBar) progressBar.style.transform = `translateX(${index * 100}%)`;
  }

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      show(index + Number(btn.dataset.dir));
    });
  });

  spotlight.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
});
