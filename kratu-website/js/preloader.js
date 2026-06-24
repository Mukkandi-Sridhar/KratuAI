/* preloader.js — Kratu cinematic preloader */

(function () {
  'use strict';

  // Inject preloader HTML immediately (before DOMContentLoaded)
  const html = `
    <div id="preloader">
      <div class="pre-logo">Kratu<span>.</span></div>
      <div class="pre-terminal">
        <div class="pre-line" data-line="0">$ initialising knowledge graph...</div>
        <div class="pre-line" data-line="1">$ connecting your data sources...</div>
        <div class="pre-line" data-line="2">$ deploying intelligence layer...</div>
        <div class="pre-line" data-line="3">$ your AI is ready.</div>
      </div>
      <div class="pre-counter">0%</div>
      <div class="pre-bar"><div class="pre-bar-fill"></div></div>
    </div>
  `;

  // Inject ASAP
  if (document.body) {
    document.body.insertAdjacentHTML('afterbegin', html);
    document.body.style.opacity = '1';
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentHTML('afterbegin', html);
      document.body.style.opacity = '1';
    });
  }

  function startPreloader() {
    if (typeof anime === 'undefined') return;

    const preloaderTL = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        anime({
          targets: '#preloader',
          translateY: '-100%',
          duration: 1000,
          easing: 'easeInExpo',
          complete: () => {
            const el = document.getElementById('preloader');
            if(el) el.remove();
            document.dispatchEvent(new Event('kratu:ready'));
          }
        });
      }
    });

    preloaderTL
      .add({ targets: '.pre-logo', opacity: [0,1], translateY: [20,0], duration: 600 })
      .add({ targets: '.pre-line:nth-child(1)', opacity: [0,1], translateX: [-20,0], duration: 400 }, '+=200')
      .add({ targets: '.pre-line:nth-child(2)', opacity: [0,1], translateX: [-20,0], duration: 400 }, '+=150')
      .add({ targets: '.pre-line:nth-child(3)', opacity: [0,1], translateX: [-20,0], duration: 400 }, '+=150')
      .add({ targets: '.pre-line:nth-child(4)', 
        opacity: [0,1], 
        color: ['#4A4862', '#10B981'], 
        duration: 500 
      }, '+=150')
      .add({ 
        targets: '.pre-bar-fill', 
        width: ['0%', '100%'], 
        duration: 2000,
        easing: 'easeInOutQuart',
        begin: () => {
          // Update counter in sync
          anime({ targets: {val:0}, val:100, duration:2000, 
            easing:'easeInOutQuart',
            update: (a) => {
              const counter = document.querySelector('.pre-counter');
              if(counter) {
                counter.textContent = Math.round(a.animations[0].currentValue) + '%';
              }
            }
          });
        }
      }, 0);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPreloader);
  } else {
    startPreloader();
  }
})();
