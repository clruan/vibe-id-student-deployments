(function () {
  const ns = window.aiResume || (window.aiResume = {});
  const canvas = document.getElementById("bg-canvas");

  if (!canvas || !window.THREE) {
    ns.setScrollProgress = function () {};
    ns.threeBg = null;
    return;
  }

  let renderer;
  let context;
  try {
    context = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    }) || canvas.getContext("experimental-webgl", {
      alpha: true,
      antialias: true
    });
  } catch (error) {
    context = null;
  }

  if (!context) {
    ns.setScrollProgress = function () {};
    ns.threeBg = null;
    return;
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true });
  } catch (error) {
    ns.setScrollProgress = function () {};
    ns.threeBg = null;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.016);

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1200);
  camera.position.set(0, 0, 34);

  const THEMES = {
    duke: {
      point: 0x00dcff,
      line: 0xd8ff00,
      core: 0xff2bd6,
      shell: 0x88f7ff,
      shard: 0xd8ff00,
      spin: 0.19,
      cameraZ: 31,
      fog: 0x041116
    },
    frank: {
      point: 0xff5a1f,
      line: 0xffd400,
      core: 0x00ff9d,
      shell: 0xff2f2f,
      shard: 0xffd400,
      spin: -0.16,
      cameraZ: 32,
      fog: 0x160805
    },
    aaron: {
      point: 0xb7ff3c,
      line: 0x00d8ff,
      core: 0xff4fb8,
      shell: 0xa88cff,
      shard: 0xffd166,
      spin: 0.13,
      cameraZ: 30,
      fog: 0x090612
    },
    zach: {
      point: 0x00ff75,
      line: 0xff2bd6,
      core: 0xe7ff2f,
      shell: 0x00dcff,
      shard: 0x00ff75,
      spin: 0.23,
      cameraZ: 33,
      fog: 0x020a05
    }
  };

  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    down: 0
  };

  let scrollProgress = 0;
  let activeTheme = THEMES.duke;
  const clock = new THREE.Clock();
  const world = new THREE.Group();
  const haloGroup = new THREE.Group();
  const particleGroup = new THREE.Group();
  scene.add(world);
  scene.add(haloGroup);
  scene.add(particleGroup);

  const coreMaterial = new THREE.MeshBasicMaterial({
    color: activeTheme.core,
    wireframe: true,
    transparent: true,
    opacity: 0.88
  });

  const shellMaterial = new THREE.MeshBasicMaterial({
    color: activeTheme.shell,
    wireframe: true,
    transparent: true,
    opacity: 0.32
  });

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: activeTheme.line,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });

  const shardMaterial = new THREE.MeshBasicMaterial({
    color: activeTheme.shard,
    transparent: true,
    opacity: 0.46
  });

  const pointMaterial = new THREE.PointsMaterial({
    color: activeTheme.point,
    size: 0.12,
    transparent: true,
    opacity: 0.72,
    sizeAttenuation: true
  });

  const lineMaterial = new THREE.LineBasicMaterial({
    color: activeTheme.line,
    transparent: true,
    opacity: 0.16
  });

  const core = new THREE.Mesh(new THREE.TorusKnotGeometry(5.6, 0.28, 180, 18, 2, 5), coreMaterial);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(9.2, 1), shellMaterial);
  shell.rotation.set(0.38, 0.24, 0.16);
  world.add(core);
  world.add(shell);

  for (let i = 0; i < 7; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(11 + i * 2.35, 0.018, 8, 192),
      ringMaterial
    );
    ring.rotation.x = Math.PI / 2 + i * 0.14;
    ring.rotation.y = i * 0.34;
    ring.userData.speed = (i % 2 ? -1 : 1) * (0.06 + i * 0.009);
    haloGroup.add(ring);
  }

  const SHARD_COUNT = 96;
  const shardGeometry = new THREE.BoxGeometry(0.12, 0.12, 2.8);
  const shards = new THREE.InstancedMesh(shardGeometry, shardMaterial, SHARD_COUNT);
  const shardMatrix = new THREE.Matrix4();
  const shardObject = new THREE.Object3D();
  const shardData = [];
  for (let i = 0; i < SHARD_COUNT; i++) {
    shardData.push({
      radius: 11 + Math.random() * 23,
      angle: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 24,
      speed: 0.18 + Math.random() * 0.42,
      scale: 0.55 + Math.random() * 1.8
    });
  }
  world.add(shards);

  const PARTICLE_COUNT = 460;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const particleSeeds = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 96;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 72;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 72;
    particleSeeds.push(Math.random() * Math.PI * 2);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry, pointMaterial);
  particleGroup.add(particles);

  const LINE_COUNT = 84;
  const linePositions = new Float32Array(LINE_COUNT * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  particleGroup.add(lines);

  const cursorMaterial = new THREE.LineBasicMaterial({
    color: activeTheme.core,
    transparent: true,
    opacity: 0.55
  });
  const cursorGeometry = new THREE.BufferGeometry();
  cursorGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(18), 3));
  const cursorReticle = new THREE.LineSegments(cursorGeometry, cursorMaterial);
  scene.add(cursorReticle);

  ns.setScrollProgress = function (value) {
    scrollProgress = value || 0;
  };

  function resolveTheme(userId) {
    var id = String(userId || "duke").toLowerCase();
    if (id.indexOf("frank") === 0) return "frank";
    if (id.indexOf("aaron") === 0 || id.indexOf("arron") === 0) return "aaron";
    if (id.indexOf("zach") === 0) return "zach";
    return "duke";
  }

  function colorToTween(hex) {
    return {
      r: ((hex >> 16) & 255) / 255,
      g: ((hex >> 8) & 255) / 255,
      b: (hex & 255) / 255
    };
  }

  function applyColor(material, hex, immediate) {
    if (!material || !material.color) return;
    if (!window.gsap || immediate) {
      material.color.setHex(hex);
      return;
    }
    gsap.to(material.color, Object.assign(colorToTween(hex), {
      duration: 1.05,
      ease: "power3.out"
    }));
  }

  function applyTheme(userId, immediate) {
    activeTheme = THEMES[resolveTheme(userId)] || THEMES.duke;
    applyColor(pointMaterial, activeTheme.point, immediate);
    applyColor(lineMaterial, activeTheme.line, immediate);
    applyColor(ringMaterial, activeTheme.line, immediate);
    applyColor(coreMaterial, activeTheme.core, immediate);
    applyColor(shellMaterial, activeTheme.shell, immediate);
    applyColor(shardMaterial, activeTheme.shard, immediate);
    applyColor(cursorMaterial, activeTheme.core, immediate);
    scene.fog.color.setHex(activeTheme.fog);

    if (window.gsap && !immediate) {
      gsap.fromTo(world.scale,
        { x: 0.7, y: 0.7, z: 0.7 },
        { x: 1, y: 1, z: 1, duration: 1.4, ease: "elastic.out(1, 0.65)" }
      );
      gsap.to(world.rotation, {
        y: world.rotation.y + Math.PI * 1.25,
        x: world.rotation.x + Math.PI * 0.18,
        duration: 1.25,
        ease: "power4.inOut"
      });
      gsap.fromTo(camera.position,
        { z: activeTheme.cameraZ - 11 },
        { z: activeTheme.cameraZ, duration: 1.15, ease: "expo.out" }
      );
    }
  }

  function triggerBurst() {
    if (!window.gsap) return;
    gsap.killTweensOf([core.scale, shell.scale, haloGroup.scale, particleGroup.rotation]);
    gsap.timeline()
      .to(core.scale, { x: 1.9, y: 1.9, z: 1.9, duration: 0.18, ease: "power4.out" }, 0)
      .to(shell.scale, { x: 1.45, y: 1.45, z: 1.45, duration: 0.18, ease: "power4.out" }, 0)
      .to(haloGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.22, ease: "power4.out" }, 0)
      .to(particleGroup.rotation, { z: particleGroup.rotation.z + 0.8, duration: 0.7, ease: "power3.out" }, 0)
      .to(core.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: "elastic.out(1, 0.48)" }, 0.18)
      .to(shell.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: "elastic.out(1, 0.55)" }, 0.18)
      .to(haloGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "expo.out" }, 0.18);
  }

  function updateLines(time) {
    let idx = 0;
    const pos = particleGeometry.attributes.position.array;
    const step = Math.max(2, Math.floor(PARTICLE_COUNT / LINE_COUNT));

    for (let i = 0; i < PARTICLE_COUNT && idx < LINE_COUNT * 6; i += step) {
      const j = (i + 17 + Math.floor(time * 3)) % PARTICLE_COUNT;
      linePositions[idx++] = pos[i * 3];
      linePositions[idx++] = pos[i * 3 + 1];
      linePositions[idx++] = pos[i * 3 + 2];
      linePositions[idx++] = pos[j * 3];
      linePositions[idx++] = pos[j * 3 + 1];
      linePositions[idx++] = pos[j * 3 + 2];
    }

    for (let k = idx; k < LINE_COUNT * 6; k++) {
      linePositions[k] = 0;
    }

    lineGeometry.attributes.position.needsUpdate = true;
  }

  function updateCursorReticle() {
    const reticle = cursorGeometry.attributes.position.array;
    const x = pointer.x * 18;
    const y = -pointer.y * 10;
    const z = 1.5;
    const s = 1.8 + pointer.down * 0.7;
    const points = [
      x - s, y, z, x - s * 0.22, y, z,
      x + s * 0.22, y, z, x + s, y, z,
      x, y - s, z, x, y - s * 0.22, z
    ];
    for (let i = 0; i < reticle.length; i++) reticle[i] = points[i] || 0;
    cursorGeometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    const elapsed = clock.getElapsedTime();
    requestAnimationFrame(animate);

    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;
    pointer.down *= 0.92;

    core.rotation.x = elapsed * 0.34 + pointer.y * 0.22;
    core.rotation.y = elapsed * (0.48 + Math.abs(activeTheme.spin)) + pointer.x * 0.28;
    shell.rotation.x += 0.002 + scrollProgress * 0.001;
    shell.rotation.y -= activeTheme.spin * 0.01;

    haloGroup.children.forEach(function (ring, index) {
      ring.rotation.z += ring.userData.speed * 0.008;
      ring.rotation.y = pointer.x * 0.15 + index * 0.18 + scrollProgress * 0.8;
    });

    shardData.forEach(function (item, index) {
      const angle = item.angle + elapsed * item.speed * (index % 2 ? -1 : 1);
      const pulse = 1 + Math.sin(elapsed * 1.8 + index) * 0.12;
      shardObject.position.set(
        Math.cos(angle) * item.radius,
        item.y + Math.sin(angle * 1.7 + elapsed) * 2.8,
        item.z + Math.sin(angle) * item.radius * 0.18
      );
      shardObject.rotation.set(angle * 0.4, angle + elapsed * 0.2, angle * 0.9);
      shardObject.scale.set(1, 1, item.scale * pulse);
      shardObject.updateMatrix();
      shardMatrix.copy(shardObject.matrix);
      shards.setMatrixAt(index, shardMatrix);
    });
    shards.instanceMatrix.needsUpdate = true;

    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const offset = i * 3;
      pos[offset] += Math.sin(elapsed * 0.25 + particleSeeds[i]) * 0.003;
      pos[offset + 1] += Math.cos(elapsed * 0.32 + particleSeeds[i]) * 0.004;
      pos[offset + 2] += 0.018 + Math.sin(elapsed + i) * 0.002;
      if (pos[offset + 2] > 42) pos[offset + 2] = -42;
    }
    particleGeometry.attributes.position.needsUpdate = true;
    updateLines(elapsed);
    updateCursorReticle();

    world.rotation.y += activeTheme.spin * 0.006;
    world.rotation.x += (pointer.y * 0.18 + scrollProgress * 0.3 - world.rotation.x) * 0.015;
    particleGroup.rotation.y = elapsed * 0.025 + pointer.x * 0.18;
    particleGroup.rotation.x = -pointer.y * 0.08;

    camera.position.x += (pointer.x * 4.8 - camera.position.x) * 0.045;
    camera.position.y += (-pointer.y * 3.2 - camera.position.y) * 0.045;
    camera.position.z += (activeTheme.cameraZ - scrollProgress * 7 - pointer.down * 4 - camera.position.z) * 0.045;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function handlePointer(event) {
    pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  document.addEventListener("pointermove", handlePointer, { passive: true });
  document.addEventListener("pointerdown", function () {
    pointer.down = 1;
    triggerBurst();
  }, { passive: true });

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.change3DTheme = function (userId) {
    applyTheme(userId, false);
    triggerBurst();
  };
  window.triggerAgBurst = triggerBurst;

  ns.threeBg = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    world: world,
    applyTheme: applyTheme,
    triggerBurst: triggerBurst
  };

  applyTheme(window.resumeCandidateId || "duke", true);
  animate();
})();
