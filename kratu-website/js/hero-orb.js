/* ═══════════════════════════════════════════════════════════
   HERO-ORB.JS — Drag-to-rotate 3D knowledge graph (Three.js)
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') return;

  const wrap = document.querySelector('.graph-canvas-wrap');
  const canvas = document.getElementById('graph-canvas');
  if (!wrap || !canvas) return;

  // Bail gracefully if WebGL isn't available (disabled GPU, some remote
  // sessions, certain sandboxed/corporate environments, etc.) — otherwise
  // THREE.WebGLRenderer throws synchronously and takes the section with it.
  const testCtx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!testCtx) {
    wrap.classList.add('graph-canvas-wrap--fallback');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NODE_COUNT = 64;
  const RADIUS = 2;
  const COLORS = [0x818cf8, 0x34d399, 0xf472b6];

  let scene, camera, renderer;
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.6;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
  } catch (err) {
    wrap.classList.add('graph-canvas-wrap--fallback');
    return;
  }

  function sizeToWrap() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const group = new THREE.Group();

  // Fibonacci sphere distribution for the nodes
  const positions = [];
  const colors = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const jitter = 1 + (Math.random() - 0.5) * 0.12;
    const x = Math.cos(theta) * r * RADIUS * jitter;
    const yy = y * RADIUS * jitter;
    const z = Math.sin(theta) * r * RADIUS * jitter;
    positions.push(x, yy, z);

    const c = new THREE.Color(COLORS[i % COLORS.length]);
    colors.push(c.r, c.g, c.b);
  }

  // Soft circular sprite for points so they don't render as hard squares
  function circleTexture() {
    const size = 64;
    const cnv = document.createElement('canvas');
    cnv.width = size;
    cnv.height = size;
    const ctx = cnv.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.9)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(cnv);
  }

  const pointsGeom = new THREE.BufferGeometry();
  pointsGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  pointsGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const pointsMat = new THREE.PointsMaterial({
    size: 0.11,
    map: circleTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(pointsGeom, pointsMat);
  group.add(points);

  // Connect each node to its nearest neighbours
  const linePositions = [];
  const K = 2;
  for (let i = 0; i < NODE_COUNT; i++) {
    const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
    const dists = [];
    for (let j = 0; j < NODE_COUNT; j++) {
      if (i === j) continue;
      const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
      const d = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2;
      dists.push([d, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < K; k++) {
      const j = dists[k][1];
      linePositions.push(ax, ay, az, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
    }
  }

  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
  const lines = new THREE.LineSegments(lineGeom, lineMat);
  group.add(lines);

  scene.add(group);

  // Pointer drag with inertia
  let dragging = false;
  let lastX = 0, lastY = 0;
  let velX = 0, velY = 0;

  function pointerDown(e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = 0;
    velY = 0;
  }
  function pointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    velX = dx * 0.005;
    velY = dy * 0.005;
    group.rotation.y += velX;
    group.rotation.x += velY;
    lastX = e.clientX;
    lastY = e.clientY;
  }
  function pointerUp() {
    dragging = false;
  }

  wrap.addEventListener('pointerdown', pointerDown);
  window.addEventListener('pointermove', pointerMove);
  window.addEventListener('pointerup', pointerUp);

  sizeToWrap();
  window.addEventListener('resize', sizeToWrap);

  function animate() {
    if (!dragging) {
      group.rotation.y += reduceMotion ? 0 : 0.0016 + velX;
      group.rotation.x += velY;
      velX *= 0.94;
      velY *= 0.94;
    }
    try {
      renderer.render(scene, camera);
    } catch (err) {
      return; // stop the loop silently if the context is lost mid-animation
    }
    requestAnimationFrame(animate);
  }
  animate();
});
