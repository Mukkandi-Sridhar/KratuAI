/* nav.js — Kratu v3.1: scroll state + active section detection + mobile menu */

(function () {
  'use strict';

  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // ── SCROLL STATE ──
    const THRESHOLD = 80;
    let lastScroll = 0;

    function updateNav(scrollY) {
      if (scrollY > THRESHOLD) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      lastScroll = scrollY;
    }

    // Hook into Lenis if available, else use window scroll
    if (window.lenis) {
      window.lenis.on('scroll', ({ scroll }) => updateNav(scroll));
    } else {
      window.addEventListener('scroll', () => updateNav(window.scrollY), { passive: true });
    }

    // Initial state
    updateNav(window.scrollY);

    // ── ACTIVE SECTION DETECTION via ScrollTrigger ──
    if (typeof ScrollTrigger !== 'undefined') {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-links a[href*="#"]');

      sections.forEach(section => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActive(section.id),
          onEnterBack: () => setActive(section.id),
        });
      });

      function setActive(id) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.includes('#' + id)) {
            link.style.color = 'var(--ink-bright)';
          } else {
            link.style.color = '';
          }
        });
      }
    }

    // ── MOBILE MENU TOGGLE ──
    const toggle = nav.querySelector('.nav-toggle');
    const mobileMenu = nav.nextElementSibling && nav.nextElementSibling.classList.contains('mobile-menu')
      ? nav.nextElementSibling
      : document.querySelector('.mobile-menu');

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        mobileMenu.setAttribute('aria-hidden', String(isOpen));
        mobileMenu.style.display = isOpen ? '' : 'flex';

        if (typeof gsap !== 'undefined') {
          if (!isOpen) {
            gsap.from(mobileMenu, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' });
          }
        }

        // Prevent body scroll when menu is open
        if (!isOpen) {
          document.body.style.overflow = 'hidden';
          if (window.lenis) window.lenis.stop();
        } else {
          document.body.style.overflow = '';
          if (window.lenis) window.lenis.start();
        }
      });

      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          mobileMenu.style.display = '';
          document.body.style.overflow = '';
          if (window.lenis) window.lenis.start();
        });
      });
    }

    // ── NAV DROPDOWN HOVER (desktop) ──
    const navItems = nav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const dropdown = item.querySelector('.nav-dropdown');
      if (!dropdown) return;

      item.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.from(dropdown, { opacity: 0, y: -8, duration: 0.25, ease: 'power2.out' });
        }
        dropdown.style.display = 'flex';
      });

      item.addEventListener('mouseleave', () => {
        dropdown.style.display = '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initNav);
})();
