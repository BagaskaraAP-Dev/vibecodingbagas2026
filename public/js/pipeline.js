// Direct Task Execution Engine for MOONCRUST // PIXEL AI STUDIO
// Stripped of verbose filler text: Pure actionable tasks, clean code, and working tools

class StudioPipelineEngine {
  constructor() {
    this.isActive = false;
    this.currentStage = 0;
    this.currentTaskTopic = '';
    this.deliverables = {
      daily: null,
      fe: null,
      be: null,
      uiux: null,
      sec: null
    };

    // Pomodoro Timer State
    this.pomodoroTime = 25 * 60;
    this.pomodoroTimerId = null;
    this.pomodoroRunning = false;

    // Load saved tasks from localStorage if available
    this.dailyTasks = this.loadSavedTasks();
  }

  loadSavedTasks() {
    try {
      const saved = localStorage.getItem('mooncrust_daily_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, text: 'Belajar Vibe Coding & Review Kode', done: false, priority: 'HIGH' },
      { id: 2, text: 'Praktikum & Tugas Kuliah', done: true, priority: 'HIGH' },
      { id: 3, text: 'Commit Git harian agar GitHub hijau', done: true, priority: 'HIGH' },
      { id: 4, text: 'Target Hidrasi: Minum 2 Liter Air', done: false, priority: 'MED' },
      { id: 5, text: 'Olahraga / Jalan Santai 30 Menit', done: false, priority: 'MED' }
    ];
  }

  saveTasks() {
    try {
      localStorage.setItem('mooncrust_daily_tasks', JSON.stringify(this.dailyTasks));
    } catch (e) {}
  }

  analyzeDomain(topic) {
    const t = (topic || '').toLowerCase();
    if (t.includes('futsal') || t.includes('booking') || t.includes('rental') || t.includes('sewa') || t.includes('reservasi')) {
      return { type: 'BOOKING', entity: 'booking', table: 'bookings', item: 'facilities' };
    } else if (t.includes('kampus') || t.includes('mahasiswa') || t.includes('akademik') || t.includes('kuliah') || t.includes('krs') || t.includes('nilai')) {
      return { type: 'ACADEMIC', entity: 'academic', table: 'student_grades', item: 'courses' };
    } else if (t.includes('ctf') || t.includes('security') || t.includes('exploit') || t.includes('rsa') || t.includes('sqli')) {
      return { type: 'SECURITY', entity: 'ctf', table: 'ctf_submissions', item: 'challenges' };
    } else if (t.includes('iot') || t.includes('sensor') || t.includes('telemetry')) {
      return { type: 'IOT', entity: 'sensor', table: 'telemetry_logs', item: 'devices' };
    } else {
      return { type: 'DEFAULT', entity: 'task', table: 'tasks', item: 'projects' };
    }
  }

  // Run full 5-agent sequential pipeline
  async runPipeline(topic) {
    if (this.isActive) return;
    if (!topic || topic.trim() === '') topic = 'Jadwal Aktivitas & Sistem Aplikasi';

    this.isActive = true;
    this.currentTaskTopic = topic;
    this.currentStage = 1;

    this.updateHUDStatus('PIPELINE AKTIF', '#00f3ff');
    this.updateStageNodes(1);

    const studio = window.pixelStudio;
    const audio = window.studioAudio;
    const domain = this.analyzeDomain(topic);

    if (studio) studio.logTerminal(`[Mulai Task] "${topic}"`);

    // Stage 1: UI/UX
    this.focusAgent('uiux');
    if (studio) studio.triggerAgentBubble('uiux', 'Menyusun wireframe & layout...', 120);
    if (audio) audio.playStageChime();
    await this.sleep(1200);
    this.deliverables.uiux = this.generateUIUX(topic, domain);
    this.renderDeliverableTab('uiux');
    this.markStageCompleted(1);

    // Stage 2: FE
    this.currentStage = 2;
    this.updateStageNodes(2);
    this.focusAgent('fe');
    if (studio) studio.triggerAgentBubble('fe', 'Mengoding komponen HTML & CSS...', 120);
    if (audio) audio.playStageChime();
    await this.sleep(1200);
    this.deliverables.fe = this.generateFE(topic, domain);
    this.renderDeliverableTab('fe');
    this.markStageCompleted(2);

    // Stage 3: DAILY
    this.currentStage = 3;
    this.updateStageNodes(3);
    this.focusAgent('daily');
    if (studio) studio.triggerAgentBubble('daily', 'Memperbarui to-do list & jadwal...', 120);
    if (audio) audio.playStageChime();
    await this.sleep(1200);
    this.deliverables.daily = this.generateDAILY(topic, domain);
    this.renderDeliverableTab('daily');
    this.markStageCompleted(3);

    // Stage 4: BE
    this.currentStage = 4;
    this.updateStageNodes(4);
    this.focusAgent('be');
    if (studio) studio.triggerAgentBubble('be', 'Menyusun skema SQL & API...', 120);
    if (audio) audio.playStageChime();
    await this.sleep(1200);
    this.deliverables.be = this.generateBE(topic, domain);
    this.renderDeliverableTab('be');
    this.markStageCompleted(4);

    // Stage 5: SEC
    this.currentStage = 5;
    this.updateStageNodes(5);
    this.focusAgent('sec');
    if (studio) studio.triggerAgentBubble('sec', 'Audit keamanan & validasi exploit...', 120);
    if (audio) audio.playScan();
    await this.sleep(1200);
    this.deliverables.sec = this.generateSEC(topic, domain);
    this.renderDeliverableTab('sec');
    this.markStageCompleted(5);

    // Done
    this.currentStage = 6;
    this.updateStageNodes(6);
    this.isActive = false;
    this.updateHUDStatus('SELESAI', '#10b981');
    if (audio) audio.playFanfare();
    if (studio) studio.logTerminal(`[Selesai] Task "${topic}" siap digunakan.`);

    this.renderDeliverableTab('summary');
    this.switchTabSilently('daily');
  }

  async runSingleAgent(agentId, topic) {
    if (this.isActive) return;
    if (!topic || topic.trim() === '') topic = this.currentTaskTopic || 'Tugas Spesialis';

    const studio = window.pixelStudio;
    const audio = window.studioAudio;
    const domain = this.analyzeDomain(topic);

    this.focusAgent(agentId);
    if (audio) audio.playStageChime();

    if (agentId === 'daily') {
      if (studio) studio.triggerAgentBubble('daily', 'Menyiapkan to-do list & jadwal...', 120);
      await this.sleep(800);
      this.deliverables.daily = this.generateDAILY(topic, domain);
      this.renderDeliverableTab('daily');
      this.switchTabSilently('daily');
    } else if (agentId === 'fe') {
      if (studio) studio.triggerAgentBubble('fe', 'Menyusun komponen frontend...', 120);
      await this.sleep(800);
      this.deliverables.fe = this.generateFE(topic, domain);
      this.renderDeliverableTab('fe');
      this.switchTabSilently('fe');
    } else if (agentId === 'be') {
      if (studio) studio.triggerAgentBubble('be', 'Menyusun skema SQL & REST API...', 120);
      await this.sleep(800);
      this.deliverables.be = this.generateBE(topic, domain);
      this.renderDeliverableTab('be');
      this.switchTabSilently('be');
    } else if (agentId === 'uiux') {
      if (studio) studio.triggerAgentBubble('uiux', 'Menyusun wireframe & layout...', 120);
      await this.sleep(800);
      this.deliverables.uiux = this.generateUIUX(topic, domain);
      this.renderDeliverableTab('uiux');
      this.switchTabSilently('uiux');
    } else if (agentId === 'sec') {
      if (studio) studio.triggerAgentBubble('sec', 'Menjalankan audit keamanan...', 120);
      if (audio) audio.playScan();
      await this.sleep(800);
      this.deliverables.sec = this.generateSEC(topic, domain);
      this.renderDeliverableTab('sec');
      this.switchTabSilently('sec');
    }

    if (audio) audio.playKey();
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  updateHUDStatus(text, color) {
    const badge = document.getElementById('pipelineBadge');
    if (badge) {
      badge.textContent = text;
      badge.style.color = color;
      badge.style.borderColor = color;
    }
  }

  focusAgent(id) {
    if (window.pixelStudio) window.pixelStudio.selectAgent(id);
  }

  updateStageNodes(stageNum) {
    document.querySelectorAll('.stage-node').forEach(node => {
      const step = parseInt(node.dataset.step, 10);
      node.classList.toggle('completed', step < stageNum);
      node.classList.toggle('active', step === stageNum);
    });
    const fill = document.getElementById('pipelineProgressFill');
    if (fill) fill.style.width = `${Math.min(100, Math.round((stageNum / 6) * 100))}%`;
  }

  markStageCompleted(stageNum) {
    const node = document.querySelector(`.stage-node[data-step="${stageNum}"]`);
    if (node) {
      node.classList.remove('active');
      node.classList.add('completed');
    }
  }

  switchTabSilently(tabKey) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabKey));
    if (btn) btn.classList.add('active');

    const panel = document.getElementById(`tabContent-${tabKey}`);
    if (panel) panel.classList.add('active');
  }

  // ==========================================
  // DIRECT DELIVERABLE GENERATORS (NO FLUFF)
  // ==========================================

  generateDAILY(topic) {
    return {
      todayDate: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      schedule: [
        { time: '08:00 - 10:00', task: 'Kuliah / Studi Materi Algoritma' },
        { time: '10:00 - 12:00', task: `Sesi Koding Fokus: "${topic.slice(0, 35)}"` },
        { time: '12:00 - 13:00', task: 'Istirahat, Sholat / Makan Siang' },
        { time: '13:00 - 15:30', task: 'Tugas Praktikum & Push Commit Git' },
        { time: '16:00 - 17:00', task: 'Olahraga & Aktivitas Fisik' },
        { time: '20:00 - 21:30', task: 'Review Tugas & Rencana Esok' }
      ]
    };
  }

  generateFE(topic, domain) {
    const code = `<!-- Component: ${domain.entity}-ui.html -->
<div class="p-4 bg-slate-900 border border-cyan-500 rounded text-white font-mono">
  <div class="flex justify-between items-center pb-2 mb-3 border-b border-slate-700">
    <h3 class="font-bold text-cyan-400">${topic}</h3>
    <span class="text-xs px-2 py-0.5 bg-cyan-950 border border-cyan-700 rounded text-cyan-300">ONLINE</span>
  </div>
  <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">
      <div class="text-slate-400">STATUS</div>
      <div class="text-emerald-400 font-bold">AKTIF</div>
    </div>
    <div class="p-2 bg-slate-950 border border-slate-800 rounded">
      <div class="text-slate-400">RESPONS</div>
      <div class="text-cyan-400 font-bold" id="feLatency">4.2 ms</div>
    </div>
  </div>
  <div class="flex gap-2">
    <button onclick="document.getElementById('feLatency').textContent = (Math.random()*3+3).toFixed(1)+' ms'; alert('Eksekusi berhasil!');" class="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded">
      EKSEKUSI
    </button>
  </div>
</div>`;
    return { codeSnippet: code };
  }

  generateBE(topic, domain) {
    const sql = `-- Skema SQL: ${topic}
CREATE TABLE IF NOT EXISTS ${domain.table} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    reference VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_${domain.table}_ref ON ${domain.table}(reference);
CREATE INDEX IF NOT EXISTS idx_${domain.table}_status ON ${domain.table}(status);`;

    const api = `// API Route: api/${domain.entity}.js
import express from 'express';
const router = express.Router();

router.get('/list', async (req, res) => {
  res.json({ success: true, table: '${domain.table}', count: 1, data: [{ id: '1', status: 'active' }] });
});

router.post('/create', async (req, res) => {
  const { reference, payload } = req.body;
  if (!reference) return res.status(400).json({ error: 'Field reference wajib' });
  res.status(201).json({ success: true, message: 'Data tersimpan', id: Date.now() });
});

export default router;`;
    return { sqlSchema: sql, apiRoutes: api };
  }

  generateUIUX(topic, domain) {
    const wireframe = `+-----------------------------------------------------------+
| [NAV]  Dashboard: ${topic.slice(0, 32)}...               |
+-----------------------------------------------------------+
| [Kiri: Menu]    | [Kanan: Area Kerja Data ${domain.table}]       |
| - Ringkasan     | +-------------------------------------+ |
| - Data Utama    | | Total Data: 120 | Status: Siap      | |
| - Pengaturan    | +-------------------------------------+ |
|                 | [Form Input] [Tombol Simpan]          | |
+-----------------------------------------------------------+`;

    const tokens = {
      primary: '#00f3ff',
      secondary: '#3b82f6',
      accent: '#10b981',
      background: '#080b14',
      card: '#0f172a'
    };

    return { wireframe, tokens };
  }

  generateSEC(topic, domain) {
    const flagKey = Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      flag: `FLAG{mooncrust_${domain.entity}_${flagKey}}`,
      vulns: [
        { name: 'SQL Injection', status: 'MITIGATED', fix: 'Gunakan parameter binding ($1, $2), dilarang string concatenate.' },
        { name: 'Broken Access Control', status: 'MITIGATED', fix: 'Gunakan UUID acak dan validasi session token JWT per user.' },
        { name: 'XSS & Payload Tampering', status: 'MITIGATED', fix: 'Escape output HTML dan sanitasi body JSON.' }
      ],
      solverScript: `# CTF Solver Python
import requests

def solve():
    flag = "FLAG{mooncrust_${domain.entity}_${flagKey}}"
    print(f"[+] Flag berhasil diambil: {flag}")
    return flag

if __name__ == '__main__':
    solve()`
    };
  }

  // ==========================================
  // RENDER PURE TABS
  // ==========================================

  renderDeliverableTab(tabKey) {
    const container = document.getElementById(`tabContent-${tabKey}`);
    if (!container) return;

    if (tabKey === 'daily') {
      const d = this.deliverables.daily || this.generateDAILY(this.currentTaskTopic);
      container.innerHTML = `
        <!-- Pomodoro Timer -->
        <div class="pomodoro-box mb-4">
          <div class="flex-between">
            <span class="pomodoro-header">⏱️ POMODORO FOCUS TIMER</span>
            <span id="pomoStatusText" class="badge-pomo">${this.pomodoroRunning ? 'BERJALAN' : 'SIAP'}</span>
          </div>
          <div class="pomo-display" id="pomoDisplay">${this.formatPomoTime()}</div>
          <div class="pomo-controls">
            <button onclick="window.pipelineEngine.startPomodoro()" class="btn-pomo btn-pomo-start">▶ MULAI FOKUS</button>
            <button onclick="window.pipelineEngine.pausePomodoro()" class="btn-pomo">⏸ JEDA</button>
            <button onclick="window.pipelineEngine.resetPomodoro()" class="btn-pomo">🔄 RESET</button>
          </div>
        </div>

        <!-- Real Working To-Do List -->
        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4 style="font-family:var(--font-pixel); font-size:9px;">📝 DAFTAR TUGAS HARIAN (${d.todayDate})</h4>
            <div style="display:flex; gap:6px;">
              <input type="text" id="newDailyTaskInput" placeholder="Ketik tugas baru..." class="input-task-small" onkeydown="if(event.key==='Enter') window.pipelineEngine.addNewTask();">
              <button onclick="window.pipelineEngine.addNewTask()" class="btn-pixel-small">+ TAMBAH</button>
            </div>
          </div>
          <div id="dailyTodoListContainer" class="todo-list-wrapper">
            ${this.renderTodoListHTML()}
          </div>
        </div>

        <!-- Simple Daily Schedule -->
        <div class="deliverable-section">
          <h4 style="font-family:var(--font-pixel); font-size:9px;">📅 JADWAL ALOKASI WAKTU</h4>
          <table class="audit-table">
            <thead>
              <tr><th>Jam</th><th>Aktivitas</th></tr>
            </thead>
            <tbody>
              ${d.schedule.map(s => `<tr><td class="font-mono text-cyan" style="width:140px">${s.time}</td><td>${s.task}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (tabKey === 'fe' && this.deliverables.fe) {
      const d = this.deliverables.fe;
      container.innerHTML = `
        <div class="flex-between mb-2">
          <h4 style="font-family:var(--font-pixel); font-size:9px;">KODE KOMPONEN (HTML & TAILWIND)</h4>
          <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.fe.codeSnippet); alert('Kode disalin!');" class="btn-pixel-small">📋 SALIN KODE</button>
        </div>
        <div class="code-box mb-3"><pre><code>${this.escapeHTML(d.codeSnippet)}</code></pre></div>
        <h4 style="font-family:var(--font-pixel); font-size:9px; margin-bottom:8px;">PREVIEW LANGSUNG:</h4>
        <div class="live-preview-container border-blue">${d.codeSnippet.replace(/<script[\s\S]*?<\/script>/gi, '')}</div>
      `;
    } else if (tabKey === 'be' && this.deliverables.be) {
      const d = this.deliverables.be;
      container.innerHTML = `
        <div class="flex-between mb-2">
          <h4 style="font-family:var(--font-pixel); font-size:9px;">SKEMA SQL (DDL)</h4>
          <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.be.sqlSchema); alert('SQL disalin!');" class="btn-pixel-small">📋 SALIN SQL</button>
        </div>
        <div class="code-box mb-4"><pre><code>${this.escapeHTML(d.sqlSchema)}</code></pre></div>

        <div class="flex-between mb-2">
          <h4 style="font-family:var(--font-pixel); font-size:9px;">KONTROLER REST API (EXPRESS.JS)</h4>
          <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.be.apiRoutes); alert('API disalin!');" class="btn-pixel-small">📋 SALIN API</button>
        </div>
        <div class="code-box"><pre><code>${this.escapeHTML(d.apiRoutes)}</code></pre></div>
      `;
    } else if (tabKey === 'uiux' && this.deliverables.uiux) {
      const d = this.deliverables.uiux;
      container.innerHTML = `
        <h4 style="font-family:var(--font-pixel); font-size:9px; margin-bottom:8px;">WIREFRAME TATA LETAK</h4>
        <div class="code-box terminal-box mb-3"><pre><code>${d.wireframe}</code></pre></div>
        <h4 style="font-family:var(--font-pixel); font-size:9px; margin-bottom:8px;">PALET WARNA TOKEN</h4>
        <div class="code-box"><pre><code>${JSON.stringify(d.tokens, null, 2)}</code></pre></div>
      `;
    } else if (tabKey === 'sec' && this.deliverables.sec) {
      const d = this.deliverables.sec;
      container.innerHTML = `
        <div class="ctf-card border-gold mb-3">
          <div style="font-family:var(--font-pixel); font-size:9px; color:var(--color-gold); margin-bottom:6px;">🚩 CTF SECRET FLAG</div>
          <div class="flag-box"><span class="flag-value">${d.flag}</span></div>
        </div>
        <h4 style="font-family:var(--font-pixel); font-size:9px; margin-bottom:8px;">DAFTAR AUDIT KEAMANAN</h4>
        <table class="audit-table mb-3">
          <thead><tr><th>Celah</th><th>Status</th><th>Mitigasi</th></tr></thead>
          <tbody>
            ${d.vulns.map(v => `<tr><td class="font-mono text-cyan">${v.name}</td><td><span class="status-mitigated">✓ ${v.status}</span></td><td>${v.fix}</td></tr>`).join('')}
          </tbody>
        </table>
        <h4 style="font-family:var(--font-pixel); font-size:9px; margin-bottom:8px;">SCRIPT SOLVER (PYTHON)</h4>
        <div class="code-box"><pre><code>${this.escapeHTML(d.solverScript)}</code></pre></div>
      `;
    } else if (tabKey === 'summary') {
      container.innerHTML = `
        <div class="flex-between mb-3">
          <h4 style="font-family:var(--font-pixel); font-size:9px;">HASIL EKSEKUSI TUGAS: ${this.currentTaskTopic || 'Tugas Aktif'}</h4>
          <button onclick="window.pipelineEngine.exportFullMarkdown()" class="btn-launch" style="padding:6px 12px; font-size:9px;">📥 DOWNLOAD FILE .MD</button>
        </div>
        <p class="text-muted mb-3">Seluruh kode frontend, skema SQL, API backend, to-do list, dan audit keamanan siap dipakai.</p>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button onclick="switchTab('daily')" class="btn-pixel-small">📅 Buka To-Do List</button>
          <button onclick="switchTab('fe')" class="btn-pixel-small">💻 Buka Kode Frontend</button>
          <button onclick="switchTab('be')" class="btn-pixel-small">🗄️ Buka Skema SQL & API</button>
          <button onclick="switchTab('sec')" class="btn-pixel-small">🛡️ Buka Flag & Keamanan</button>
        </div>
      `;
    }
  }

  renderTodoListHTML() {
    if (!this.dailyTasks || this.dailyTasks.length === 0) return '<div class="text-muted">Tidak ada tugas. Tambahkan di atas!</div>';
    return this.dailyTasks.map(t => `
      <div class="todo-item ${t.done ? 'todo-done' : ''}">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="window.pipelineEngine.toggleTaskDone(${t.id})" class="todo-checkbox">
        <span class="todo-text" onclick="window.pipelineEngine.toggleTaskDone(${t.id})">${this.escapeHTML(t.text)}</span>
        <button onclick="window.pipelineEngine.deleteTask(${t.id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px;">✕</button>
      </div>
    `).join('');
  }

  toggleTaskDone(id) {
    const t = this.dailyTasks.find(x => x.id === id);
    if (t) {
      t.done = !t.done;
      this.saveTasks();
      const el = document.getElementById('dailyTodoListContainer');
      if (el) el.innerHTML = this.renderTodoListHTML();
      if (window.studioAudio) window.studioAudio.playKey();
    }
  }

  addNewTask() {
    const input = document.getElementById('newDailyTaskInput');
    if (!input || !input.value.trim()) return;
    this.dailyTasks.unshift({
      id: Date.now(),
      text: input.value.trim(),
      done: false
    });
    this.saveTasks();
    input.value = '';
    const el = document.getElementById('dailyTodoListContainer');
    if (el) el.innerHTML = this.renderTodoListHTML();
    if (window.studioAudio) window.studioAudio.playKey();
  }

  deleteTask(id) {
    this.dailyTasks = this.dailyTasks.filter(x => x.id !== id);
    this.saveTasks();
    const el = document.getElementById('dailyTodoListContainer');
    if (el) el.innerHTML = this.renderTodoListHTML();
    if (window.studioAudio) window.studioAudio.playKey();
  }

  // Pomodoro
  startPomodoro() {
    if (this.pomodoroRunning) return;
    this.pomodoroRunning = true;
    const txt = document.getElementById('pomoStatusText');
    if (txt) { txt.textContent = 'BERJALAN'; txt.style.background = '#065f46'; }
    if (window.studioAudio) window.studioAudio.playKey();

    this.pomodoroTimerId = setInterval(() => {
      this.pomodoroTime--;
      this.updatePomoDisplay();
      if (this.pomodoroTime <= 0) {
        clearInterval(this.pomodoroTimerId);
        this.pomodoroRunning = false;
        this.pomodoroTime = 25 * 60;
        this.updatePomoDisplay();
        if (window.studioAudio) window.studioAudio.playFanfare();
        alert('🎉 Sesi Pomodoro 25 menit selesai! Istirahat sejenak.');
      }
    }, 1000);
  }

  pausePomodoro() {
    if (!this.pomodoroRunning) return;
    clearInterval(this.pomodoroTimerId);
    this.pomodoroRunning = false;
    const txt = document.getElementById('pomoStatusText');
    if (txt) { txt.textContent = 'DIJEDA'; txt.style.background = '#78350f'; }
    if (window.studioAudio) window.studioAudio.playKey();
  }

  resetPomodoro() {
    clearInterval(this.pomodoroTimerId);
    this.pomodoroRunning = false;
    this.pomodoroTime = 25 * 60;
    this.updatePomoDisplay();
    const txt = document.getElementById('pomoStatusText');
    if (txt) { txt.textContent = 'SIAP'; txt.style.background = '#1e293b'; }
    if (window.studioAudio) window.studioAudio.playKey();
  }

  formatPomoTime() {
    const m = Math.floor(this.pomodoroTime / 60).toString().padStart(2, '0');
    const s = (this.pomodoroTime % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  updatePomoDisplay() {
    const el = document.getElementById('pomoDisplay');
    if (el) el.textContent = this.formatPomoTime();
  }

  exportFullMarkdown() {
    const topic = this.currentTaskTopic || 'Tugas Mooncrust';
    const fe = this.deliverables.fe;
    const be = this.deliverables.be;
    const sec = this.deliverables.sec;

    const tasksList = this.dailyTasks.map(t => `- [${t.done ? 'x' : ' '}] ${t.text}`).join('\n');

    const md = `# DOKUMEN TUGAS: ${topic}
Tanggal: ${new Date().toLocaleDateString('id-ID')}

## 1. To-Do List Harian
${tasksList}

## 2. Kode Frontend
\`\`\`html
${fe ? fe.codeSnippet : ''}
\`\`\`

## 3. Skema SQL Backend
\`\`\`sql
${be ? be.sqlSchema : ''}
\`\`\`

## 4. API Backend
\`\`\`javascript
${be ? be.apiRoutes : ''}
\`\`\`

## 5. Keamanan & Flag
${sec ? `- Flag: ${sec.flag}` : ''}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tugas-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.studioAudio) window.studioAudio.playKey();
  }

  escapeHTML(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.pipelineEngine = new StudioPipelineEngine();
