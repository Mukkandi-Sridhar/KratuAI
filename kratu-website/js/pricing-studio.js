/* pricing-studio.js */
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('studio') !== 'true') return;

  // Inject CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'css/pricing-variations.css';
  document.head.appendChild(link);

  const presets = {
    a: {
      name: 'Linear Dark',
      layout: 'vertical', shape: 'rounded', space: 'compact', type: 'clean', 
      shadow: 'flat', border: 'subtle', anim: 'subtle', bg: 'solid', 
      feat: 'check', cta: 'filled', pilot: 'glow', theme: 'dark'
    },
    b: {
      name: 'Editorial Asymmetric',
      layout: 'editorial', shape: 'sharp', space: 'airy', type: 'bold', 
      shadow: 'medium', border: 'none', anim: 'off', bg: 'solid', 
      feat: 'icon', cta: 'ghost', pilot: 'top', theme: 'light'
    },
    c: {
      name: 'Comparison Table',
      layout: 'horizontal', shape: 'sharp', space: 'comfortable', type: 'clean', 
      shadow: 'flat', border: 'subtle', anim: 'off', bg: 'solid', 
      feat: 'minimal', cta: 'outline', pilot: 'highlight', theme: 'dark'
    },
    d: {
      name: 'Floating Cards',
      layout: 'vertical', shape: 'pill', space: 'airy', type: 'bold', 
      shadow: 'deep', border: 'glow', anim: 'expressive', bg: 'mesh', 
      feat: 'minimal', cta: 'filled', pilot: 'elevated', theme: 'dark'
    },
    e: {
      name: 'Brutalist Minimal',
      layout: 'vertical', shape: 'sharp', space: 'compact', type: 'bold', 
      shadow: 'brutalist', border: 'bold', anim: 'brutalist', bg: 'solid', 
      feat: 'minimal', cta: 'minimal', pilot: 'highlight', theme: 'light'
    }
  };

  const controls = [
    { id: 'layout', label: 'Layout Style', opts: { vertical: 'Vertical Cards', horizontal: 'Horizontal Table', editorial: 'Editorial Asymmetric' } },
    { id: 'shape', label: 'Card Shape', opts: { rounded: 'Rounded', sharp: 'Sharp', pill: 'Pill-adjacent' } },
    { id: 'space', label: 'Spacing', opts: { compact: 'Compact', comfortable: 'Comfortable', airy: 'Airy' } },
    { id: 'type', label: 'Typography', opts: { clean: 'Clean/Small', bold: 'Bold/Large' } },
    { id: 'shadow', label: 'Shadows', opts: { flat: 'Flat', medium: 'Medium', deep: 'Deep', brutalist: 'Solid Offset' } },
    { id: 'border', label: 'Borders', opts: { none: 'None', subtle: 'Subtle', glow: 'Glow', bold: 'Bold Black' } },
    { id: 'anim', label: 'Animation', opts: { off: 'Off', subtle: 'Subtle Scale', expressive: 'Tilt & Glow', brutalist: 'Hard Shift' } },
    { id: 'bg', label: 'Background', opts: { solid: 'Solid', gradient: 'Gradient', mesh: 'Mesh Noise' } },
    { id: 'feat', label: 'Features', opts: { check: 'Checkmarks', icon: 'Icon + Text', minimal: 'Minimal Text' } },
    { id: 'cta', label: 'CTA Style', opts: { filled: 'Filled', outline: 'Outline', ghost: 'Ghost', minimal: 'Minimal Text →' } },
    { id: 'pilot', label: 'Pilot Card', opts: { highlight: 'Highlighted', elevated: 'Centered Elevated', top: 'Top Oversized', glow: 'Amber Glow' } },
    { id: 'theme', label: 'Theme Mode', opts: { dark: 'Dark', light: 'Light', split: 'Split' } }
  ];

  // Build UI
  const panel = document.createElement('div');
  panel.className = 'pricing-studio-panel';
  
  let tabsHTML = '<div class="studio-tabs">';
  Object.keys(presets).forEach(k => {
    tabsHTML += `<button class="s-tab" data-var="${k}">${presets[k].name}</button>`;
  });
  tabsHTML += '</div>';

  let controlsHTML = '<div class="studio-controls">';
  controls.forEach(c => {
    controlsHTML += `
      <div class="s-ctrl">
        <label>${c.label}</label>
        <select data-prop="${c.id}">
          ${Object.keys(c.opts).map(opt => `<option value="${opt}">${c.opts[opt]}</option>`).join('')}
        </select>
      </div>
    `;
  });
  controlsHTML += '</div>';

  panel.innerHTML = `
    <div class="studio-header">
      <h3>Component Studio</h3>
      <button id="copy-css-btn">Copy CSS</button>
    </div>
    ${tabsHTML}
    ${controlsHTML}
  `;

  document.body.appendChild(panel);

  // CSS for Studio Panel itself
  const studioStyles = document.createElement('style');
  studioStyles.textContent = `
    .pricing-studio-panel {
      position: fixed; right: 20px; top: 80px; width: 340px;
      background: rgba(12, 12, 12, 0.95); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 16px; z-index: 10000; font-family: sans-serif; color: white;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      max-height: calc(100vh - 100px); overflow-y: auto;
    }
    .pricing-studio-panel::-webkit-scrollbar { width: 6px; }
    .pricing-studio-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
    .studio-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .studio-header h3 { margin: 0; font-size: 14px; font-weight: 600; }
    #copy-css-btn { background: #4F46E5; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; }
    .studio-tabs { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; }
    .s-tab { background: rgba(255,255,255,0.05); color: #ccc; border: 1px solid transparent; padding: 6px 12px; text-align: left; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .s-tab:hover { background: rgba(255,255,255,0.1); }
    .s-tab.active { background: #4F46E5; color: white; border-color: #6366F1; }
    .studio-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .s-ctrl label { display: block; font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; }
    .s-ctrl select { width: 100%; background: #111; border: 1px solid #333; color: white; padding: 6px; border-radius: 4px; font-size: 11px; outline: none; }
    .s-ctrl select:focus { border-color: #4F46E5; }
  `;
  document.head.appendChild(studioStyles);

  const container = document.querySelector('.pricing-cards-section');
  const innerContainer = document.querySelector('.pricing-cards');
  
  function applyState() {
    const selects = panel.querySelectorAll('select');
    let classStr = 'pricing-cards';
    
    selects.forEach(s => {
      const prop = s.dataset.prop;
      const val = s.value;
      classStr += ` st-${prop}-${val}`;
    });
    
    if (innerContainer) innerContainer.className = classStr;
    
    // Apply theme to section
    const theme = panel.querySelector('[data-prop="theme"]').value;
    if (container) {
      container.className = 'pricing-cards-section ' + `st-bg-${theme}`;
    }
  }

  function setPreset(key) {
    const p = presets[key];
    panel.querySelectorAll('.s-tab').forEach(t => t.classList.toggle('active', t.dataset.var === key));
    Object.keys(p).forEach(k => {
      if(k !== 'name') {
        const select = panel.querySelector(`[data-prop="${k}"]`);
        if (select) select.value = p[k];
      }
    });
    applyState();
  }

  // Event Listeners
  panel.querySelectorAll('.s-tab').forEach(t => {
    t.addEventListener('click', () => setPreset(t.dataset.var));
  });

  panel.querySelectorAll('select').forEach(s => {
    s.addEventListener('change', () => {
      panel.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
      applyState();
    });
  });

  document.getElementById('copy-css-btn').addEventListener('click', () => {
    if (!innerContainer) return;
    const classes = innerContainer.className.split(' ').filter(c => c.startsWith('st-')).join('.');
    const cssText = `/* Applied Studio Classes */\n.pricing-cards.${classes} {\n  /* Active state */\n}`;
    navigator.clipboard.writeText(cssText);
    const btn = document.getElementById('copy-css-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy CSS', 2000);
  });

  // Init
  setPreset('a');

})();
