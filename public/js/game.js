// Three.js 3D Cyber Realm Game Engine
class VibeGame3D {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    
    // Game States
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.crystalsCount = 0;
    this.health = 100;
    this.timeLeft = 60;
    this.timerInterval = null;

    // Movement & Physics
    this.keys = { forward: false, backward: false, left: false, right: false };
    this.speed = 0;
    this.maxSpeed = 0.45;
    this.acceleration = 0.02;
    this.friction = 0.94;
    this.turnSpeed = 0.045;
    this.rotationY = 0;

    // Entities
    this.crystals = [];
    this.hazards = [];
    this.particles = [];

    this.init();
  }

  init() {
    if (!this.container) return;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b14);
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.022);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 7, 12);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x223355, 1.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);

    // 5. Build Arena Environment
    this.buildArena();

    // 6. Build Player Model
    this.buildPlayer();

    // 7. Spawn Collectibles & Hazards
    this.spawnEntities();

    // 8. Event Listeners
    this.setupControls();
    window.addEventListener('resize', () => this.onWindowResize());

    // 9. Start Animation Loop
    this.animate();
  }

  buildArena() {
    // Grid Ground
    const gridHelper = new THREE.GridHelper(100, 50, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);

    // Floor Plane
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    this.scene.add(floor);

    // Cyber Pillars around the perimeter
    const pillarGeo = new THREE.BoxGeometry(2, 12, 2);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x111c33,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.35
    });

    const boundary = 45;
    for (let x = -boundary; x <= boundary; x += 15) {
      for (let z of [-boundary, boundary]) {
        const p = new THREE.Mesh(pillarGeo, pillarMat);
        p.position.set(x, 6, z);
        this.scene.add(p);
      }
    }
    for (let z = -boundary; z <= boundary; z += 15) {
      for (let x of [-boundary, boundary]) {
        const p = new THREE.Mesh(pillarGeo, pillarMat);
        p.position.set(x, 6, z);
        this.scene.add(p);
      }
    }
  }

  buildPlayer() {
    this.playerGroup = new THREE.Group();

    // Main Body (Cyber Rover)
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.6, 2.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    this.playerGroup.add(body);

    // Neon Cockpit
    const cockpitGeo = new THREE.BoxGeometry(1.0, 0.5, 1.2);
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.9, -0.2);
    this.playerGroup.add(cockpit);

    // Front Neon Headlight
    const light = new THREE.PointLight(0x38bdf8, 2.5, 15);
    light.position.set(0, 0.6, -1.3);
    this.playerGroup.add(light);

    // Thruster Glow (Back)
    const thrusterGeo = new THREE.BoxGeometry(1.2, 0.2, 0.2);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 1.0
    });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.position.set(0, 0.5, 1.22);
    this.playerGroup.add(thruster);

    this.playerGroup.position.set(0, 0, 0);
    this.scene.add(this.playerGroup);
  }

  spawnEntities() {
    // Clean old
    this.crystals.forEach(c => this.scene.remove(c.mesh));
    this.hazards.forEach(h => this.scene.remove(h.mesh));
    this.crystals = [];
    this.hazards = [];

    // Spawn 15 Neon Crystals
    const crystalGeo = new THREE.OctahedronGeometry(0.7, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.9,
      metalness: 0.1,
      roughness: 0.1
    });

    for (let i = 0; i < 16; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const x = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 70;
      crystal.position.set(x, 1.0, z);
      this.scene.add(crystal);
      this.crystals.push({ mesh: crystal, baseY: 1.0, offset: Math.random() * Math.PI * 2 });
    }

    // Spawn 8 Moving Glitch Hazards
    const hazardGeo = new THREE.DodecahedronGeometry(0.9, 0);
    const hazardMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.8
    });

    for (let i = 0; i < 8; i++) {
      const hazard = new THREE.Mesh(hazardGeo, hazardMat);
      const x = (Math.random() - 0.5) * 65;
      const z = (Math.random() - 0.5) * 65;
      hazard.position.set(x, 1.0, z);
      this.scene.add(hazard);
      this.hazards.push({
        mesh: hazard,
        dirX: (Math.random() - 0.5) * 0.12,
        dirZ: (Math.random() - 0.5) * 0.12
      });
    }
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.forward = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.backward = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.forward = false;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.backward = false;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = false;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = false;
    });

    // Mobile Virtual Touch Buttons
    const btnUp = document.getElementById('btn-touch-up');
    const btnDown = document.getElementById('btn-touch-down');
    const btnLeft = document.getElementById('btn-touch-left');
    const btnRight = document.getElementById('btn-touch-right');

    const bindTouch = (elem, key) => {
      if (!elem) return;
      const start = (e) => { e.preventDefault(); this.keys[key] = true; };
      const end = (e) => { e.preventDefault(); this.keys[key] = false; };
      elem.addEventListener('touchstart', start);
      elem.addEventListener('touchend', end);
      elem.addEventListener('mousedown', start);
      elem.addEventListener('mouseup', end);
    };

    bindTouch(btnUp, 'forward');
    bindTouch(btnDown, 'backward');
    bindTouch(btnLeft, 'left');
    bindTouch(btnRight, 'right');
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.score = 0;
    this.crystalsCount = 0;
    this.health = 100;
    this.timeLeft = 60;
    this.speed = 0;
    this.rotationY = 0;
    this.playerGroup.position.set(0, 0, 0);

    this.spawnEntities();
    this.updateHUD();

    if (window.soundSynth) window.soundSynth.playGameStartSound();

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isRunning || this.isPaused) return;
      this.timeLeft--;
      this.updateHUD();
      if (this.timeLeft <= 0) {
        this.gameOver('Waktu Habis! Misi Selesai.');
      }
    }, 1000);
  }

  gameOver(reason) {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    if (window.soundSynth) window.soundSynth.playGameOverSound();

    if (window.onGameFinished) {
      window.onGameFinished({
        score: this.score,
        crystals: this.crystalsCount,
        reason: reason
      });
    }
  }

  updateHUD() {
    const elScore = document.getElementById('hud-score');
    const elCrystals = document.getElementById('hud-crystals');
    const elHealth = document.getElementById('hud-health');
    const elTime = document.getElementById('hud-time');

    if (elScore) elScore.textContent = this.score;
    if (elCrystals) elCrystals.textContent = this.crystalsCount;
    if (elHealth) elHealth.textContent = `${this.health}%`;
    if (elTime) elTime.textContent = `${this.timeLeft}s`;
  }

  createBurst(x, y, z, colorHex) {
    const pGeo = new THREE.BufferGeometry();
    const count = 16;
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      velocities.push({
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.25 + 0.1,
        vz: (Math.random() - 0.5) * 0.3
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.35,
      transparent: true,
      opacity: 1.0
    });

    const pSystem = new THREE.Points(pGeo, pMat);
    this.scene.add(pSystem);
    this.particles.push({ system: pSystem, velocities, life: 1.0 });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.003;

    // Entity Animations
    this.crystals.forEach((c) => {
      c.mesh.rotation.y += 0.03;
      c.mesh.position.y = c.baseY + Math.sin(time + c.offset) * 0.25;
    });

    this.hazards.forEach((h) => {
      h.mesh.rotation.x += 0.02;
      h.mesh.rotation.y += 0.03;
      h.mesh.position.x += h.dirX;
      h.mesh.position.z += h.dirZ;

      if (Math.abs(h.mesh.position.x) > 38) h.dirX *= -1;
      if (Math.abs(h.mesh.position.z) > 38) h.dirZ *= -1;
    });

    // Particle lifecycle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= 0.03;
      const pos = p.system.geometry.attributes.position.array;
      for (let j = 0; j < p.velocities.length; j++) {
        pos[j * 3] += p.velocities[j].vx;
        pos[j * 3 + 1] += p.velocities[j].vy;
        pos[j * 3 + 2] += p.velocities[j].vz;
      }
      p.system.geometry.attributes.position.needsUpdate = true;
      p.system.material.opacity = p.life;

      if (p.life <= 0) {
        this.scene.remove(p.system);
        this.particles.splice(i, 1);
      }
    }

    // Player Physics & Movement
    if (this.isRunning && !this.isPaused) {
      if (this.keys.forward) this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
      else if (this.keys.backward) this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed * 0.5);
      else this.speed *= this.friction;

      if (this.keys.left) this.rotationY += this.turnSpeed;
      if (this.keys.right) this.rotationY -= this.turnSpeed;

      this.playerGroup.rotation.y = this.rotationY;

      // Forward vector
      const dx = -Math.sin(this.rotationY) * this.speed;
      const dz = -Math.cos(this.rotationY) * this.speed;

      this.playerGroup.position.x += dx;
      this.playerGroup.position.z += dz;

      // Arena boundaries clamp
      this.playerGroup.position.x = Math.max(-42, Math.min(42, this.playerGroup.position.x));
      this.playerGroup.position.z = Math.max(-42, Math.min(42, this.playerGroup.position.z));

      // Collisions with Crystals
      const playerPos = this.playerGroup.position;
      for (let i = this.crystals.length - 1; i >= 0; i--) {
        const c = this.crystals[i];
        const dist = playerPos.distanceTo(c.mesh.position);
        if (dist < 1.8) {
          // Collect!
          this.score += 150;
          this.crystalsCount += 1;
          this.createBurst(c.mesh.position.x, c.mesh.position.y, c.mesh.position.z, 0x10b981);
          if (window.soundSynth) window.soundSynth.playCrystalSound();

          this.scene.remove(c.mesh);
          this.crystals.splice(i, 1);
          this.updateHUD();

          // Respawn new crystal far away
          const newCrystal = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.7, 0),
            new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.9 })
          );
          newCrystal.position.set((Math.random() - 0.5) * 70, 1.0, (Math.random() - 0.5) * 70);
          this.scene.add(newCrystal);
          this.crystals.push({ mesh: newCrystal, baseY: 1.0, offset: Math.random() * 6 });
        }
      }

      // Collisions with Hazards
      for (let h of this.hazards) {
        const dist = playerPos.distanceTo(h.mesh.position);
        if (dist < 2.0) {
          this.health = Math.max(0, this.health - 1);
          if (window.soundSynth && Math.random() < 0.2) window.soundSynth.playGlitchHitSound();
          this.updateHUD();

          if (this.health <= 0) {
            this.gameOver('Pesawat Rusak Terkena Glitch Hazard!');
            break;
          }
        }
      }
    }

    // Camera follow player
    if (this.playerGroup) {
      const camOffset = new THREE.Vector3(0, 5.5, 9.5);
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerGroup.rotation.y);
      this.camera.position.lerp(this.playerGroup.position.clone().add(camOffset), 0.1);
      this.camera.lookAt(this.playerGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

window.VibeGame3D = VibeGame3D;
