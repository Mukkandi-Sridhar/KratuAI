document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.demo-tab');
  const views = document.querySelectorAll('.demo-view');
  
  // Below this width CSS takes over with a real stacked layout. Scaling the
  // 1000px desktop panel down that far rendered body text at ~5px, so the
  // transform is only used to fit the full desktop layout on mid-size screens.
  const RESPONSIVE_BREAKPOINT = 900;

  const wrappers = document.querySelectorAll('.product-demo-wrapper');
  function updateScale() {
    wrappers.forEach(wrapper => {
      const demo = wrapper.querySelector('.product-demo');
      if (!demo) return;
      // Scale/measure the outermost scaled element (the device frame, when
      // present) so the reserved height includes its title bar too — measuring
      // only .product-demo clips the frame chrome off the bottom.
      const scaleTarget = wrapper.querySelector('.device-frame') || demo;
      const targetWidth = wrapper.parentElement.clientWidth;

      scaleTarget.style.transform = 'none';

      if (window.innerWidth <= RESPONSIVE_BREAKPOINT) {
        // Hand off to the CSS layout entirely — clear anything a previous
        // resize left behind so it can't fight the stylesheet.
        scaleTarget.style.transformOrigin = '';
        wrapper.style.height = '';
        return;
      }

      const baseHeight = scaleTarget.offsetHeight;

      if (targetWidth < 1000) {
        const scale = targetWidth / 1000;
        scaleTarget.style.transform = `scale(${scale})`;
        scaleTarget.style.transformOrigin = 'top center';
        wrapper.style.height = `${baseHeight * scale}px`;
      } else {
        wrapper.style.height = `${baseHeight}px`;
      }
    });
  }
  window.addEventListener('resize', updateScale);
  updateScale();

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
      bars.forEach((bar, i) => {
        bar.style.height = '0';
        Motion.animate(
          bar,
          { height: [0, getComputedStyle(bar).getPropertyValue('--target-height').trim()] },
          { duration: 0.6, delay: i * 0.1, easing: 'ease-out' }
        );
      });
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      autoplay = false;
      activeIndex = index;
      switchTab(index);
    });
  });

  // Autoplay removed so the interactive chat stays focused
});
