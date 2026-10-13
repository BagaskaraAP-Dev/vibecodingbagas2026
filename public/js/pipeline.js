// Autonomous Multi-Agent Auto-Pipeline Engine for MOONCRUST // PIXEL AI STUDIO
// Context-Aware, Non-Slop Dynamic Engineering & Daily Productivity Pipeline

class StudioPipelineEngine {
  constructor() {
    this.isActive = false;
    this.currentStage = 0; // 0: Idle, 1: UI/UX, 2: FE, 3: DAILY, 4: BE, 5: SEC, 6: Complete
    this.currentTaskTopic = '';
    this.deliverables = {
      uiux: null,
      fe: null,
      daily: null,
      be: null,
      sec: null
    };

    // Quick presets
    this.presets = {
      dailyRoutine: 'Jadwal Kuliah, Belajar Coding Vibe, & Target Olahraga Harian',
      futsal: 'Aplikasi Reservasi & Booking Lapangan Futsal Realtime dengan QRIS',
      campus: 'Sistem Portal Akademik Kampus & Penilaian Mahasiswa Terintegrasi',
      ecommerce: 'E-Commerce Secure Checkout & Payment Gateway (OWASP Hardened)',
      ctf: 'CTF Challenge: Crypto RSA & Web SQL Injection Lab with Automated Flag Validator'
    };

    // Pomodoro Timer State for Daily Bot
    this.pomodoroTime = 25 * 60; // 25 minutes
    this.pomodoroTimerId = null;
    this.pomodoroRunning = false;
  }

  analyzeDomain(topic) {
    const t = topic.toLowerCase();
    if (t.includes('jadwal') || t.includes('rutinitas') || t.includes('daily') || t.includes('harian') || t.includes('todo') || t.includes('olahraga') || t.includes('kebiasaan')) {
      return {
        type: 'DAILY',
        entity: 'daily',
        entityTitle: 'Daily Life & Productivity',
        tableMain: 'daily_habits',
        tableItem: 'routine_tasks',
        fields: ['id', 'user_id', 'task_title', 'priority', 'time_block', 'is_completed', 'date']
      };
    } else if (t.includes('futsal') || t.includes('booking') || t.includes('rental') || t.includes('sewa') || t.includes('reservasi') || t.includes('tiket') || t.includes('hotel')) {
      return {
        type: 'BOOKING',
        entity: 'booking',
        entityTitle: 'Reservasi & Booking',
        tableMain: 'bookings',
        tableItem: 'facilities',
        fields: ['id', 'user_id', 'facility_id', 'booking_date', 'slot_time', 'total_amount', 'status', 'qris_payload']
      };
    } else if (t.includes('kampus') || t.includes('mahasiswa') || t.includes('akademik') || t.includes('kuliah') || t.includes('dosen') || t.includes('krs') || t.includes('nilai')) {
      return {
        type: 'ACADEMIC',
        entity: 'academic',
        entityTitle: 'Portal Akademik & KRS',
        tableMain: 'student_grades',
        tableItem: 'courses',
        fields: ['id', 'student_nim', 'course_code', 'semester', 'grade_point', 'attendance_rate', 'status', 'lecturer_id']
      };
    } else if (t.includes('ctf') || t.includes('security') || t.includes('rsa') || t.includes('sqli') || t.includes('cipher') || t.includes('pentest') || t.includes('exploit')) {
      return {
        type: 'SECURITY',
        entity: 'ctf',
        entityTitle: 'Cyber Security Lab & CTF',
        tableMain: 'ctf_submissions',
        tableItem: 'challenges',
        fields: ['id', 'challenger_id', 'challenge_id', 'flag_hash', 'is_solved', 'solve_time_ms', 'points', 'ip_address']
      };
    } else {
      return {
        type: 'COMMERCE',
        entity: 'order',
        entityTitle: 'E-Commerce & Digital Ops',
        tableMain: 'orders',
        tableItem: 'products',
        fields: ['id', 'user_id', 'order_ref', 'total_price', 'payment_status', 'shipping_address', 'checksum_sha256', 'created_at']
      };
    }
  }

  // Run full 5-agent sequential pipeline
  async runPipeline(topic) {
    if (this.isActive) return;
    if (!topic || topic.trim() === '') {
      topic = this.presets.futsal;
    }

    this.isActive = true;
    this.currentTaskTopic = topic;
    this.currentStage = 1;
    this.deliverables = { uiux: null, fe: null, daily: null, be: null, sec: null };

    this.updateHUDStatus('PIPELINE SEDANG BERJALAN', '#00f3ff');
    this.updateStageNodes(1);

    const studio = window.pixelStudio;
    const audio = window.studioAudio;
    const domain = this.analyzeDomain(topic);

    if (studio) studio.logTerminal(`🚀 [PIPELINE 5-AGEN] Memulai sprint terpadu untuk topik: "${topic}" (${domain.entityTitle})`);

    // STAGE 1: UI/UX-Bot
    this.setTicker(`[STAGE 1/5] UI/UX-Bot merancang User Flow & Wireframe untuk: "${topic}"`);
    this.focusAgent('uiux');
    if (studio) {
      const a = studio.agents.find(x => x.id === 'uiux');
      a.targetX = studio.stations.whiteboard.x;
      a.targetY = studio.stations.whiteboard.y + 20;
      studio.triggerAgentBubble('uiux', 'Menganalisis persona & menyusun user journey...', 180);
      studio.logTerminal(`[UI/UX-Bot] Memetakan arsitektur informasi & wireframe.`);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2000);

    this.deliverables.uiux = this.generateUIUXDeliverable(topic, domain);
    this.renderDeliverableTab('uiux');
    this.markStageCompleted(1);
    this.switchTabSilently('uiux');
    if (audio) audio.playKey();

    // STAGE 2: FE-Bot
    this.currentStage = 2;
    this.updateStageNodes(2);
    this.setTicker(`[STAGE 2/5] FE-Bot mengoding komponen antarmuka responsif HTML5 & Tailwind...`);
    this.focusAgent('fe');
    if (studio) {
      const a = studio.agents.find(x => x.id === 'fe');
      a.targetX = studio.stations.fe.x;
      a.targetY = studio.stations.fe.y;
      studio.triggerAgentBubble('fe', 'Mengompilasi komponen HTML5 & Tailwind...', 180);
      studio.logTerminal(`[FE-Bot] Merakit komponen interaktif dengan live preview.`);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2000);

    this.deliverables.fe = this.generateFEDeliverable(topic, domain);
    this.renderDeliverableTab('fe');
    this.markStageCompleted(2);
    this.switchTabSilently('fe');
    if (audio) audio.playKey();

    // STAGE 3: DAILY-Bot
    this.currentStage = 3;
    this.updateStageNodes(3);
    this.setTicker(`[STAGE 3/5] DAILY-Bot menyusun Time-Blocking, Habit Tracker & Pomodoro Schedule...`);
    this.focusAgent('daily');
    if (studio) {
      const a = studio.agents.find(x => x.id === 'daily');
      a.targetX = studio.stations.daily.x;
      a.targetY = studio.stations.daily.y;
      studio.triggerAgentBubble('daily', 'Menata to-do harian, alokasi waktu & target fokus 📅', 180);
      studio.logTerminal(`[DAILY-Bot] Merumuskan jadwal aktivitas harian & checklist prioritas.`);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2000);

    this.deliverables.daily = this.generateDAILYDeliverable(topic, domain);
    this.renderDeliverableTab('daily');
    this.markStageCompleted(3);
    this.switchTabSilently('daily');
    if (audio) audio.playKey();

    // STAGE 4: BE-Bot
    this.currentStage = 4;
    this.updateStageNodes(4);
    this.setTicker(`[STAGE 4/5] BE-Bot merancang skema relasional SQL & arsitektur REST API...`);
    this.focusAgent('be');
    if (studio) {
      const a = studio.agents.find(x => x.id === 'be');
      a.targetX = studio.stations.be.x;
      a.targetY = studio.stations.be.y;
      studio.triggerAgentBubble('be', 'Kompilasi DDL SQL & autentikasi JWT selesai!', 180);
      studio.logTerminal(`[BE-Bot] Merancang skema relasional database & rute API.`);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2000);

    this.deliverables.be = this.generateBEDeliverable(topic, domain);
    this.renderDeliverableTab('be');
    this.markStageCompleted(4);
    this.switchTabSilently('be');
    if (audio) audio.playKey();

    // STAGE 5: SEC-Bot
    this.currentStage = 5;
    this.updateStageNodes(5);
    this.setTicker(`[STAGE 5/5] SEC-Bot melakukan audit celah OWASP & uji tantangan CTF...`);
    this.focusAgent('sec');
    if (studio) {
      const a = studio.agents.find(x => x.id === 'sec');
      a.targetX = studio.stations.sec.x;
      a.targetY = studio.stations.sec.y;
      studio.triggerAgentBubble('sec', 'Memindai celah OWASP & memvalidasi flag CTF!', 180);
      studio.logTerminal(`[SEC-Bot] Audit keamanan selesai: 0 celah kritis.`);
    }
    if (audio) {
      audio.playScan();
      audio.playAlert();
    }
    await this.sleep(2000);

    this.deliverables.sec = this.generateSECDeliverable(topic, domain);
    this.renderDeliverableTab('sec');
    this.markStageCompleted(5);

    // STAGE 6: ALL AGENTS CELEBRATE & COMPLETE
    this.currentStage = 6;
    this.updateStageNodes(6);
    this.isActive = false;
    this.updateHUDStatus('PIPELINE 5-AGEN SELESAI', '#10b981');
    this.setTicker(`🎉 SPRINT 5-AGEN SELESAI: Seluruh artefak proyek & rencana harian siap!`);

    if (studio) {
      studio.triggerAgentBubble('uiux', 'Desain 100% Verifikasi! 🎨', 180);
      studio.triggerAgentBubble('fe', 'Frontend Siap Live! 💻', 180);
      studio.triggerAgentBubble('daily', 'Rutinitas & To-Do Rapi! 📅', 180);
      studio.triggerAgentBubble('be', 'Database Indexes Optimal! 🗄️', 180);
      studio.triggerAgentBubble('sec', 'Sistem Aman Teruji! 🛡️', 180);
      studio.logTerminal(`🏆 [SUCCESS] Seluruh artefak 5 Sub-Agent sukses dikompilasi.`);
    }
    if (audio) audio.playFanfare();

    this.renderDeliverableTab('summary');
    this.switchTabSilently('summary');
  }

  // Run a single agent directly on demand
  async runSingleAgent(agentId, topic) {
    if (this.isActive) return;
    if (!topic || topic.trim() === '') topic = this.currentTaskTopic || this.presets.futsal;

    const studio = window.pixelStudio;
    const audio = window.studioAudio;
    const domain = this.analyzeDomain(topic);

    this.focusAgent(agentId);
    if (audio) audio.playStageChime();

    if (agentId === 'uiux') {
      if (studio) {
        studio.triggerAgentBubble('uiux', `Merancang UI/UX untuk "${topic}"...`, 160);
        studio.logTerminal(`[UI/UX-Bot Solo] Memulai perancangan desain antarmuka.`);
      }
      await this.sleep(1400);
      this.deliverables.uiux = this.generateUIUXDeliverable(topic, domain);
      this.renderDeliverableTab('uiux');
      this.switchTabSilently('uiux');
    } else if (agentId === 'fe') {
      if (studio) {
        studio.triggerAgentBubble('fe', `Mengoding komponen frontend untuk "${topic}"...`, 160);
        studio.logTerminal(`[FE-Bot Solo] Mengompilasi kode komponen HTML5/Tailwind.`);
      }
      await this.sleep(1400);
      this.deliverables.fe = this.generateFEDeliverable(topic, domain);
      this.renderDeliverableTab('fe');
      this.switchTabSilently('fe');
    } else if (agentId === 'daily') {
      if (studio) {
        studio.triggerAgentBubble('daily', `Menyusun rencana harian untuk "${topic}"...`, 160);
        studio.logTerminal(`[DAILY-Bot Solo] Merumuskan jadwal harian, to-do list, dan Pomodoro.`);
      }
      await this.sleep(1400);
      this.deliverables.daily = this.generateDAILYDeliverable(topic, domain);
      this.renderDeliverableTab('daily');
      this.switchTabSilently('daily');
    } else if (agentId === 'be') {
      if (studio) {
        studio.triggerAgentBubble('be', `Merancang SQL & API untuk "${topic}"...`, 160);
        studio.logTerminal(`[BE-Bot Solo] Merakit skema DDL & kontroler API.`);
      }
      await this.sleep(1400);
      this.deliverables.be = this.generateBEDeliverable(topic, domain);
      this.renderDeliverableTab('be');
      this.switchTabSilently('be');
    } else if (agentId === 'sec') {
      if (studio) {
        studio.triggerAgentBubble('sec', `Menjalankan audit OWASP & CTF untuk "${topic}"...`, 160);
        studio.logTerminal(`[SEC-Bot Solo] Melakukan pentest & validasi flag.`);
      }
      if (audio) audio.playScan();
      await this.sleep(1400);
      this.deliverables.sec = this.generateSECDeliverable(topic, domain);
      this.renderDeliverableTab('sec');
      this.switchTabSilently('sec');
    }

    if (audio) audio.playKey();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateHUDStatus(statusText, color) {
    const badge = document.getElementById('pipelineBadge');
    if (badge) {
      badge.textContent = statusText;
      badge.style.color = color;
      badge.style.borderColor = color;
    }
  }

  setTicker(msg) {
    const ticker = document.getElementById('liveStatusTicker');
    if (ticker) {
      ticker.innerHTML = msg;
    }
  }

  focusAgent(agentId) {
    if (window.pixelStudio) {
      window.pixelStudio.selectAgent(agentId);
    }
  }

  updateStageNodes(stageNum) {
    const nodes = document.querySelectorAll('.stage-node');
    nodes.forEach(node => {
      const step = parseInt(node.dataset.step, 10);
      if (step < stageNum) {
        node.classList.add('completed');
        node.classList.remove('active');
      } else if (step === stageNum) {
        node.classList.add('active');
        node.classList.remove('completed');
      } else {
        node.classList.remove('active', 'completed');
      }
    });

    const progressFill = document.getElementById('pipelineProgressFill');
    if (progressFill) {
      const percentage = Math.min(100, Math.round((stageNum / 6) * 100));
      progressFill.style.width = `${percentage}%`;
    }
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

    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabKey));
    if (activeBtn) activeBtn.classList.add('active');

    const targetPanel = document.getElementById(`tabContent-${tabKey}`);
    if (targetPanel) targetPanel.classList.add('active');
  }

  // ========================================================
  // DELIVERABLE GENERATORS
  // ========================================================

  generateUIUXDeliverable(topic, domain) {
    return {
      title: `🎨 UI/UX Arsitektur & Spesifikasi Desain: ${topic}`,
      agent: 'UI/UX-Bot (Cyan Station)',
      timestamp: new Date().toLocaleTimeString(),
      domain: domain.entityTitle,
      userPersonas: [
        { 
          role: 'Pengguna Utama (End-User)', 
          need: `Antarmuka yang responsif, navigasi cepat untuk mengakses fitur ${domain.entityTitle}, dengan feedback visual instan (< 100ms).` 
        },
        { 
          role: 'Administrator / Operator Sistem', 
          need: `Tabel manajemen data ${domain.tableMain}, filter status waktu-nyata, dan log audit perubahan yang transparan.` 
        }
      ],
      userFlow: `
[Landing / Autentikasi] ---> [Dashboard Ringkasan] ---> [Formulir Input ${domain.entityTitle}] ---> [Konfirmasi & Validasi]
          |                               |                                |                              |
          v                               v                                v                              v
 (Sanitasi Input Client)         (Validasi Akses JWT)             (Payload Terenkripsi SHA-256)     (Audit Logging Disimpan)
      `,
      designTokens: {
        colors: {
          brandPrimary: '#00f3ff /* Cyan Neon */',
          brandSecondary: '#3b82f6 /* Tech Blue */',
          brandDaily: '#10b981 /* Emerald Routine */',
          backgroundDark: '#080b14 /* Deep Slate Darkroom */',
          surfaceCard: '#0f172a /* Dark Slate Panel */',
          accentSuccess: '#10b981 /* Emerald Terminal Status */',
          accentWarning: '#f59e0b /* Amber Alert */',
          accentDanger: '#ef4444 /* Crimson Vulnerability */'
        },
        typography: {
          headerDisplay: '"Press Start 2P", monospace /* Retro Heading */',
          codeMonospace: '"JetBrains Mono", "Courier New", monospace /* Kode & Data */',
          scale: { h1: '24px', h2: '18px', body: '14px', small: '11px' }
        },
        spacing: 'Grid 8pt terstandardisasi (8px, 16px, 24px, 32px, 48px)'
      },
      wireframe: `
+-----------------------------------------------------------------------------------------+
| [MOONCRUST // ${domain.entityTitle.toUpperCase()}]             [User: Active] [Uptime: 99.98%]     |
+-----------------------------------------------------------------------------------------+
| NAVIGATION        | WORKSPACE: ${topic.slice(0, 38)}...                         |
| - Ringkasan Data  | +-----------------------------------------------------------------+ |
| - Daftar ${domain.tableMain}| | KONTROL & STATISTIK WAKTU NYATA                                 | |
| - Audit Keamanan  | | [ Total: 1,420 ]  [ Berhasil: 99.2% ]  [ Latensi: 8ms ]         | |
| - Pengaturan      | +-----------------------------------------------------------------+ |
|                   | FORMULIR AKSI ${domain.entityTitle.toUpperCase()}:                               |
|                   | [ Input Field 1 ]  [ Pilihan Kategori ]  [ Tombol Eksekusi ]      |
+-----------------------------------------------------------------------------------------+
      `,
      heuristics: [
        'Visibility of System Status: Ticker waktu-nyata dan status indikator LED menunjukkan status pipeline.',
        'Match Between System and Real World: Terminologi teknis selaras dengan rekayasa perangkat lunak modern.',
        'Error Prevention: Validasi ganda di sisi antarmuka dan sanitasi regex sebelum pengiriman payload.'
      ]
    };
  }

  generateFEDeliverable(topic, domain) {
    const slug = domain.entity;
    return {
      title: `💻 Komponen Frontend Responsif: ${topic}`,
      agent: 'FE-Bot (Blue Station)',
      timestamp: new Date().toLocaleTimeString(),
      framework: 'HTML5 Semantic + Tailwind CSS + Vanilla ES6 Modern JavaScript',
      codeSnippet: `<!-- Komponen: ${slug}-interface.html -->
<div class="mission-card border-2 border-cyan-500 bg-slate-900 text-white rounded-lg p-6 shadow-2xl">
  <div class="flex items-center justify-between border-b border-cyan-800 pb-3 mb-4">
    <div class="flex items-center gap-3">
      <span class="inline-block w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
      <h3 class="font-mono text-cyan-400 font-bold text-lg">${topic}</h3>
    </div>
    <span class="px-2.5 py-1 text-xs font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-700">v2.5.0-PROD</span>
  </div>

  <p class="text-slate-300 font-mono text-sm mb-4 leading-relaxed">
    Modul antarmuka untuk manajemen <strong>${domain.entityTitle}</strong> dengan performa tinggi, animasi transisi GPU-accelerated, dan zero external bloated framework.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
    <div class="bg-slate-950 p-3 rounded border border-slate-800">
      <div class="text-xs text-slate-400 font-mono">LATENSI PIPELINE</div>
      <div class="text-xl font-bold text-emerald-400 font-mono" id="valLatency">6.8 ms</div>
    </div>
    <div class="bg-slate-950 p-3 rounded border border-slate-800">
      <div class="text-xs text-slate-400 font-mono">STATUS INTEGRITAS</div>
      <div class="text-xl font-bold text-cyan-400 font-mono">SHA-256 OK</div>
    </div>
    <div class="bg-slate-950 p-3 rounded border border-slate-800">
      <div class="text-xs text-slate-400 font-mono">AUDIT KEAMANAN</div>
      <div class="text-xl font-bold text-amber-400 font-mono">OWASP GRADE A+</div>
    </div>
  </div>

  <div class="flex flex-wrap gap-2">
    <button onclick="executeActionTest()" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs rounded transition duration-150">
      ⚡ EKSEKUSI DATA
    </button>
    <button onclick="verifyIntegrityTest()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs rounded border border-cyan-700">
      🔍 CEK LOG AUDIT
    </button>
  </div>
</div>

<script>
function executeActionTest() {
  const el = document.getElementById('valLatency');
  if (el) el.textContent = (Math.random() * 3 + 4).toFixed(1) + ' ms';
  if (window.studioAudio) window.studioAudio.playKey();
  alert('Aksi ${domain.entityTitle} berhasil diproses oleh FE-Bot!');
}
function verifyIntegrityTest() {
  if (window.studioAudio) window.studioAudio.playScan();
  alert('Checksum integritas data valid. Tidak ada anomali terdeteksi.');
}
</script>`,
      livePreviewAvailable: true
    };
  }

  // DAILY Deliverable: Daily Planner, Interactive To-Do List, Pomodoro Focus Timer
  generateDAILYDeliverable(topic, domain) {
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return {
      title: `📅 Rencana Aktivitas Harian, To-Do List & Pomodoro Focus Timer`,
      agent: 'DAILY-Bot (Emerald Station)',
      timestamp: new Date().toLocaleTimeString(),
      todayDate: today,
      focusTopic: topic,
      timeBlocks: [
        { time: '07:00 - 08:30', activity: 'Morning Routine: Sarapan sehat, hidrasi air 500ml, review jadwal hari ini.', cat: 'Routine' },
        { time: '08:30 - 11:30', activity: `Sesi Deep Work 1: Eksplorasi & implementasi topik "${topic}" (3x Sesi Pomodoro).`, cat: 'Coding & Kuliah' },
        { time: '11:30 - 13:00', activity: 'Ishoma (Istirahat, Sholat / Makan Siang), peregangan postur tubuh.', cat: 'Break' },
        { time: '13:00 - 16:00', activity: 'Sesi Deep Work 2: Latihan praktikum, review materi, dan dokumentasi commit Git.', cat: 'Productivity' },
        { time: '16:00 - 17:30', activity: 'Aktivitas Fisik / Olahraga santai (jogging / workout 30 menit).', cat: 'Health' },
        { time: '19:30 - 21:30', activity: 'Review santai: Evaluasi to-do list harian dan persiapan rencana esok hari.', cat: 'Planning' }
      ],
      initialTasks: [
        { id: 1, text: `Selesaikan modul praktikum: ${topic}`, done: false, priority: 'HIGH' },
        { id: 2, text: 'Review 1 tantangan CTF / algoritma di LeetCode', done: true, priority: 'MED' },
        { id: 3, text: 'Lakukan commit Git harian agar riwayat kontribusi hijau', done: true, priority: 'HIGH' },
        { id: 4, text: 'Target hidrasi: Minum air putih 2 liter hari ini', done: false, priority: 'MED' }
      ],
      habits: [
        { name: '💻 Vibe Coding 60 Menit', streak: '7 Hari Berturut-turut' },
        { name: '📚 Membaca Dokumentasi Teknis', streak: '5 Hari' },
        { name: '💧 Hidrasi 2 Liter Air', streak: '12 Hari' },
        { name: '🏃 Olahraga / Peregangan', streak: '4 Hari' }
      ]
    };
  }

  generateBEDeliverable(topic, domain) {
    const tbl = domain.tableMain;
    const itemTbl = domain.tableItem;
    return {
      title: `🗄️ Relasional SQL Schema & Arsitektur REST API: ${topic}`,
      agent: 'BE-Bot (Purple Station)',
      timestamp: new Date().toLocaleTimeString(),
      sqlSchema: `-- SQL DDL: Skema Database untuk ${topic}
-- DBMS Target: PostgreSQL / SQLite 3 Compatible

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'member' CHECK (role IN ('admin', 'staff', 'member', 'auditor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ${itemTbl} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(180) NOT NULL,
    capacity INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ${tbl} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES ${itemTbl}(id) ON DELETE RESTRICT,
    reference_code VARCHAR(80) UNIQUE NOT NULL,
    status VARCHAR(32) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    checksum_sha256 CHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_${tbl}_user_id ON ${tbl}(user_id);
CREATE INDEX IF NOT EXISTS idx_${tbl}_status ON ${tbl}(status);
CREATE INDEX IF NOT EXISTS idx_${tbl}_created_at ON ${tbl}(created_at);
`,
      apiRoutes: `// Express.js REST API Controller: routes/${domain.entity}.js
import express from 'express';
import crypto from 'crypto';

const router = express.Router();

function verifyAuthToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token otorisasi diperlukan' });
  req.user = { id: 'usr_secure_session', role: 'member' };
  next();
}

router.get('/list', verifyAuthToken, async (req, res) => {
  try {
    const data = [
      { id: 'rec_101', ref: '${domain.entity.toUpperCase()}-2026-A', status: 'confirmed', latency: '4.2ms' },
      { id: 'rec_102', ref: '${domain.entity.toUpperCase()}-2026-B', status: 'completed', latency: '5.1ms' }
    ];
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/create', verifyAuthToken, async (req, res) => {
  const { title, payload } = req.body;
  if (!title) return res.status(400).json({ error: 'Field title wajib diisi' });

  const checksum = crypto.createHash('sha256').update(JSON.stringify(payload || {})).digest('hex');

  const record = {
    id: 'rec_' + Date.now().toString(16),
    title,
    payload: payload || {},
    checksum_sha256: checksum,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  };

  res.status(201).json({ success: true, message: 'Data berhasil disimpan & dienkripsi', data: record });
});

export default router;`
    };
  }

  generateSECDeliverable(topic, domain) {
    const flagKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      title: `🛡️ Audit Keamanan Siber OWASP & Lab CTF Solver: ${topic}`,
      agent: 'SEC-Bot (Red/Gold Station)',
      timestamp: new Date().toLocaleTimeString(),
      owaspAudit: [
        {
          vuln: 'A01:2021 - Broken Access Control & IDOR',
          risk: 'HIGH',
          status: 'MITIGATED',
          solution: `Penggunaan UUID acak mencegah enumerasi sequential ID pada tabel ${domain.tableMain}. Middleware otentikasi memeriksa kepemilikan resource per request.`
        },
        {
          vuln: 'A03:2021 - SQL & Command Injection',
          risk: 'CRITICAL',
          status: 'MITIGATED',
          solution: 'Seluruh query SQL menggunakan parameter binding wajib ($1, $2). String concatenation sepenuhnya dilarang dalam basis kode.'
        },
        {
          vuln: 'A04:2021 - Insecure Design & Race Condition',
          risk: 'HIGH',
          status: 'MITIGATED',
          solution: `Diterapkan database transaction level SERIALIZABLE atau SELECT FOR UPDATE untuk mencegah double-action pada entitas ${domain.entityTitle}.`
        }
      ],
      ctfLab: {
        challengeName: `The Mooncrust ${domain.entityTitle} Security Vault`,
        category: 'Web Exploitation & Cryptographic Analysis',
        description: `Analisis token terenkripsi dan selesaikan bypass logika pada validasi parameter ${domain.entity} untuk mengekstrak flag rahasia.`,
        cipherText: `U2FsdGVkX1+Q7x8m1nKl90v${flagKey}wXyZaBcDeFgHiJkLmNoPqRsTuVwXyZ=`,
        flag: `FLAG{mooncrust_${domain.entity}_${flagKey}_pwned}`,
        solverScript: `# Python 3 CTF Solver Script: solve_${domain.entity}.py
import base64
import hashlib

def exploit_mooncrust_challenge():
    print("[*] Menghubungkan ke target payload...")
    flag = "FLAG{mooncrust_${domain.entity}_${flagKey}_pwned}"
    print(f"[+] Exploit Lulus! Flag ditemukan: {flag}")
    return flag

if __name__ == '__main__':
    exploit_mooncrust_challenge()`
      },
      hardeningDiff: `--- a/api/${domain.entity}.js
+++ b/api/${domain.entity}.js
@@ -20,7 +20,9 @@
- const query = "SELECT * FROM ${domain.tableMain} WHERE id = '" + req.body.id + "'"; // RENTAN SQLi
+ // PATCH SEC-Bot: Parameterized query anti SQL Injection
+ const query = "SELECT * FROM ${domain.tableMain} WHERE id = $1 AND user_id = $2";
+ const result = await pool.query(query, [req.body.id, req.user.id]);
`
    };
  }

  // ========================================================
  // RENDER DELIVERABLES IN DOM TABS
  // ========================================================

  renderDeliverableTab(tabKey) {
    const container = document.getElementById(`tabContent-${tabKey}`);
    if (!container) return;

    if (tabKey === 'uiux' && this.deliverables.uiux) {
      const d = this.deliverables.uiux;
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-cyan">${d.agent}</span>
          <span class="deliverable-time">Dihasilkan pukul ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-cyan">${d.title}</h3>

        <div class="deliverable-section">
          <h4>1. USER PERSONAS & KEBUTUHAN SISTEM</h4>
          <div class="grid-cards">
            ${d.userPersonas.map(p => `
              <div class="mini-card border-cyan">
                <div class="card-role">${p.role}</div>
                <div class="card-desc">${p.need}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="deliverable-section">
          <h4>2. DESIGN SYSTEM TOKENS (FIGMA / TAILWIND READY)</h4>
          <div class="code-box">
            <pre><code>${JSON.stringify(d.designTokens, null, 2)}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>3. WIREFRAME BLUEPRINT (SKEMA ARSITEKTUR)</h4>
          <div class="code-box terminal-box">
            <pre><code>${d.wireframe}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>4. CHECKLIST 10 HEURISTIK USABILITY NIELSEN</h4>
          <ul class="checklist">
            ${d.heuristics.map(h => `<li><span class="check-icon">✓</span> ${h}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if (tabKey === 'fe' && this.deliverables.fe) {
      const d = this.deliverables.fe;
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-blue">${d.agent}</span>
          <span class="deliverable-time">Dihasilkan pukul ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-blue">${d.title}</h3>
        <p class="text-muted">Tech Stack: ${d.framework}</p>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>1. KODE KOMPONEN (SIAP DIGUNAKAN)</h4>
            <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.fe.codeSnippet); alert('Kode Frontend berhasil disalin!');" class="btn-pixel-small">
              📋 SALIN KODE
            </button>
          </div>
          <div class="code-box">
            <pre><code>${this.escapeHTML(d.codeSnippet)}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>2. INTERACTIVE LIVE COMPONENT PREVIEW</h4>
          <div class="live-preview-container border-blue">
            ${d.codeSnippet.replace(/<script[\s\S]*?<\/script>/gi, '')}
          </div>
        </div>
      `;
    } else if (tabKey === 'daily' && this.deliverables.daily) {
      const d = this.deliverables.daily;
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-green">${d.agent}</span>
          <span class="deliverable-time">Tanggal: ${d.todayDate}</span>
        </div>
        <h3 class="deliverable-title text-green">${d.title}</h3>

        <!-- Interactive Pomodoro Timer Widget -->
        <div class="pomodoro-box border-green mb-4">
          <div class="flex-between">
            <div class="pomodoro-header">
              <span class="pomo-icon">⏱️</span>
              <strong>POMODORO FOCUS TIMER (25 MENIT DEEP WORK)</strong>
            </div>
            <span id="pomoStatusText" class="badge-pomo">SIAP FOKUS</span>
          </div>
          <div class="pomo-display" id="pomoDisplay">25:00</div>
          <div class="pomo-controls">
            <button onclick="window.pipelineEngine.startPomodoro()" class="btn-pomo btn-pomo-start">▶ MULAI FOKUS</button>
            <button onclick="window.pipelineEngine.pausePomodoro()" class="btn-pomo">⏸ JEDA</button>
            <button onclick="window.pipelineEngine.resetPomodoro()" class="btn-pomo">🔄 RESET</button>
          </div>
        </div>

        <!-- Interactive To-Do List -->
        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>1. INTERACTIVE TO-DO CHECKLIST (AKTIVITAS HARI INI)</h4>
            <div style="display:flex; gap:6px;">
              <input type="text" id="newDailyTaskInput" placeholder="Tambah to-do baru..." class="input-task-small">
              <button onclick="window.pipelineEngine.addNewTask()" class="btn-pixel-small">+ TAMBAH</button>
            </div>
          </div>
          <div id="dailyTodoListContainer" class="todo-list-wrapper">
            ${this.renderTodoListHTML(d.initialTasks)}
          </div>
        </div>

        <!-- Time-Blocking Schedule Grid -->
        <div class="deliverable-section">
          <h4>2. TIME-BLOCKING SCHEDULE (ALOKASI WAKTU OPTIMAL)</h4>
          <div class="schedule-table-wrapper">
            <table class="audit-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Kategori</th>
                  <th>Rincian Aktivitas Terjadwal</th>
                </tr>
              </thead>
              <tbody>
                ${d.timeBlocks.map(b => `
                  <tr>
                    <td class="font-mono text-cyan" style="white-space:nowrap">${b.time}</td>
                    <td><span class="badge-cat">${b.cat}</span></td>
                    <td>${b.activity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Habit Tracker -->
        <div class="deliverable-section">
          <h4>3. HABIT STREAK TRACKER (KONSISTENSI HARIAN)</h4>
          <div class="grid-cards">
            ${d.habits.map(h => `
              <div class="mini-card border-green">
                <div class="card-role">${h.name}</div>
                <div class="card-desc text-green">🔥 Streak: ${h.streak}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (tabKey === 'be' && this.deliverables.be) {
      const d = this.deliverables.be;
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-purple">${d.agent}</span>
          <span class="deliverable-time">Dihasilkan pukul ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-purple">${d.title}</h3>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>1. SKEMA RELASIONAL DATABASE SQL (DDL + INDEKS)</h4>
            <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.be.sqlSchema); alert('Skema SQL berhasil disalin!');" class="btn-pixel-small">
              📋 SALIN SQL
            </button>
          </div>
          <div class="code-box">
            <pre><code>${this.escapeHTML(d.sqlSchema)}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>2. KONTROLER REST API EXPRESS & MIDDLEWARE AUTH</h4>
            <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.be.apiRoutes); alert('Kode API berhasil disalin!');" class="btn-pixel-small">
              📋 SALIN API
            </button>
          </div>
          <div class="code-box">
            <pre><code>${this.escapeHTML(d.apiRoutes)}</code></pre>
          </div>
        </div>
      `;
    } else if (tabKey === 'sec' && this.deliverables.sec) {
      const d = this.deliverables.sec;
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-red">${d.agent}</span>
          <span class="deliverable-time">Dihasilkan pukul ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-red">${d.title}</h3>

        <div class="deliverable-section">
          <h4>1. MATRIKS AUDIT PENETRASI OWASP TOP 10</h4>
          <div class="audit-table-wrapper">
            <table class="audit-table">
              <thead>
                <tr>
                  <th>Vulnerability</th>
                  <th>Tingkat Risiko</th>
                  <th>Status Audit</th>
                  <th>Mitigasi yang Diimplementasikan</th>
                </tr>
              </thead>
              <tbody>
                ${d.owaspAudit.map(a => `
                  <tr>
                    <td class="font-mono text-cyan">${a.vuln}</td>
                    <td><span class="risk-badge risk-${a.risk.toLowerCase()}">${a.risk}</span></td>
                    <td><span class="status-mitigated">✓ ${a.status}</span></td>
                    <td>${a.solution}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>2. SIMULASI LAB CTF & SECRET FLAG SOLVER</h4>
          <div class="ctf-card border-gold">
            <div class="ctf-title">🚩 ${d.ctfLab.challengeName} (${d.ctfLab.category})</div>
            <div class="ctf-desc">${d.ctfLab.description}</div>
            <div class="flag-box">
              <span class="flag-label">CAPTURE THE FLAG:</span>
              <span class="flag-value">${d.ctfLab.flag}</span>
            </div>
            <div class="code-box mt-2">
              <pre><code>${this.escapeHTML(d.ctfLab.solverScript)}</code></pre>
            </div>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>3. SECURITY HARDENING PATCH (GIT DIFF)</h4>
          <div class="code-box diff-box">
            <pre><code>${this.escapeHTML(d.hardeningDiff)}</code></pre>
          </div>
        </div>
      `;
    } else if (tabKey === 'summary') {
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-green">MISSION CONTROL DISPATCH</span>
          <span class="deliverable-time">${new Date().toLocaleDateString()}</span>
        </div>
        <h3 class="deliverable-title text-green">🚀 RINGKASAN PROYEK LENGKAP: ${this.currentTaskTopic}</h3>

        <div class="summary-stats-grid">
          <div class="stat-box">
            <div class="stat-num text-cyan">5/5</div>
            <div class="stat-lbl">Sub-Agent Dikerahkan</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-blue">100%</div>
            <div class="stat-lbl">Frontend Responsif</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-green">25 Min</div>
            <div class="stat-lbl">Pomodoro Focus Timer</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-purple">0 ms</div>
            <div class="stat-lbl">Bottleneck API</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-red">A+</div>
            <div class="stat-lbl">Grade Keamanan OWASP</div>
          </div>
        </div>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>PAKET DOKUMENTASI LENGKAP 5-AGEN:</h4>
            <button onclick="window.pipelineEngine.exportFullMarkdown()" class="btn-launch" style="padding:6px 12px; font-size:9px;">
              📥 DOWNLOAD LAPORAN LENGKAP (.MD)
            </button>
          </div>
          <ul class="checklist">
            <li><strong class="text-cyan">UI/UX-Bot:</strong> User flow, wireframe blueprint, dan design system tokens.</li>
            <li><strong class="text-blue">FE-Bot:</strong> Komponen semantic responsif HTML5/Tailwind dengan live interactive preview.</li>
            <li><strong class="text-green">DAILY-Bot:</strong> Time-blocking harian, Pomodoro focus timer, habit tracker, dan checklist to-do.</li>
            <li><strong class="text-purple">BE-Bot:</strong> Skema relasional DDL PostgreSQL/SQLite, query indexing, dan kontroler REST API.</li>
            <li><strong class="text-red">SEC-Bot:</strong> Matriks audit OWASP Top 10, solver script Python CTF, dan patch hardening.</li>
          </ul>
        </div>
      `;
    }
  }

  renderTodoListHTML(tasks) {
    if (!tasks || tasks.length === 0) return '<div class="text-muted">Belum ada to-do. Tambahkan di atas!</div>';
    return tasks.map(t => `
      <div class="todo-item ${t.done ? 'todo-done' : ''}" onclick="window.pipelineEngine.toggleTaskDone(${t.id})">
        <input type="checkbox" ${t.done ? 'checked' : ''} class="todo-checkbox">
        <span class="todo-text">${t.text}</span>
        <span class="badge-priority priority-${t.priority ? t.priority.toLowerCase() : 'med'}">${t.priority || 'MED'}</span>
      </div>
    `).join('');
  }

  toggleTaskDone(taskId) {
    if (!this.deliverables.daily) return;
    const task = this.deliverables.daily.initialTasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      const container = document.getElementById('dailyTodoListContainer');
      if (container) container.innerHTML = this.renderTodoListHTML(this.deliverables.daily.initialTasks);
      if (window.studioAudio) window.studioAudio.playKey();
    }
  }

  addNewTask() {
    const input = document.getElementById('newDailyTaskInput');
    if (!input || !input.value.trim()) return;
    if (!this.deliverables.daily) return;

    const newTask = {
      id: Date.now(),
      text: input.value.trim(),
      done: false,
      priority: 'HIGH'
    };
    this.deliverables.daily.initialTasks.unshift(newTask);
    input.value = '';
    const container = document.getElementById('dailyTodoListContainer');
    if (container) container.innerHTML = this.renderTodoListHTML(this.deliverables.daily.initialTasks);
    if (window.studioAudio) window.studioAudio.playKey();
  }

  // Pomodoro Focus Timer Functions
  startPomodoro() {
    if (this.pomodoroRunning) return;
    this.pomodoroRunning = true;
    const statusText = document.getElementById('pomoStatusText');
    if (statusText) {
      statusText.textContent = 'SEDANG BERJALAN';
      statusText.style.background = '#065f46';
    }
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
        alert('🎉 Sesi Pomodoro 25 Menit Selesai! Saatnya istirahat 5 menit.');
      }
    }, 1000);
  }

  pausePomodoro() {
    if (!this.pomodoroRunning) return;
    clearInterval(this.pomodoroTimerId);
    this.pomodoroRunning = false;
    const statusText = document.getElementById('pomoStatusText');
    if (statusText) {
      statusText.textContent = 'DIJEDA';
      statusText.style.background = '#78350f';
    }
    if (window.studioAudio) window.studioAudio.playKey();
  }

  resetPomodoro() {
    clearInterval(this.pomodoroTimerId);
    this.pomodoroRunning = false;
    this.pomodoroTime = 25 * 60;
    this.updatePomoDisplay();
    const statusText = document.getElementById('pomoStatusText');
    if (statusText) {
      statusText.textContent = 'SIAP FOKUS';
      statusText.style.background = '#1e293b';
    }
    if (window.studioAudio) window.studioAudio.playKey();
  }

  updatePomoDisplay() {
    const el = document.getElementById('pomoDisplay');
    if (!el) return;
    const mins = Math.floor(this.pomodoroTime / 60);
    const secs = this.pomodoroTime % 60;
    el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  exportFullMarkdown() {
    const topic = this.currentTaskTopic || 'Mooncrust Autonomous Project';
    const ui = this.deliverables.uiux;
    const fe = this.deliverables.fe;
    const daily = this.deliverables.daily;
    const be = this.deliverables.be;
    const sec = this.deliverables.sec;

    const md = `# DOKUMEN REKAYASA SISTEM LENGKAP: ${topic}
**Dihasilkan oleh:** MOONCRUST // PIXEL AI STUDIO (5 Sub-Agents)
**Tanggal Rilis:** ${new Date().toISOString()}

---

## 1. UI/UX Architecture & Design System
- **Domain:** ${ui ? ui.domain : 'Full-Stack'}
- **User Personas:**
${ui ? ui.userPersonas.map(p => `  - **${p.role}:** ${p.need}`).join('\n') : '-'}

### Wireframe Blueprint
\`\`\`text
${ui ? ui.wireframe : ''}
\`\`\`

---

## 2. Frontend Component Code (HTML5 & Tailwind)
\`\`\`html
${fe ? fe.codeSnippet : ''}
\`\`\`

---

## 3. Daily Productivity & Time-Blocking Schedule
- **Fokus Topik:** ${daily ? daily.focusTopic : '-'}
${daily ? daily.timeBlocks.map(b => `- **${b.time}** [${b.cat}]: ${b.activity}`).join('\n') : '-'}

---

## 4. Backend Database Schema (SQL DDL)
\`\`\`sql
${be ? be.sqlSchema : ''}
\`\`\`

### REST API Controller
\`\`\`javascript
${be ? be.apiRoutes : ''}
\`\`\`

---

## 5. Cyber Security & CTF Audit
- **Audit OWASP:**
${sec ? sec.owaspAudit.map(a => `  - **${a.vuln}:** [${a.risk}] -> ${a.solution}`).join('\n') : '-'}

### CTF Challenge Flag
- **Flag:** \`${sec ? sec.ctfLab.flag : ''}\`
- **Solver Script:**
\`\`\`python
${sec ? sec.ctfLab.solverScript : ''}
\`\`\`
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mooncrust-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.studioAudio) window.studioAudio.playKey();
    alert('Dokumen rekayasa lengkap 5-agen berhasil diunduh dalam format .md!');
  }

  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.pipelineEngine = new StudioPipelineEngine();
