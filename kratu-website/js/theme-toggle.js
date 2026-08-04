/* ═══════════════════════════════════════════════════════════
   THEME-TOGGLE.JS — Light/dark switcher button
   Initial theme is set synchronously by an inline script in
   <head> (before first paint); this file only wires the button.
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function paintIcon(theme) {
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.innerHTML = theme === 'light'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  }

  paintIcon(document.documentElement.dataset.theme || 'light');

  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('kratu-theme', next);
    paintIcon(next);
  });
});
