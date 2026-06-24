/* hero-three.js — Kratu v3.2: WebGL 3D Knowledge Graph */

document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('kratu-3d-canvas');
  if (!canvasEl || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvasEl,
    antialias: true, 
    alpha: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.z = 5;

  // Create 80 nodes as Three.js Points
  const nodeCount = 80;
  const positions = new Float32Array(nodeCount * 3);
  const nodeData = [];

  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * 14;
    const y = (Math.random() - 0.5) * 8;
    const z = (Math.random() - 0.5) * 4;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    nodeData.push({ x, y, z, 
      vx: (Math.random()-0.5)*0.003, 
      vy: (Math.random()-0.5)*0.003,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Points geometry
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Custom shader material for glowing points
  const nodeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0xffffff) },
    },
    vertexShader: `
      uniform float time;
      attribute float size;
      varying float vOpacity;
      void main() {
        vOpacity = 0.3 + 0.4 * sin(time + position.x + position.y);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (2.0 + 1.5 * sin(time * 0.8 + position.z)) * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float strength = 1.0 - (d * 2.0);
        strength = pow(strength, 2.0);
        gl_FragColor = vec4(1.0, 1.0, 1.0, strength * vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
  scene.add(nodePoints);

  // Edge lines between nearby nodes
  const edgeMaterial = new THREE.LineBasicMaterial({ 
    color: 0x4F46E5, 
    transparent: true, 
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });

  // Build edges for nodes within distance threshold
  const edgeGeometry = new THREE.BufferGeometry();
  const edgePositions = [];
  const maxDist = 2.5;
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodeData[i].x - nodeData[j].x;
      const dy = nodeData[i].y - nodeData[j].y;
      const dz = nodeData[i].z - nodeData[j].z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < maxDist) {
        edgePositions.push(nodeData[i].x, nodeData[i].y, nodeData[i].z);
        edgePositions.push(nodeData[j].x, nodeData[j].y, nodeData[j].z);
      }
    }
  }
  edgeGeometry.setAttribute('position', 
    new THREE.Float32BufferAttribute(edgePositions, 3));
  const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  scene.add(edges);

  // Mouse interaction
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // Animation loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    nodeMaterial.uniforms.time.value = time;
    
    // Gentle camera drift toward mouse
    camera.position.x += (mouse.x - camera.position.x) * 0.02;
    camera.position.y += (mouse.y - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    
    // Drift nodes slowly
    for (let i = 0; i < nodeCount; i++) {
      nodeData[i].x += nodeData[i].vx;
      nodeData[i].y += nodeData[i].vy;
      if (Math.abs(nodeData[i].x) > 7) nodeData[i].vx *= -1;
      if (Math.abs(nodeData[i].y) > 4) nodeData[i].vy *= -1;
      positions[i * 3] = nodeData[i].x;
      positions[i * 3 + 1] = nodeData[i].y;
    }
    nodeGeometry.attributes.position.needsUpdate = true;
    
    // Slow scene rotation
    nodePoints.rotation.y = time * 0.03;
    edges.rotation.y = time * 0.03;
    
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
