(function () {
  const ns = window.aiResume || (window.aiResume = {});

  const canvas = document.getElementById("bg-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  /* Particle field */
  const COUNT = 220;
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocities.push({
      x: (Math.random() - 0.5) * 0.006,
      y: (Math.random() - 0.5) * 0.006,
      z: (Math.random() - 0.5) * 0.003
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x0f766e,
    size: 0.1,
    transparent: true,
    opacity: 0.22,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  /* Soft connecting lines between nearby particles */
  const lineCount = 48;
  const linePositions = new Float32Array(lineCount * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0f766e,
    transparent: true,
    opacity: 0.045
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  /* Mouse influence */
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener("mousemove", function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* Scroll-based camera tilt */
  let scrollProgress = 0;
  ns.setScrollProgress = function (value) {
    scrollProgress = value;
  };

  function updateLines() {
    const pos = geometry.attributes.position.array;
    let idx = 0;
    const maxDist = 6.5;

    for (let i = 0; i < COUNT && idx < lineCount * 6; i++) {
      for (let j = i + 1; j < COUNT && idx < lineCount * 6; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          linePositions[idx++] = pos[i * 3];
          linePositions[idx++] = pos[i * 3 + 1];
          linePositions[idx++] = pos[i * 3 + 2];
          linePositions[idx++] = pos[j * 3];
          linePositions[idx++] = pos[j * 3 + 1];
          linePositions[idx++] = pos[j * 3 + 2];
        }
      }
    }

    /* Zero out unused */
    for (let k = idx; k < lineCount * 6; k++) {
      linePositions[k] = 0;
    }

    lineGeometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    requestAnimationFrame(animate);

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      /* Wrap around */
      if (pos[i * 3] > 40) pos[i * 3] = -40;
      if (pos[i * 3] < -40) pos[i * 3] = 40;
      if (pos[i * 3 + 1] > 40) pos[i * 3 + 1] = -40;
      if (pos[i * 3 + 1] < -40) pos[i * 3 + 1] = 40;
    }

    geometry.attributes.position.needsUpdate = true;
    updateLines();

    /* Camera subtle movement */
    camera.position.x += (mouseX * 0.7 - camera.position.x) * 0.015;
    camera.position.y += (-mouseY * 0.7 - camera.position.y) * 0.015;
    camera.rotation.z = scrollProgress * 0.008;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  ns.threeBg = { scene, camera };
})();
