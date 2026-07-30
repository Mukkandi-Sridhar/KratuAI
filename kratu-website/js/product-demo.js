document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.demo-tab');
  const views = document.querySelectorAll('.demo-view');
  if (!tabs.length) return;

  let activeIndex = 0;
  let autoplay = true;
  let timer;

  function switchTab(index) {
    tabs.forEach(t => t.classList.remove('active'));
    views.forEach(v => v.classList.remove('active'));
    tabs[index].classList.add('active');
    views[index].classList.add('active');
    
    // Animate bars if it's the Observability view (index 3)
    if (index === 3 && typeof Motion !== 'undefined') {
      const bars = views[index].querySelectorAll('.demo-bar');
      bars.forEach(bar => {
        bar.style.height = '0';
      });
      // Stagger animation using Motion.js
      Motion.animate(
        bars,
        { height: (el) => [0, el.dataset.targetHeight] },
        { duration: 0.6, delay: Motion.stagger(0.1), easing: 'ease-out' }
      );
    }
  }

  function startAutoplay() {
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => {
      if(!autoplay) { clearInterval(timer); return; }
      activeIndex = (activeIndex + 1) % tabs.length;
      switchTab(activeIndex);
    }, 4000);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      autoplay = false;
      activeIndex = index;
      switchTab(index);
    });
  });

  startAutoplay();
});
