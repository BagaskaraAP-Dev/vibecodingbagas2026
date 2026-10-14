// 2D Pixel Art & Retro Isometric Studio Engine for MOONCRUST // PIXEL AI STUDIO
// Interactive Canvas simulator with 5 Specialist Sub-Agents

class PixelStudioEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Simulation state
    this.frameTick = 0;
    this.isRunning = true;
    this.speed = 1;
    this.selectedAgentId = 'daily'; // Default to the new Daily bot or uiux

    // Visual FX pools
    this.steamParticles = [];
    this.stars = [];
    this.waypoints = [];
    this.initStars();

    // 5 Specialized Workstations
    this.stations = {
      uiux: { x: 120, y: 220, name: 'UI/UX Design Station', icon: '🎨' },
      fe: { x: 140, y: 380, name: 'Frontend Dev Rig', icon: '💻' },
      daily: { x: 440, y: 380, name: 'Daily Productivity Hub', icon: '📅' },
      be: { x: 740, y: 220, name: 'Backend & Server Console', icon: '🗄️' },
      sec: { x: 720, y: 380, name: 'SecOps & CTF Radar Lab', icon: '🛡️' },
      coffee: { x: 440, y: 155, name: 'Caffeine Fuel Hub', icon: '☕' },
      whiteboard: { x: 260, y: 155, name: 'Agile Whiteboard', icon: '📋' },
      serverRack: { x: 860, y: 155, name: 'Mainframe Cluster', icon: '🖥️' },
      admin: { x: 330, y: 190, name: 'MOONCRUST Admin Post', icon: '👑' }
    };

    // Initialize 5 Autonomous Specialist Agents
    this.agents = [
      {
        id: 'uiux',
        name: 'UI/UX-Bot',
        role: 'Lead UI/UX Architect',
        desc: 'Specialist in User Flows, Wireframes, Design Tokens & Heuristic Usability.',
        x: this.stations.uiux.x,
        y: this.stations.uiux.y,
        targetX: this.stations.uiux.x,
        targetY: this.stations.uiux.y,
        state: 'WORKING',
        dir: 1,
        stationId: 'uiux',
        isSelected: false,
        stats: { tasksCompleted: 42, efficiency: '99.4%', focus: 'Design Tokens', status: 'Active' },
        bubble: { text: 'Crafting design tokens...', timer: 120 },
        nextActionTick: 180
      },
      {
        id: 'fe',
        name: 'FE-Bot',
        role: 'Frontend Engineer',
        desc: 'Specialist in HTML5/CSS3/Tailwind, Responsive Layouts & Interactive Animation.',
        x: this.stations.fe.x,
        y: this.stations.fe.y,
        targetX: this.stations.fe.x,
        targetY: this.stations.fe.y,
        state: 'WORKING',
        dir: 1,
        stationId: 'fe',
        isSelected: false,
        stats: { tasksCompleted: 58, efficiency: '98.8%', focus: 'Interactive UI', status: 'Active' },
        bubble: { text: 'Compiling Tailwind CSS...', timer: 140 },
        nextActionTick: 240
      },
      {
        id: 'daily',
        name: 'DAILY-Bot',
        role: 'Daily Productivity Specialist',
        desc: 'Asisten Aktivitas Harian: To-Do List, Manajemen Jadwal Kuliah/Kerja, Pomodoro Timer & Habit Tracker.',
        x: this.stations.daily.x,
        y: this.stations.daily.y,
        targetX: this.stations.daily.x,
        targetY: this.stations.daily.y,
        state: 'WORKING',
        dir: 1,
        stationId: 'daily',
        isSelected: true,
        stats: { tasksCompleted: 85, efficiency: '99.8%', focus: 'Daily Routine & Focus', status: 'Active' },
        bubble: { text: 'Menata jadwal fokus hari ini 📅', timer: 140 },
        nextActionTick: 160
      },
      {
        id: 'be',
        name: 'BE-Bot',
        role: 'Backend Architect',
        desc: 'Specialist in SQL/NoSQL Schema, REST APIs, Algorithmic Logic & Auth.',
        x: this.stations.be.x,
        y: this.stations.be.y,
        targetX: this.stations.be.x,
        targetY: this.stations.be.y,
        state: 'WORKING',
        dir: -1,
        stationId: 'be',
        isSelected: false,
        stats: { tasksCompleted: 64, efficiency: '99.9%', focus: 'REST API & Schema', status: 'Active' },
        bubble: { text: 'Optimizing SQL indexes...', timer: 100 },
        nextActionTick: 200
      },
      {
        id: 'sec',
        name: 'SEC-Bot',
        role: 'SecOps & CTF Solver',
        desc: 'Specialist in OWASP Top 10, Web Pentest, CTF Cryptography & Reverse Eng.',
        x: this.stations.sec.x,
        y: this.stations.sec.y,
        targetX: this.stations.sec.x,
        targetY: this.stations.sec.y,
        state: 'WORKING',
        dir: -1,
        stationId: 'sec',
        isSelected: false,
        stats: { tasksCompleted: 39, efficiency: '100%', focus: 'OWASP Pentest', status: 'Active' },
        bubble: { text: 'Scanning for SQLi & XSS...', timer: 160 },
        nextActionTick: 260
      },
      {
        id: 'admin',
        name: 'ADMIN',
        role: 'MOONCRUST Studio Admin',
        desc: 'Mengawasi kelima agen dari pos MOONCRUST. Tidak berpindah tempat.',
        x: this.stations.admin.x,
        y: this.stations.admin.y,
        targetX: this.stations.admin.x,
        targetY: this.stations.admin.y,
        state: 'IDLE',
        dir: 1,
        stationId: 'admin',
        fixed: true,
        isSelected: false,
        bubble: { text: 'Admin standby. Semua agen fokus kerja ✅', timer: 300 },
        nextActionTick: 900
      }
    ];

    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      this.stars.push({
        x: 350 + Math.random() * 260,
        y: 20 + Math.random() * 70,
        size: Math.random() > 0.8 ? 2 : 1,
        twinkleOffset: Math.random() * 100
      });
    }
  }

  loop() {
    if (this.isRunning) {
      for (let s = 0; s < this.speed; s++) {
        this.update();
      }
      this.render();
    }
    requestAnimationFrame(this.loop);
  }

  update() {
    this.frameTick++;

    if (this.frameTick % 6 === 0) {
      this.steamParticles.push({
        x: this.stations.coffee.x + 18 + (Math.random() * 6 - 3),
        y: this.stations.coffee.y + 4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.6 - Math.random() * 0.4,
        alpha: 0.8,
        life: 0
      });
    }

    for (let i = this.steamParticles.length - 1; i >= 0; i--) {
      const p = this.steamParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha -= 0.015;
      if (p.alpha <= 0 || p.life > 50) {
        this.steamParticles.splice(i, 1);
      }
    }

    for (let i = this.waypoints.length - 1; i >= 0; i--) {
      const wp = this.waypoints[i];
      wp.life--;
      wp.radius += 0.8;
      if (wp.life <= 0) {
        this.waypoints.splice(i, 1);
      }
    }

    this.agents.forEach(agent => {
      if (agent.bubble) {
        agent.bubble.timer--;
        if (agent.bubble.timer <= 0) {
          agent.bubble = null;
        }
      }

      const dx = agent.targetX - agent.x;
      const dy = agent.targetY - agent.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        agent.state = 'WALKING';
        agent.dir = dx >= 0 ? 1 : -1;
        const moveSpeed = 1.8;
        agent.x += (dx / dist) * moveSpeed;
        agent.y += (dy / dist) * moveSpeed;
      } else {
        agent.x = agent.targetX;
        agent.y = agent.targetY;
        if (agent.state === 'WALKING') {
          const homeStation = this.stations[agent.stationId];
          if (Math.hypot(agent.x - homeStation.x, agent.y - homeStation.y) < 8) {
            agent.state = 'WORKING';
          } else {
            agent.state = 'IDLE';
          }
        }
      }

      if (!window.pipelineEngine || !window.pipelineEngine.isActive) {
        if (this.frameTick >= agent.nextActionTick) {
          this.decideNextAutonomousAction(agent);
        }
      }
    });
  }

  decideNextAutonomousAction(agent) {
    // ~10-15s between bubbles at 60fps so the room stays calm and readable
    agent.nextActionTick = this.frameTick + 600 + Math.floor(Math.random() * 300);

    if (agent.fixed) {
      agent.nextActionTick = this.frameTick + 1000 + Math.floor(Math.random() * 400);
      const adminLines = [
        'Semua agen fokus kerja ✅',
        'Monitoring 5 workstation...',
        'Tidak ada yang keluyuran, mantap 👍',
        'Butuh sesuatu? Chat DAILY-Bot di bawah.',
        'Cek monitor: 5/5 workstation online 🖥️'
      ];
      this.triggerAgentBubble(agent.id, adminLines[Math.floor(Math.random() * adminLines.length)], 300);
      return;
    }

    // Agents stay at their own desk; if a user command moved them away, they walk back on their own.
    const homeStation = this.stations[agent.stationId];
    const isAtHome = Math.hypot(agent.x - homeStation.x, agent.y - homeStation.y) < 10;

    if (!isAtHome) {
      agent.targetX = homeStation.x;
      agent.targetY = homeStation.y;
      this.triggerAgentBubble(agent.id, 'Kembali ke meja, lanjut kerja!', 100);
      return;
    }

    const workThoughts = {
      uiux: ['Figma tokens synced!', 'Cek kontras WCAG AA...', 'Merapikan touch target mobile'],
      fe: ['Flexbox rapi sempurna', 'Menambahkan transisi CSS halus', 'Optimasi render DOM'],
      daily: ['Sesi Pomodoro berjalan lancar ⏱️', 'Prioritas: Vibe coding & Kuliah', 'Jadwal harian tertata rapi!'],
      be: ['Query database selesai: 1.4ms', 'REST API response 200 OK', 'JWT bearer token diperbarui'],
      sec: ['Checklist OWASP Top 10: CLEAR', 'Header keamanan aktif', 'Sanitasi input aktif']
    };
    const quote = workThoughts[agent.id][Math.floor(Math.random() * workThoughts[agent.id].length)];
    this.triggerAgentBubble(agent.id, quote, 240);
  }

  triggerAgentBubble(agentId, text, duration = 120) {
    const agent = this.agents.find(a => a.id === agentId);
    if (agent) {
      agent.bubble = { text, timer: duration };
      if (window.studioAudio) {
        window.studioAudio.playBlip();
      }
    }
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    if (window.studioAudio) window.studioAudio.init();

    let agentFound = false;
    this.agents.forEach(agent => {
      const dist = Math.hypot(clickX - (agent.x + 24), clickY - (agent.y + 26));
      if (dist < 36) {
        this.selectAgent(agent.id);
        agentFound = true;
      }
    });

    if (agentFound) return;

    let stationFound = false;
    for (const [key, station] of Object.entries(this.stations)) {
      const dist = Math.hypot(clickX - station.x, clickY - station.y);
      if (dist < 42) {
        stationFound = true;
        this.showStationInfo(key);

        if (this.selectedAgentId) {
          const selected = this.agents.find(a => a.id === this.selectedAgentId);
          if (selected && !selected.fixed) {
            selected.targetX = station.x;
            selected.targetY = station.y + (key === 'coffee' || key === 'whiteboard' ? 20 : 0);
            this.triggerAgentBubble(selected.id, `Menuju ke ${station.name}!`, 120);
            this.logTerminal(`[User Command] Mengirim [${selected.name}] ke ${station.name}.`);
          }
        }
        break;
      }
    }

    if (stationFound) return;

    if (clickY > 154 && this.selectedAgentId) {
      const selected = this.agents.find(a => a.id === this.selectedAgentId);
      if (selected && !selected.fixed) {
        selected.targetX = Math.round(clickX - 24);
        selected.targetY = Math.round(clickY - 26);
        this.waypoints.push({ x: clickX, y: clickY, radius: 4, life: 25, color: '#00f3ff' });
        this.triggerAgentBubble(selected.id, 'Siap, melangkah ke titik tujuan! 📍', 100);
        if (window.studioAudio) window.studioAudio.playKey();
        this.logTerminal(`[User Command] Mengarahkan [${selected.name}] ke (${Math.round(clickX)}, ${Math.round(clickY)}).`);
      }
    }
  }

  selectAgent(agentId) {
    this.selectedAgentId = agentId;
    this.agents.forEach(a => a.isSelected = (a.id === agentId));
    const agent = this.agents.find(a => a.id === agentId);

    if (agent) {
      if (window.studioAudio) window.studioAudio.playKey();
      const greetings = {
        uiux: 'UI/UX-Bot siap! Mau dirancang wireframe atau design system apa?',
        fe: 'FE-Bot online! Komponen HTML5 & Tailwind siap dirakit.',
        daily: 'DAILY-Bot hadir! Yuk susun to-do list, jadwal kuliah, atau mulai Pomodoro focus timer!',
        be: 'BE-Bot aktif! Skema SQL, REST API & auth siap dieksekusi.',
        sec: 'SEC-Bot siaga! Siap audit celah OWASP & uji tantangan CTF.',
        admin: 'Admin MOONCRUST di sini. Semua agen sedang fokus kerja.'
      };
      this.triggerAgentBubble(agent.id, greetings[agent.id] || 'Agen siap bekerja!', 140);
      this.logTerminal(`[Select] [${agent.name}] dipilih. Role aktif.`);

      if (window.updateInspectorCard) {
        window.updateInspectorCard(agent);
      }
    }
  }

  commandSelectedAgent(action) {
    if (!this.selectedAgentId) return;
    const agent = this.agents.find(a => a.id === this.selectedAgentId);
    if (!agent) return;
    if (agent.fixed) {
      this.triggerAgentBubble(agent.id, 'Admin tetap berjaga di pos MOONCRUST.', 120);
      return;
    }

    if (action === 'work') {
      const home = this.stations[agent.stationId];
      agent.targetX = home.x;
      agent.targetY = home.y;
      agent.state = 'WORKING';
      this.triggerAgentBubble(agent.id, 'Fokus penuh: kembali bekerja di workstation! 💻', 130);
      this.logTerminal(`[User Command] [${agent.name}] kembali bekerja di ${home.name}.`);
    } else if (action === 'coffee') {
      agent.targetX = this.stations.coffee.x;
      agent.targetY = this.stations.coffee.y + 20;
      this.triggerAgentBubble(agent.id, 'Menuju mesin espresso untuk isi energi ☕', 130);
      this.logTerminal(`[User Command] [${agent.name}] diperintahkan mengambil kopi.`);
    } else if (action === 'whiteboard') {
      agent.targetX = this.stations.whiteboard.x;
      agent.targetY = this.stations.whiteboard.y + 25;
      this.triggerAgentBubble(agent.id, 'Meneliti tugas di papan tulis proyek 📋', 130);
      this.logTerminal(`[User Command] [${agent.name}] dikirim ke Whiteboard.`);
    } else if (action === 'server') {
      agent.targetX = this.stations.serverRack.x - 20;
      agent.targetY = this.stations.serverRack.y + 20;
      this.triggerAgentBubble(agent.id, 'Memeriksa kluster server mainframe 🖥️', 130);
      this.logTerminal(`[User Command] [${agent.name}] memeriksa rak server.`);
    } else if (action === 'chat') {
      const thoughts = [
        'Semua arsitektur siap diuji coba secara riil!',
        'Gunakan tab per role jika kamu ingin fokus ngerjain modul sendiri!',
        'DAILY-Bot siap bantu kamu menata to-do harian dan timer Pomodoro.'
      ];
      const t = thoughts[Math.floor(Math.random() * thoughts.length)];
      this.triggerAgentBubble(agent.id, t, 140);
      this.logTerminal(`[Status Query] [${agent.name}]: "${t}"`);
    }
    if (window.studioAudio) window.studioAudio.playKey();
  }

  showStationInfo(stationKey) {
    const s = this.stations[stationKey];
    if (!s) return;
    const tips = {
      coffee: 'Caffeine Fuel Hub: Tempat ngopi santai agen sebelum sprint intensif.',
      whiteboard: 'Agile Whiteboard: Papan pemetaan to-do, arsitektur, dan sprint roadmap.',
      serverRack: 'Mainframe Cluster: 8 server blade redundan, pendingin aktif, uptime 99.99%.',
      uiux: 'Meja UI/UX: Dilengkapi Drawing Tablet layar sentuh, palet warna, dan wireframe mockup.',
      fe: 'Rig Frontend: Dual monitor 4K, keyboard mekanikal RGB, preview live layout.',
      daily: 'Hub Produktivitas Harian: Kalender digital, to-do notepad, checklist kebiasaan, dan jam Pomodoro.',
      be: 'Konsol Backend: Terminal Linux, monitor skema ERD PostgreSQL, dan pipeline API.',
      sec: 'Lab SecOps: Radar aktif 360°, monitor matrix hijau, shield verifikasi celah OWASP.',
      admin: 'Pos Admin MOONCRUST: memantau semua workstation dari bawah papan neon.'
    };
    const tipText = tips[stationKey] || s.name;
    const banner = document.getElementById('liveStatusTicker');
    if (banner) {
      const tag = document.createElement('span');
      tag.style.color = '#00f3ff';
      tag.textContent = '[STASIUN]';
      banner.replaceChildren(tag, ` ${tipText}`);
    }
  }

  logTerminal(msg) {
    const logBody = document.getElementById('terminalLogBody');
    if (logBody) {
      const time = new Date().toLocaleTimeString();
      const div = document.createElement('div');
      div.className = 'terminal-log-row';
      const timeEl = document.createElement('span');
      timeEl.className = 'log-time';
      timeEl.textContent = `[${time}]`;
      const msgEl = document.createElement('span');
      msgEl.className = 'log-content';
      msgEl.textContent = msg;
      div.append(timeEl, ' ', msgEl);
      logBody.appendChild(div);
      logBody.scrollTop = logBody.scrollHeight;
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.renderBackWall(ctx);
    this.renderObservationWindow(ctx);
    this.renderNeonSign(ctx);
    this.renderCheckeredFloor(ctx);
    this.renderWhiteboard(ctx);
    this.renderServerRack(ctx);
    this.renderCoffeeCorner(ctx);
    this.renderPixelPlants(ctx);
    this.renderWorkstations(ctx);
    this.renderWaypoints(ctx);

    const sortedAgents = [...this.agents].sort((a, b) => a.y - b.y);
    sortedAgents.forEach(agent => {
      window.pixelSprites.drawAgent(ctx, agent, this.frameTick);
    });

    this.renderCoffeeSteam(ctx);
    this.renderVignette(ctx);
  }

  renderBackWall(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 150);
    grad.addColorStop(0, '#0a0d18');
    grad.addColorStop(1, '#151928');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, 150);

    ctx.strokeStyle = '#1e2538';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 150);
      ctx.stroke();
    }
    ctx.fillStyle = '#0f1422';
    ctx.fillRect(0, 146, this.width, 8);
    ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.fillRect(0, 152, this.width, 2);
  }

  renderObservationWindow(ctx) {
    const winX = 340;
    const winY = 18;
    const winW = 280;
    const winH = 95;

    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(winX - 4, winY - 4, winW + 8, winH + 8);
    ctx.strokeStyle = '#273553';
    ctx.lineWidth = 3;
    ctx.strokeRect(winX - 4, winY - 4, winW + 8, winH + 8);

    const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
    skyGrad.addColorStop(0, '#02040a');
    skyGrad.addColorStop(1, '#081226');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX, winY, winW, winH);

    this.stars.forEach(s => {
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin((this.frameTick + s.twinkleOffset) * 0.05));
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(winX + 225, winY + 36, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(winX + 220, winY + 32, 4, 0, Math.PI * 2);
    ctx.arc(winX + 230, winY + 40, 3, 0, Math.PI * 2);
    ctx.arc(winX + 225, winY + 45, 2, 0, Math.PI * 2);
    ctx.fill();

    const satX = winX + ((this.frameTick * 0.4) % (winW + 30)) - 10;
    const satY = winY + 48;
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(satX, satY, 4, 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(satX - 3, satY - 1, 2, 4);
    ctx.fillRect(satX + 5, satY - 1, 2, 4);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.moveTo(winX, winY + winH / 2);
    ctx.lineTo(winX + winW, winY + winH / 2);
    ctx.stroke();
  }

  renderNeonSign(ctx) {
    const text = 'MOONCRUST';
    const x = 480;
    const y = 138;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px "Press Start 2P", monospace';

    const pulse = 0.75 + 0.25 * Math.sin(this.frameTick * 0.08);

    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 18 * pulse;

    ctx.fillStyle = `rgba(0, 243, 255, ${0.4 * pulse})`;
    ctx.fillText(text, x, y);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x, y);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 95, y + 4, 190, 2);

    ctx.restore();
  }

  renderCheckeredFloor(ctx) {
    const startY = 154;
    const tileW = 40;
    const tileH = 24;

    const cols = Math.ceil(this.width / tileW) + 1;
    const rows = Math.ceil((this.height - startY) / tileH) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileW;
        const y = startY + r * tileH;
        const isEven = (r + c) % 2 === 0;

        ctx.fillStyle = isEven ? '#181e2e' : '#1e2638';
        ctx.fillRect(x, y, tileW, tileH);

        ctx.strokeStyle = '#141824';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileW, tileH);

        if (isEven) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(x, y, tileW, 1);
        }
      }
    }

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(30, 180, 420, 330);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.strokeRect(510, 180, 420, 330);
    ctx.setLineDash([]);
  }

  renderWhiteboard(ctx) {
    const wbX = 210;
    const wbY = 70;
    const wbW = 105;
    const wbH = 68;

    ctx.fillStyle = '#334155';
    ctx.fillRect(wbX, wbY, wbW, wbH);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(wbX + 3, wbY + 3, wbW - 6, wbH - 6);

    ctx.fillStyle = '#0f172a';
    ctx.font = '6px monospace';
    ctx.fillText('SPRINT BACKLOG', wbX + 8, wbY + 12);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(wbX + 38, wbY + 16);
    ctx.lineTo(wbX + 38, wbY + wbH - 4);
    ctx.moveTo(wbX + 72, wbY + 16);
    ctx.lineTo(wbX + 72, wbY + wbH - 4);
    ctx.stroke();

    const stickies = [
      { x: wbX + 8, y: wbY + 20, c: '#fef08a' },
      { x: wbX + 20, y: wbY + 32, c: '#fbcfe8' },
      { x: wbX + 42, y: wbY + 22, c: '#bae6fd' },
      { x: wbX + 54, y: wbY + 38, c: '#fed7aa' },
      { x: wbX + 76, y: wbY + 24, c: '#bbf7d0' },
      { x: wbX + 88, y: wbY + 40, c: '#bbf7d0' }
    ];
    stickies.forEach(s => {
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x, s.y, 10, 10);
      ctx.fillStyle = '#334155';
      ctx.fillRect(s.x + 2, s.y + 3, 6, 1);
      ctx.fillRect(s.x + 2, s.y + 6, 4, 1);
    });

    ctx.fillStyle = '#64748b';
    ctx.fillRect(wbX + 10, wbY + wbH, wbW - 20, 3);
  }

  renderServerRack(ctx) {
    const rackX = 810;
    const rackY = 40;
    const rackW = 120;
    const rackH = 104;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(rackX, rackY, rackW, rackH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(rackX, rackY, rackW, rackH);

    for (let u = 0; u < 3; u++) {
      const uX = rackX + 6 + u * 38;
      const uY = rackY + 6;
      const uW = 32;
      const uH = rackH - 12;

      ctx.fillStyle = '#131b2c';
      ctx.fillRect(uX, uY, uW, uH);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(uX, uY, uW, uH);

      ctx.fillStyle = '#0a0f1d';
      for (let s = 0; s < 12; s++) {
        ctx.fillRect(uX + 4, uY + 20 + s * 5, uW - 8, 2);
      }

      const ledColors = ['#10b981', '#00f3ff', '#f59e0b', '#ef4444'];
      for (let l = 0; l < 4; l++) {
        const isBlinking = ((this.frameTick + u * 15 + l * 23) % 40) < 22;
        ctx.fillStyle = isBlinking ? ledColors[l] : '#1f2937';
        ctx.fillRect(uX + 4 + l * 6, uY + 8, 3, 3);
      }
    }

    ctx.strokeStyle = '#7e22ce';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rackX + 20, rackY + rackH);
    ctx.quadraticCurveTo(rackX - 30, rackY + rackH + 40, this.stations.be.x + 30, this.stations.be.y);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rackX + 60, rackY + rackH);
    ctx.quadraticCurveTo(rackX - 10, rackY + rackH + 50, this.stations.be.x + 10, this.stations.be.y);
    ctx.stroke();
  }

  renderCoffeeCorner(ctx) {
    const cX = 420;
    const cY = 120;

    ctx.fillStyle = '#3e2723';
    ctx.fillRect(cX, cY + 16, 50, 20);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(cX - 2, cY + 14, 54, 4);

    ctx.fillStyle = '#475569';
    ctx.fillRect(cX + 12, cY, 26, 16);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cX + 16, cY + 4, 18, 8);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cX + 22, cY + 11, 6, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cX + 23, cY + 15, 4, 1);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cX + 32, cY + 11, 6, 6);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(cX + 33, cY + 12, 4, 2);
  }

  renderCoffeeSteam(ctx) {
    this.steamParticles.forEach(p => {
      ctx.fillStyle = `rgba(240, 249, 255, ${p.alpha})`;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
  }

  renderWaypoints(ctx) {
    this.waypoints.forEach(wp => {
      ctx.save();
      ctx.strokeStyle = wp.color || '#00f3ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, wp.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';
      ctx.fill();
      ctx.restore();
    });
  }

  renderPixelPlants(ctx) {
    this.drawPlant(ctx, 30, 150);
    this.drawPlant(ctx, 650, 150);
    this.drawPlant(ctx, 470, 480);
  }

  drawPlant(ctx, x, y) {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x + 4, y + 16, 16, 14);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + 2, y + 14, 20, 3);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 5, y + 15, 14, 2);

    ctx.fillStyle = '#15803d';
    ctx.fillRect(x + 2, y + 4, 8, 8);
    ctx.fillRect(x + 14, y + 2, 8, 9);
    ctx.fillRect(x + 8, y - 2, 8, 10);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 4, y + 6, 4, 4);
    ctx.fillRect(x + 16, y + 4, 4, 4);
    ctx.fillRect(x + 10, y, 4, 4);
  }

  renderWorkstations(ctx) {
    // 1. UI/UX Workstation (Top-Left)
    this.drawUIUXStation(ctx, this.stations.uiux.x - 30, this.stations.uiux.y - 30);
    // 2. FE Workstation (Bottom-Left)
    this.drawFEStation(ctx, this.stations.fe.x - 30, this.stations.fe.y - 30);
    // 3. DAILY Workstation (Bottom-Center)
    this.drawDAILYStation(ctx, this.stations.daily.x - 35, this.stations.daily.y - 30);
    // 4. BE Workstation (Top-Right)
    this.drawBEStation(ctx, this.stations.be.x - 40, this.stations.be.y - 30);
    // 5. SEC Workstation (Bottom-Right)
    this.drawSECStation(ctx, this.stations.sec.x - 40, this.stations.sec.y - 30);
    // 6. Admin post under the MOONCRUST sign
    this.drawAdminPost(ctx, this.stations.admin.x);
  }

  drawAdminPost(ctx, x) {
    // Wall-mounted monitoring screen above the admin, between the whiteboard and the MOONCRUST sign
    const mx = x - 6;
    const my = 116;
    ctx.fillStyle = '#334155';
    ctx.fillRect(mx + 27, my + 28, 6, 8); // wall bracket
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mx, my, 60, 30);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(mx + 0.5, my + 0.5, 59, 29);
    // one status light per workstation, slow scan line
    this.agents.filter(a => !a.fixed).forEach((a, i) => {
      ctx.fillStyle = window.pixelSprites.getPalette(a.id).primary;
      ctx.fillRect(mx + 6 + i * 10, my + 8, 6, 6);
    });
    ctx.fillStyle = 'rgba(0, 243, 255, 0.35)';
    ctx.fillRect(mx + 3, my + 18 + (Math.floor(this.frameTick / 20) % 8), 54, 1);
  }


  drawUIUXStation(ctx, x, y) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 110, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 110, 4);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(x, y + 22, 110, 2);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 98, y + 62, 6, 26);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 14, y + 28, 30, 20);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(x + 17, y + 31, 24, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 19, y + 33, 9, 4);
    ctx.fillRect(x + 19, y + 39, 14, 3);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 52, y - 8, 48, 30);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 55, y - 5, 42, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 58, y - 2, 36, 4);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 58, y + 5, 16, 11);
    ctx.fillRect(x + 77, y + 5, 17, 11);

    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 72, y + 22, 8, 4);

    const swatches = ['#00f3ff', '#3b82f6', '#a855f7', '#ef4444'];
    swatches.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(x + 52 + i * 7, y + 34, 5, 5);
    });
  }

  drawFEStation(ctx, x, y) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 115, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 115, 4);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x, y + 22, 115, 2);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 103, y + 62, 6, 26);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 12, y - 10, 42, 28);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 14, y - 8, 38, 24);
    const codeColors = ['#f43f5e', '#38bdf8', '#4ade80', '#fbbf24', '#c084fc'];
    for (let l = 0; l < 5; l++) {
      ctx.fillStyle = codeColors[(l + Math.floor(this.frameTick / 20)) % codeColors.length];
      ctx.fillRect(x + 17, y - 5 + l * 4, 18 + (l % 3) * 6, 2);
    }

    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 58, y - 10, 42, 28);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 60, y - 8, 38, 24);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 62, y - 5, 34, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 64, y + 3, 12, 6);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + 80, y + 4, 12, 4);

    const rgbHue = (this.frameTick * 2) % 360;
    ctx.fillStyle = `hsl(${rgbHue}, 80%, 60%)`;
    ctx.fillRect(x + 36, y + 30, 36, 12);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 38, y + 32, 32, 8);

    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 78, y + 32, 14, 10);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 83, y + 34, 4, 6);
  }

  // DAILY Productivity Station: Calendar flip clock, planner notepad, warm desk lamp
  drawDAILYStation(ctx, x, y) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 110, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 110, 4);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x, y + 22, 110, 2); // Emerald LED trim

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 98, y + 62, 6, 26);

    // Desktop Digital Calendar & Clock
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 12, y - 8, 38, 26);
    ctx.fillStyle = '#022c22';
    ctx.fillRect(x + 14, y - 6, 34, 22);
    // Digital clock text / date
    ctx.fillStyle = '#34d399';
    ctx.fillRect(x + 18, y - 2, 12, 4); // HH:MM
    ctx.fillRect(x + 34, y - 2, 10, 4);
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(x + 18, y + 6, 26, 3); // "DAILY OK"

    // To-Do Notepad with checkboxes
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + 58, y + 26, 24, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + 60, y + 28, 20, 1);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + 61, y + 31, 3, 3); // Checked box
    ctx.fillRect(x + 61, y + 36, 3, 3);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 66, y + 32, 12, 2);
    ctx.fillRect(x + 66, y + 37, 10, 2);

    // Warm Desk Lamp
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 88, y + 16, 4, 16);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 84, y + 12, 12, 5);
    // Warm light cone on desk
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.beginPath();
    ctx.moveTo(x + 84, y + 17);
    ctx.lineTo(x + 72, y + 42);
    ctx.lineTo(x + 104, y + 42);
    ctx.closePath();
    ctx.fill();
  }

  drawBEStation(ctx, x, y) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 115, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 115, 4);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(x, y + 22, 115, 2);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 103, y + 62, 6, 26);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 20, y - 10, 50, 30);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x + 22, y - 8, 46, 26);

    ctx.fillStyle = '#a855f7';
    ctx.fillRect(x + 26, y - 4, 16, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 48, y + 2, 16, 10);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 42, y);
    ctx.lineTo(x + 48, y + 6);
    ctx.stroke();

    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 74, y - 6, 32, 24);
    ctx.fillStyle = '#052e16';
    ctx.fillRect(x + 76, y - 4, 28, 20);
    ctx.fillStyle = '#4ade80';
    for (let l = 0; l < 4; l++) {
      ctx.fillRect(x + 78, y - 2 + l * 4, 18 + (l % 2) * 5, 2);
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 30, y + 30, 36, 10);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(x + 76, y + 32, 10, 6);
  }

  drawSECStation(ctx, x, y) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 115, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 115, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x, y + 22, 115, 2);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 103, y + 62, 6, 26);

    const radarCX = x + 34;
    const radarCY = y + 2;
    const radarR = 14;

    ctx.fillStyle = '#022c22';
    ctx.beginPath();
    ctx.arc(radarCX, radarCY, radarR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(radarCX, radarCY, radarR * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    const radarAngle = (this.frameTick * 0.06) % (Math.PI * 2);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(radarCX, radarCY);
    ctx.lineTo(radarCX + Math.cos(radarAngle) * radarR, radarCY + Math.sin(radarAngle) * radarR);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(radarCX + 6, radarCY - 5, 2, 2);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 58, y - 10, 48, 28);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 60, y - 8, 44, 24);

    ctx.fillStyle = '#22c55e';
    for (let c = 0; c < 6; c++) {
      const dropY = ((this.frameTick * 2 + c * 7) % 20);
      ctx.fillRect(x + 63 + c * 7, y - 6 + dropY, 3, 2);
    }

    const shieldBob = Math.sin(this.frameTick * 0.1) * 3;
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
    ctx.beginPath();
    ctx.arc(x + 88, y + 32 + shieldBob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 86, y + 30 + shieldBob, 4, 4);
    ctx.restore();
  }

  renderVignette(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < this.height; y += 4) {
      ctx.fillRect(0, y, this.width, 1);
    }

    const vGrad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.height * 0.45,
      this.width / 2, this.height / 2, this.width * 0.65
    );
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.pixelStudio = new PixelStudioEngine('studioCanvas');
});
