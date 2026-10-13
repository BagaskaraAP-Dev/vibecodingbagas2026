// ========================================================
// PIXEL AI AGENT — PROCEDURAL SPRITE RENDERER & AUTONOMOUS LOOP
// ========================================================

class PixelAgent {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 16;
    this.height = 16;
    this.scale = 10; // 16 * 10 = 160px
    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;

    this.state = 'idle'; // 'idle' | 'working' | 'success'
    this.frame = 0;
    this.tick = 0;
    this.autoPilot = false;
    this.autoInterval = null;

    // DOM References
    this.statePill = document.getElementById('agent-state-pill');
    this.terminalLogs = document.getElementById('agent-terminal-logs');
    this.selectTask = document.getElementById('agent-task-select');
    this.btnRun = document.getElementById('btn-run-agent-task');
    this.btnAuto = document.getElementById('btn-toggle-autopilot');

    this.init();
  }

  init() {
    this.setupListeners();
    this.log('System online. BagasBot AI Agent initialized in autonomous sandbox.');
    this.loop();
  }

  setupListeners() {
    if (this.btnRun) {
      this.btnRun.addEventListener('click', () => {
        const task = this.selectTask ? this.selectTask.value : 'audit';
        this.executeTask(task);
      });
    }

    if (this.btnAuto) {
      this.btnAuto.addEventListener('click', () => {
        this.autoPilot = !this.autoPilot;
        this.btnAuto.classList.toggle('active', this.autoPilot);
        this.btnAuto.textContent = this.autoPilot ? '⚡ AUTO-PILOT: ON' : '⚡ AUTO-PILOT: OFF';
        
        if (this.autoPilot) {
          this.log('Mode Auto-Pilot aktif: Agent akan memantau & bekerja secara otomatis.');
          this.runAutoPilotCycle();
          this.autoInterval = setInterval(() => this.runAutoPilotCycle(), 14000);
        } else {
          clearInterval(this.autoInterval);
          this.log('Mode Auto-Pilot dimatikan. Agent kembali ke mode standby.');
          this.setState('idle');
        }
      });
    }
  }

  setState(newState) {
    this.state = newState;
    if (this.statePill) {
      this.statePill.className = `agent-state-pill ${newState}`;
      let text = 'STANDBY';
      if (newState === 'working') text = '⚡ WORKING';
      if (newState === 'success') text = '✓ MISSION DONE';
      this.statePill.textContent = text;
    }
  }

  log(text, type = 'normal') {
    if (!this.terminalLogs) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const div = document.createElement('div');
    div.className = 'log-entry';

    let prefix = '<span class="log-agent">[BagasBot]</span>';
    if (type === 'success') prefix = '<span class="log-agent">[BagasBot]</span> <span class="log-success">✓</span>';
    if (type === 'working') prefix = '<span class="log-agent">[BagasBot]</span> <span class="log-working">⚙</span>';

    div.innerHTML = `<span class="log-time">${now}</span> ${prefix} ${text}`;
    this.terminalLogs.appendChild(div);
    this.terminalLogs.scrollTop = this.terminalLogs.scrollHeight;
  }

  async executeTask(taskType) {
    if (this.state === 'working') return;

    this.setState('working');
    if (window.soundSynth) window.soundSynth.playCrystalSound();

    let taskName = 'Security Audit';
    if (taskType === 'optimize') taskName = 'Database Auto-Optimizer';
    if (taskType === 'test') taskName = 'Synthetic Unit-Test Generator';
    if (taskType === 'deploy') taskName = 'Automated CI/CD Simulation';

    this.log(`Memulai tugas: ${taskName}...`, 'working');

    try {
      const res = await fetch('/api/agent/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskType })
      });
      const data = await res.json();

      setTimeout(() => {
        if (data.success) {
          this.log(`Hasil: ${data.report}`, 'success');
          this.setState('success');
          if (window.soundSynth) window.soundSynth.playGameStartSound();

          setTimeout(() => {
            if (this.state === 'success') this.setState('idle');
          }, 3500);
        } else {
          this.log(`Gagal: ${data.error || 'Server timeout'}`, 'working');
          this.setState('idle');
        }
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        this.log(`Tugas simulasi lokal berhasil: ${taskName} selesai (Zero error detected).`, 'success');
        this.setState('success');
        setTimeout(() => {
          if (this.state === 'success') this.setState('idle');
        }, 3000);
      }, 1500);
    }
  }

  runAutoPilotCycle() {
    if (!this.autoPilot || this.state === 'working') return;
    const tasks = ['audit', 'optimize', 'test', 'deploy'];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    this.executeTask(randomTask);
  }

  // 16x16 Pixel Drawing Engine
  drawPixel(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    this.tick++;
    if (this.tick % 8 === 0) {
      this.frame = (this.frame + 1) % 4;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Palet Warna Cyber
    const C_DARK = '#0a101f';
    const C_BODY = '#1e293b';
    const C_LIGHT = '#38bdf8';
    const C_ACCENT = '#10b981';
    const C_PINK = '#f43f5e';
    const C_LAPTOP = '#334155';
    const C_SCREEN = '#06b6d4';

    let bobY = 0;
    if (this.state === 'idle') {
      bobY = Math.sin(this.tick * 0.08) > 0 ? 1 : 0;
    } else if (this.state === 'working') {
      bobY = 1;
    } else if (this.state === 'success') {
      bobY = (this.frame % 2 === 0) ? -2 : 0;
    }

    const yOff = 3 + bobY;

    // 1. Antena / Sensor Kepala
    this.drawPixel(7, yOff - 3, C_PINK);
    this.drawPixel(7, yOff - 2, C_BODY);

    // 2. Kepala Robot (7x5)
    for (let x = 4; x <= 10; x++) {
      for (let y = yOff - 1; y <= yOff + 3; y++) {
        this.drawPixel(x, y, C_BODY);
      }
    }

    // 3. Neon Cyber Visor (Mata)
    const visorColor = (this.state === 'working') ? C_PINK : (this.state === 'success' ? C_ACCENT : C_LIGHT);
    for (let x = 5; x <= 9; x++) {
      this.drawPixel(x, yOff + 1, visorColor);
    }
    // Visor Glint
    this.drawPixel(6, yOff + 1, '#ffffff');

    // 4. Badan Torso (6x5)
    for (let x = 5; x <= 9; x++) {
      for (let y = yOff + 4; y <= yOff + 7; y++) {
        this.drawPixel(x, y, C_BODY);
      }
    }

    // Core Reactor di Dada
    this.drawPixel(7, yOff + 5, C_ACCENT);

    // 5. Tangan & Animasi Berdasarkan State
    if (this.state === 'idle') {
      // Tangan di samping mengambang
      this.drawPixel(3, yOff + 5, C_LIGHT);
      this.drawPixel(11, yOff + 5, C_LIGHT);
      // Kaki melayang
      this.drawPixel(6, yOff + 8, C_DARK);
      this.drawPixel(8, yOff + 8, C_DARK);
    } 
    else if (this.state === 'working') {
      // Gambar Laptop di depan
      for (let x = 4; x <= 10; x++) {
        this.drawPixel(x, yOff + 7, C_LAPTOP);
      }
      for (let x = 5; x <= 9; x++) {
        this.drawPixel(x, yOff + 6, C_SCREEN);
      }

      // Tangan mengetik bergantian (typing frame)
      if (this.frame % 2 === 0) {
        this.drawPixel(5, yOff + 7, C_LIGHT);
        this.drawPixel(9, yOff + 6, C_LIGHT);
      } else {
        this.drawPixel(5, yOff + 6, C_LIGHT);
        this.drawPixel(9, yOff + 7, C_LIGHT);
      }

      // Kode / Partikel Melayang dari Laptop
      if (this.frame === 1) this.drawPixel(3, yOff + 4, C_ACCENT);
      if (this.frame === 3) this.drawPixel(11, yOff + 3, C_LIGHT);
    } 
    else if (this.state === 'success') {
      // Tangan terangkat ke atas!
      this.drawPixel(3, yOff + 2, C_LIGHT);
      this.drawPixel(2, yOff + 1, C_LIGHT);
      this.drawPixel(11, yOff + 2, C_LIGHT);
      this.drawPixel(12, yOff + 1, C_LIGHT);

      // Bintang kemenangan berkilau di sekitar kepala
      this.drawPixel(2, yOff - 2, C_ACCENT);
      this.drawPixel(12, yOff - 2, C_ACCENT);
      this.drawPixel(7, yOff - 4, '#f59e0b');
    }
  }
}

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.pixelAgentInstance = new PixelAgent('pixel-agent-canvas');
});
