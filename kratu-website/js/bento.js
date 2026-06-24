/* bento.js — Kratu v3.2: Bento Animations (Three.js, VanillaTilt, Anime.js) */

document.addEventListener('kratu:ready', () => {

  // VanillaTilt on all bento cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.bento-card'), {
      max: 12,
      speed: 300,
      glare: true,
      'max-glare': 0.2,
      perspective: 800,
      scale: 1.03,
      gyroscope: false,
      'full-page-listening': false
    });
  }

  // --- RAG CARD Three.js mini graph ---
  const ragCanvas = document.getElementById('rag-canvas');
  if (ragCanvas && typeof THREE !== 'undefined') {
    const ragScene = new THREE.Scene();
    const ragCamera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    ragCamera.position.z = 4;
    const ragRenderer = new THREE.WebGLRenderer({ canvas: ragCanvas, antialias: true, alpha: true });
    ragRenderer.setSize(300, 150);
    ragRenderer.setClearColor(0x000000, 0);

    const ragNodes = [];
    const group = new THREE.Group();
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.8;
      
      const geo = new THREE.CircleGeometry(0.04 + Math.random()*0.04, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0x4F46E5, transparent: true, opacity: 0.8 });
      const mesh = new THREE.Mesh(geo, mat);
      
      mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.6,
        (Math.random() - 0.5) * 0.5
      );
      group.add(mesh);

      ragNodes.push({
        mesh,
        baseAngle: angle,
        speed: 0.001 + Math.random() * 0.002
      });
    }
    
    // Add edges
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10B981, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 10; i++) {
      const points = [];
      points.push(ragNodes[Math.floor(Math.random()*15)].mesh.position);
      points.push(ragNodes[Math.floor(Math.random()*15)].mesh.position);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(lineGeo, lineMat));
    }

    ragScene.add(group);

    const ragClock = new THREE.Clock();
    function ragAnimate() {
      requestAnimationFrame(ragAnimate);
      const t = ragClock.getElapsedTime();
      ragScene.rotation.y = t * 0.3;
      ragScene.rotation.x = Math.sin(t * 0.2) * 0.1;
      ragRenderer.render(ragScene, ragCamera);
    }
    ragAnimate();
  }

  // --- MCP PIPELINE CARD — Anime.js pipeline flow animation ---
  function runPipeline() {
    if (typeof anime === 'undefined') return;
    anime({
      targets: '.pipe-step',
      backgroundColor: [
        { value: 'rgba(79,70,229,0)', duration: 0 },
        { value: 'rgba(79,70,229,0.8)', duration: 300 },
        { value: 'rgba(79,70,229,0)', duration: 300 }
      ],
      color: [
        { value: '#8B8FA8', duration: 0 },
        { value: '#ffffff', duration: 300 },
        { value: '#8B8FA8', duration: 300 }
      ],
      borderRadius: ['4px'],
      padding: ['2px 8px'],
      delay: anime.stagger(250),
      complete: () => setTimeout(runPipeline, 1500)
    });
  }

  const mcpCard = document.querySelector('.bento-card--large:last-child');
  if (mcpCard) {
    const pipeObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { 
        runPipeline(); 
        pipeObserver.disconnect(); 
      }
    }, { threshold: 0.5 });
    pipeObserver.observe(mcpCard);
  }

  // --- FASTAPI THROUGHPUT BARS — Anime.js ---
  function animateBars() {
    if (typeof anime === 'undefined') return;
    anime({
      targets: '.t-fill',
      width: (el) => el.style.getPropertyValue('--w') || '80%',
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.stagger(100),
      complete: () => {
        setTimeout(() => {
          anime({
            targets: '.t-fill',
            width: () => (60 + Math.random() * 40) + '%',
            duration: 600,
            easing: 'easeInOutQuart',
            complete: animateBars
          });
        }, 1200);
      }
    });
  }
  
  const fastapiCard = document.querySelector('.t-bar');
  if (fastapiCard) {
    const barsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateBars();
        barsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    barsObserver.observe(fastapiCard);
  }

  // ============================================
  // HOW-CARDS THREE.JS MINI SCENES
  // ============================================

  // DAY 1 CARD — Three.js file merge animation
  const d1Canvas = document.getElementById('day1-canvas');
  if (d1Canvas && typeof THREE !== 'undefined') {
    const d1Scene = new THREE.Scene();
    const d1Camera = new THREE.OrthographicCamera(-3, 3, 2, -2, 0.1, 10);
    d1Camera.position.z = 5;
    const d1Renderer = new THREE.WebGLRenderer({
      canvas: d1Canvas,
      antialias: true, alpha: true
    });
    // Set to match typical card width/height
    d1Renderer.setSize(380, 140);
    d1Renderer.setClearColor(0x000000, 0);

    function makeFileBox(color, label) {
      const shape = new THREE.Shape();
      const w = 0.8, h = 0.5, r = 0.1;
      shape.moveTo(-w/2+r, -h/2);
      shape.lineTo(w/2-r, -h/2);
      shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2+r);
      shape.lineTo(w/2, h/2-r);
      shape.quadraticCurveTo(w/2, h/2, w/2-r, h/2);
      shape.lineTo(-w/2+r, h/2);
      shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2-r);
      shape.lineTo(-w/2, -h/2+r);
      shape.quadraticCurveTo(-w/2, -h/2, -w/2+r, -h/2);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      return new THREE.Mesh(geo, mat);
    }

    const csvBox = makeFileBox(0x4F46E5, 'CSV');
    const pdfBox = makeFileBox(0xF59E0B, 'PDF');
    const apiBox = makeFileBox(0x10B981, 'API');
    csvBox.position.set(-2.2, 0, 0);
    pdfBox.position.set(0, 0, 0);
    apiBox.position.set(2.2, 0, 0);
    d1Scene.add(csvBox, pdfBox, apiBox);

    function startMerge() {
      if (typeof anime === 'undefined') return;
      anime({
        targets: [csvBox.position, apiBox.position],
        x: 0,
        duration: 1200,
        easing: 'easeInOutQuart',
        complete: () => {
          // Flash effect
          anime({
            targets: [csvBox.material, pdfBox.material, apiBox.material],
            opacity: [1, 0],
            duration: 400,
            delay: 300,
            complete: () => {
              // Reset positions
              setTimeout(() => {
                csvBox.position.x = -2.2;
                apiBox.position.x = 2.2;
                [csvBox, pdfBox, apiBox].forEach(b => b.material.opacity = 0.9);
              }, 800);
              setTimeout(startMerge, 1600);
            }
          });
        }
      });
    }
    
    // Only start if visible
    const d1Observer = new IntersectionObserver(([e]) => {
      if(e.isIntersecting) { startMerge(); d1Observer.disconnect(); }
    });
    d1Observer.observe(d1Canvas);

    function d1Animate() { requestAnimationFrame(d1Animate); d1Renderer.render(d1Scene, d1Camera); }
    d1Animate();
  }

  // DAY 2 CARD — Particle chunks flowing into vector
  const d2Canvas = document.getElementById('day2-canvas');
  if (d2Canvas && typeof THREE !== 'undefined') {
    const d2Scene = new THREE.Scene();
    const d2Camera = new THREE.PerspectiveCamera(50, 380/140, 0.1, 100);
    d2Camera.position.z = 4;
    const d2Renderer = new THREE.WebGLRenderer({ canvas: d2Canvas, antialias: true, alpha: true });
    d2Renderer.setSize(380, 140);
    d2Renderer.setClearColor(0x000000, 0);
    
    // Create particles that flow left to right
    const pGeo = new THREE.BufferGeometry();
    const pCount = 50;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount; i++) {
      pPos[i*3] = -2 + Math.random() * 4;
      pPos[i*3+1] = -1 + Math.random() * 2;
      pPos[i*3+2] = (Math.random() - 0.5) * 0.5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x4F46E5, size: 0.1, transparent: true, opacity: 0.8 });
    const pSystem = new THREE.Points(pGeo, pMat);
    d2Scene.add(pSystem);
    
    const d2Clock = new THREE.Clock();
    function d2Animate() {
      requestAnimationFrame(d2Animate);
      const t = d2Clock.getElapsedTime();
      const positions = pSystem.geometry.attributes.position.array;
      for(let i=0; i<pCount; i++) {
        positions[i*3] += 0.02; // move right
        if (positions[i*3] > 2) {
          positions[i*3] = -2; // reset to left
          positions[i*3+1] = -1 + Math.random() * 2;
        }
      }
      pSystem.geometry.attributes.position.needsUpdate = true;
      d2Renderer.render(d2Scene, d2Camera);
    }
    d2Animate();
  }

  // DAY 5 CARD — Live chart using Three.js line
  const d5Canvas = document.getElementById('day5-canvas');
  if (d5Canvas && typeof THREE !== 'undefined') {
    const d5Scene = new THREE.Scene();
    const d5Camera = new THREE.OrthographicCamera(-4.5, 4.5, 1.5, -1.5, 0.1, 10);
    d5Camera.position.z = 5;
    const d5Renderer = new THREE.WebGLRenderer({ canvas: d5Canvas, antialias: true, alpha: true });
    d5Renderer.setSize(240, 70); // Match SVG viewBox proportions roughly
    d5Renderer.setClearColor(0x000000, 0);

    const chartPoints = [];
    const maxPoints = 50;
    for (let i = 0; i < maxPoints; i++) {
      chartPoints.push(new THREE.Vector3(
        -4 + i * 0.16,
        Math.sin(i * 0.4) * 0.6 + Math.random() * 0.2,
        0
      ));
    }
    
    const lineGeo = new THREE.BufferGeometry();
    const chartLine = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x10B981, linewidth: 2 })
    );
    d5Scene.add(chartLine);

    let revealCount = 0;
    function revealChart() {
      if (revealCount <= chartPoints.length) {
        const visiblePoints = chartPoints.slice(0, revealCount);
        if (visiblePoints.length > 0) {
          chartLine.geometry.setFromPoints(visiblePoints);
        }
        revealCount++;
        setTimeout(revealChart, 40);
      } else {
        // Continuous wave
        setTimeout(() => {
          for(let i=0; i<maxPoints; i++) {
            chartPoints[i].y += (Math.random() - 0.5) * 0.1;
          }
          chartLine.geometry.setFromPoints(chartPoints);
        }, 100);
      }
    }
    
    const d5Observer = new IntersectionObserver(([e]) => {
      if(e.isIntersecting) { revealChart(); d5Observer.disconnect(); }
    });
    d5Observer.observe(d5Canvas);

    function d5Animate() { requestAnimationFrame(d5Animate); d5Renderer.render(d5Scene, d5Camera); }
    d5Animate();
  }

});
