/* page-load.js — Kratu v3.2: Splitting.js + Anime.js */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Splitting !== 'undefined') {
    // Initialize Splitting
    Splitting();
  }
});

// On kratu:ready event:
document.addEventListener('kratu:ready', () => {
  
  if (typeof anime === 'undefined') return;

  // Hero headline — each line chars animate in
  const lines = document.querySelectorAll('.hero-line-1, .hero-line-2, .hero-line-3');
  
  lines.forEach((line, lineIndex) => {
    // Ensure the line is split into chars. Wait, splitting() by default splits by word and char if data-splitting is present.
    // If we didn't add data-splitting to the HTML, let's call it manually just in case:
    Splitting({ target: line, by: 'chars' });
    const chars = line.querySelectorAll('.char');
    
    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [60, 0],
      rotateX: [-40, 0],
      duration: 900,
      delay: anime.stagger(25, {start: lineIndex * 350}),
      easing: 'easeOutExpo'
    });
  });
  
  // Hero sub text — word by word
  const subEl = document.querySelector('.hero-sub');
  if (subEl) {
    Splitting({ target: subEl, by: 'words' });
    const subWords = document.querySelectorAll('.hero-sub .word');
    anime({
      targets: subWords,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(40, {start: 1200}),
      easing: 'easeOutQuart'
    });
  }
  
  // CTA buttons spring in
  anime({
    targets: '.cta-row .btn',
    scale: [0.85, 1],
    opacity: [0, 1],
    duration: 700,
    delay: anime.stagger(80, {start: 1600}),
    easing: 'spring(1, 80, 10, 0)'
  });
  
  // Stat cards cascade
  anime({
    targets: '.stat-card',
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 700,
    delay: anime.stagger(120, {start: 1000}),
    easing: 'easeOutBack'
  });
});
