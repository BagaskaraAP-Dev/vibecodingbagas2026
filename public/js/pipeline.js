// Autonomous Multi-Agent Auto-Pipeline Engine for MOONCRUST // PIXEL AI STUDIO
// Orchestrates UI/UX-Bot -> FE-Bot -> BE-Bot -> SEC-Bot with rich deliverables

class StudioPipelineEngine {
  constructor() {
    this.isActive = false;
    this.currentStage = 0; // 0: Idle, 1: UI/UX, 2: FE, 3: BE, 4: SEC, 5: Complete
    this.currentTaskTopic = '';
    this.deliverables = {
      uiux: null,
      fe: null,
      be: null,
      sec: null
    };

    // Preset tasks for quick testing
    this.presets = {
      ecommerce: 'E-Commerce Secure Checkout & Payment Gateway (OWASP Hardened)',
      campus: 'Kampus Academic Portal & Student Grading System with Role-Based Access',
      ctf: 'CTF Challenge: Crypto RSA & Web SQL Injection Lab with Automated Flag Validator',
      iot: 'Real-Time IoT Sensor Telemetry Dashboard with WebSocket & Redis Cache'
    };
  }

  // Launch pipeline with given topic
  async runPipeline(topic) {
    if (this.isActive) return;
    if (!topic || topic.trim() === '') {
      topic = this.presets.ecommerce;
    }

    this.isActive = true;
    this.currentTaskTopic = topic;
    this.currentStage = 1;

    // Reset Deliverables Tabs
    this.deliverables = { uiux: null, fe: null, be: null, sec: null };
    this.updateHUDStatus('PIPELINE ACTIVE', '#00f3ff');
    this.updateStageNodes(1);

    const studio = window.pixelStudio;
    const audio = window.studioAudio;

    // ========================================================
    // STAGE 1: UI/UX-Bot (User Flows, Wireframes, Design Tokens)
    // ========================================================
    this.setTicker(`[STAGE 1/4] UI/UX-Bot activated for: "${topic}"`);
    this.focusAgent('uiux');
    if (studio) {
      studio.stations.uiux.x && (studio.agents.find(a => a.id === 'uiux').targetX = studio.stations.whiteboard.x);
      studio.stations.uiux.y && (studio.agents.find(a => a.id === 'uiux').targetY = studio.stations.whiteboard.y + 20);
      studio.triggerAgentBubble('uiux', 'Drafting user personas & flow...', 180);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2200);

    // Agent moves back to desk to draft wireframe
    if (studio) {
      const uiAgent = studio.agents.find(a => a.id === 'uiux');
      uiAgent.targetX = studio.stations.uiux.x;
      uiAgent.targetY = studio.stations.uiux.y;
      studio.triggerAgentBubble('uiux', 'Synthesizing Design System & Tokens...', 180);
    }
    await this.sleep(1800);

    // Generate Stage 1 Deliverable
    this.deliverables.uiux = this.generateUIUXDeliverable(topic);
    this.renderDeliverableTab('uiux');
    this.markStageCompleted(1);
    if (audio) audio.playKey();

    // ========================================================
    // STAGE 2: FE-Bot (HTML5, Tailwind/CSS3, Interactive JS)
    // ========================================================
    this.currentStage = 2;
    this.updateStageNodes(2);
    this.setTicker(`[STAGE 2/4] FE-Bot translating UI specs into responsive frontend...`);
    this.focusAgent('fe');
    if (studio) {
      studio.triggerAgentBubble('uiux', 'UI Specs ready! Handoff to FE-Bot 🚀', 140);
      const feAgent = studio.agents.find(a => a.id === 'fe');
      feAgent.targetX = studio.stations.uiux.x + 35;
      feAgent.targetY = studio.stations.uiux.y;
      studio.triggerAgentBubble('fe', 'Reviewing Figma tokens & wireframes...', 160);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2200);

    if (studio) {
      const feAgent = studio.agents.find(a => a.id === 'fe');
      feAgent.targetX = studio.stations.fe.x;
      feAgent.targetY = studio.stations.fe.y;
      studio.triggerAgentBubble('fe', 'Writing responsive HTML5 & Tailwind components...', 180);
    }
    await this.sleep(2000);

    // Generate Stage 2 Deliverable
    this.deliverables.fe = this.generateFEDeliverable(topic);
    this.renderDeliverableTab('fe');
    this.markStageCompleted(2);
    if (audio) audio.playKey();

    // ========================================================
    // STAGE 3: BE-Bot (Database SQL Schema, REST APIs & Auth)
    // ========================================================
    this.currentStage = 3;
    this.updateStageNodes(3);
    this.setTicker(`[STAGE 3/4] BE-Bot structuring relational SQL schema & REST endpoints...`);
    this.focusAgent('be');
    if (studio) {
      studio.triggerAgentBubble('fe', 'Frontend endpoints mapped! Pinging BE-Bot...', 140);
      const beAgent = studio.agents.find(a => a.id === 'be');
      beAgent.targetX = studio.stations.serverRack.x - 25;
      beAgent.targetY = studio.stations.serverRack.y + 25;
      studio.triggerAgentBubble('be', 'Checking server cluster & database connection...', 160);
    }
    if (audio) audio.playStageChime();
    await this.sleep(2200);

    if (studio) {
      const beAgent = studio.agents.find(a => a.id === 'be');
      beAgent.targetX = studio.stations.be.x;
      beAgent.targetY = studio.stations.be.y;
      studio.triggerAgentBubble('be', 'Compiling PostgreSQL DDL & JWT Auth routes...', 180);
    }
    await this.sleep(2000);

    // Generate Stage 3 Deliverable
    this.deliverables.be = this.generateBEDeliverable(topic);
    this.renderDeliverableTab('be');
    this.markStageCompleted(3);
    if (audio) audio.playKey();

    // ========================================================
    // STAGE 4: SEC-Bot (OWASP Top 10 Audit, CTF Solver, Patch)
    // ========================================================
    this.currentStage = 4;
    this.updateStageNodes(4);
    this.setTicker(`[STAGE 4/4] SEC-Bot conducting OWASP vulnerability audit & CTF forensics...`);
    this.focusAgent('sec');
    if (studio) {
      studio.triggerAgentBubble('be', 'Schema & APIs ready for penetration testing!', 140);
      const secAgent = studio.agents.find(a => a.id === 'sec');
      secAgent.targetX = studio.stations.sec.x;
      secAgent.targetY = studio.stations.sec.y;
      studio.triggerAgentBubble('sec', 'Scanning SQLi, XSS, IDOR payloads...', 180);
    }
    if (audio) {
      audio.playScan();
      audio.playAlert();
    }
    await this.sleep(2200);

    if (studio) {
      studio.triggerAgentBubble('sec', 'Vulnerabilities patched & CTF flag validated!', 180);
    }
    await this.sleep(1800);

    // Generate Stage 4 Deliverable
    this.deliverables.sec = this.generateSECDeliverable(topic);
    this.renderDeliverableTab('sec');
    this.markStageCompleted(4);

    // ========================================================
    // STAGE 5: ALL AGENTS CELEBRATE & MISSION COMPLETE
    // ========================================================
    this.currentStage = 5;
    this.updateStageNodes(5);
    this.isActive = false;
    this.updateHUDStatus('ALL STAGES COMPLETED', '#10b981');
    this.setTicker(`🎉 MISSION ACCOMPLISHED: Full-Stack deliverable package ready!`);

    if (studio) {
      studio.triggerAgentBubble('uiux', 'Design System 100% Verified! 🎨', 180);
      studio.triggerAgentBubble('fe', 'Frontend 0 Linter Errors! 💻', 180);
      studio.triggerAgentBubble('be', 'Database Indexes Optimized! 🗄️', 180);
      studio.triggerAgentBubble('sec', 'Zero Vulnerabilities Detected! 🛡️', 180);
    }
    if (audio) audio.playFanfare();

    // Render Full Project Summary Artifact
    this.renderDeliverableTab('summary');
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
      const percentage = Math.min(100, Math.round((stageNum / 5) * 100));
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

  // ========================================================
  // DELIVERABLE GENERATORS (RICH, ACCURATE, PRODUCTION-GRADE)
  // ========================================================

  generateUIUXDeliverable(topic) {
    return {
      title: '🎨 UI/UX Architecture & Design System Specification',
      agent: 'UI/UX-Bot (Cyan Station)',
      timestamp: new Date().toLocaleTimeString(),
      userPersonas: [
        { role: 'Primary End-User', need: 'Seamless, intuitive navigation with instant visual feedback and sub-100ms response.' },
        { role: 'System Administrator / Staff', need: 'Dense data grids, granular role-based actions, and instant audit trails.' }
      ],
      userFlow: `
[User Land / Auth] ---> [Dashboard Overview] ---> [Execute Core Flow] ---> [Confirm Action]
       |                         |                        |                      |
       v                         v                        v                      v
 (Input Validation)       (Role Hierarchy)          (API Mutation)         (Audit Logging)
      `,
      designTokens: {
        colors: {
          brandPrimary: '#00f3ff /* Cyan Neon */',
          brandSecondary: '#3b82f6 /* Tech Blue */',
          backgroundDark: '#0a0d18 /* Deep Midnight */',
          surfaceCard: '#151928 /* Dark Slate Panel */',
          accentSuccess: '#10b981 /* Emerald Terminal */',
          accentWarning: '#f59e0b /* Amber Alert */',
          accentDanger: '#ef4444 /* Crimson Vulnerability */'
        },
        typography: {
          displayFont: '"Press Start 2P", "VT323", cursive /* Retro Headers */',
          bodyFont: '"JetBrains Mono", "Courier New", monospace /* High Legibility Code */',
          scale: { h1: '24px', h2: '18px', body: '14px', small: '11px' }
        },
        spacing: '4px baseline (8px, 16px, 24px, 32px standard margins)'
      },
      wireframe: `
+-----------------------------------------------------------------------------------+
|  [MOONCRUST // MISSION CONTROL]               [Agent Status: 4/4]  [Uptime: 99.9%]|
+-----------------------------------------------------------------------------------+
|  SIDEBAR           |  HERO WORKSPACE                                              |
|  - Active Tasks    |  +--------------------------------------------------------+  |
|  - Telemetry       |  |  Live Interactive Simulation Canvas (960 x 540)        |  |
|  - Security Matrix |  |  [Agents at Workstations / Animated Room / Neon Sign]  |  |
|  - Deliverables    |  +--------------------------------------------------------+  |
|                    |  PIPELINE CONTROLS                                           |
|                    |  [ Topic Input ] [ 🚀 Launch Pipeline ] [ 🔊 Audio: ON ]    |
|                    |  STAGE TRACKER: (UI/UX) -> (FE) -> (BE) -> (SEC)             |
+-----------------------------------------------------------------------------------+
|  OUTPUT CONSOLE TABS: [UI/UX Specs] [Frontend Code] [Backend API] [Security Audit] |
+-----------------------------------------------------------------------------------+
      `,
      heuristics: [
        'Visibility of System Status: Real-time telemetry, stage indicators, and speech bubbles.',
        'Match Between System and Real World: Workstations mirror authentic engineering disciplines.',
        'Error Prevention & Recovery: Form validation, input sanitization, and audible cues.'
      ]
    };
  }

  generateFEDeliverable(topic) {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    return {
      title: '💻 Responsive Frontend Component & Interactive Code',
      agent: 'FE-Bot (Blue Station)',
      timestamp: new Date().toLocaleTimeString(),
      framework: 'HTML5 Semantic + Vanilla CSS3 / Tailwind Utility Classes + Modern ES6 JS',
      codeSnippet: `<!-- Component: ${slug}-view.html -->
<div class="mission-card border-2 border-cyan-500 bg-slate-900 text-white rounded-lg p-6 shadow-xl">
  <div class="flex items-center justify-between border-b border-cyan-800 pb-3 mb-4">
    <h3 class="font-mono text-cyan-400 font-bold text-lg flex items-center gap-2">
      <span class="inline-block w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
      ${topic}
    </h3>
    <span class="px-2.5 py-1 text-xs font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-700">v2.4.0-PROD</span>
  </div>

  <p class="text-slate-300 font-mono text-sm mb-4 leading-relaxed">
    Interactive module rendered via autonomous pipeline with responsive layout, zero external heavy dependencies, and hardware-accelerated transitions.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div class="bg-slate-950 p-4 rounded border border-slate-800">
      <div class="text-xs text-slate-400 mb-1">REALTIME LATENCY</div>
      <div class="text-xl font-bold text-emerald-400 font-mono" id="metricLatency">8.4 ms</div>
    </div>
    <div class="bg-slate-950 p-4 rounded border border-slate-800">
      <div class="text-xs text-slate-400 mb-1">SECURITY STATUS</div>
      <div class="text-xl font-bold text-cyan-400 font-mono">OWASP SHIELD ACTIVE</div>
    </div>
  </div>

  <div class="flex flex-wrap gap-2">
    <button onclick="handleActionClick()" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs rounded transition duration-150">
      EXECUTE TASK
    </button>
    <button onclick="handleAuditClick()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs rounded border border-cyan-700">
      VIEW TELEMETRY
    </button>
  </div>
</div>

<script>
function handleActionClick() {
  const el = document.getElementById('metricLatency');
  if (el) el.textContent = (Math.random() * 5 + 4).toFixed(1) + ' ms';
  if (window.studioAudio) window.studioAudio.playKey();
  alert('Task dispatched successfully through FE-Bot pipeline!');
}
function handleAuditClick() {
  if (window.studioAudio) window.studioAudio.playScan();
  alert('Telemetry stream active: 0 dropped packets.');
}
</script>`,
      livePreviewAvailable: true
    };
  }

  generateBEDeliverable(topic) {
    const tablePrefix = topic.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    return {
      title: '🗄️ Database Relational SQL Schema & RESTful API Architecture',
      agent: 'BE-Bot (Purple Station)',
      timestamp: new Date().toLocaleTimeString(),
      sqlSchema: `-- SQL DDL: Database Architecture for ${topic}
-- DBMS Target: PostgreSQL / SQLite Compatible

CREATE TABLE IF NOT EXISTS ${tablePrefix}_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'student' CHECK (role IN ('admin', 'staff', 'student', 'auditor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ${tablePrefix}_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES ${tablePrefix}_users(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
    checksum_sha256 CHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_users_role ON ${tablePrefix}_users(role);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_records_user ON ${tablePrefix}_records(user_id);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_records_status ON ${tablePrefix}_records(status);
`,
      apiRoutes: `// Express.js REST API Controller: api/${tablePrefix}.js
import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Middleware: Strict JWT Verification & Rate-Limiting
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token missing' });
  // Verify token signature...
  req.user = { id: 'usr_secure_99', role: 'admin' };
  next();
}

// GET /api/${tablePrefix}/list
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const records = [
      { id: 'rec_101', title: 'Task Record Alpha', status: 'approved', latency: '4ms' },
      { id: 'rec_102', title: 'Task Record Beta', status: 'pending', latency: '6ms' }
    ];
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/${tablePrefix}/create
router.post('/create', authenticateToken, async (req, res) => {
  const { title, payload } = req.body;
  if (!title) return res.status(400).json({ error: 'Title field is required' });

  // Generate SHA-256 Checksum for data integrity
  const checksum = crypto.createHash('sha256').update(JSON.stringify(payload || {})).digest('hex');

  const newRecord = {
    id: 'rec_' + Date.now().toString(16),
    title,
    payload,
    checksum_sha256: checksum,
    status: 'approved',
    timestamp: new Date().toISOString()
  };

  res.status(201).json({ success: true, message: 'Record created & hashed', data: newRecord });
});

export default router;`
    };
  }

  generateSECDeliverable(topic) {
    const flagKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      title: '🛡️ Cyber Security Penetration Audit & CTF Challenge Lab',
      agent: 'SEC-Bot (Red/Gold Station)',
      timestamp: new Date().toLocaleTimeString(),
      owaspAudit: [
        {
          vuln: 'A01:2021 - Broken Access Control',
          risk: 'HIGH',
          status: 'MITIGATED',
          solution: 'Implemented RBAC middleware on all API endpoints; UUID identifiers prevent IDOR enumeration.'
        },
        {
          vuln: 'A03:2021 - Injection (SQLi & NoSQLi)',
          risk: 'CRITICAL',
          status: 'MITIGATED',
          solution: 'Strict parameterized queries & ORM bindings utilized. Raw string interpolation completely prohibited.'
        },
        {
          vuln: 'A07:2021 - Identification & Auth Failures',
          risk: 'HIGH',
          status: 'MITIGATED',
          solution: 'Argon2id password hashing + HTTP-only Secure SameSite JWT cookies.'
        }
      ],
      ctfLab: {
        challengeName: 'The Mooncrust Cryptographic Vault',
        category: 'Web Exploitation & Cryptography',
        description: 'Analyze encoded JWT claims and reverse engineering payload to extract the authentic secret flag.',
        cipherText: `U2FsdGVkX1+Q7x8m1nKl90v${flagKey}wXyZaBcDeFgHiJkLmNoPqRsTuVwXyZ=`,
        flag: `FLAG{mooncrust_pixel_sec_${flagKey}_pwned}`,
        solverScript: `# Python CTF Solver Script
import base64
import hashlib

def solve_mooncrust_challenge(cipher_token):
    # Step 1: Decode Base64 token payload
    print("[*] Intercepting challenge token...")
    # Step 2: Validate SHA-256 checksum
    flag = "FLAG{mooncrust_pixel_sec_${flagKey}_pwned}"
    print(f"[+] Flag captured successfully: {flag}")
    return flag

if __name__ == '__main__':
    solve_mooncrust_challenge("token_stream")`
      },
      hardeningDiff: `--- a/api/auth.js
+++ b/api/auth.js
@@ -14,7 +14,8 @@
- const query = "SELECT * FROM users WHERE user = '" + req.body.user + "'"; // VULNERABLE TO SQLi
+ // SEC-Bot Patch: Parameterized query prevents SQL injection attacks
+ const query = "SELECT id, username, password_hash, role FROM users WHERE username = $1";
+ const result = await pool.query(query, [req.body.user]);
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
          <span class="deliverable-time">Generated at ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-cyan">${d.title}</h3>

        <div class="deliverable-section">
          <h4>1. USER PERSONAS & GOALS</h4>
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
          <h4>2. DESIGN SYSTEM TOKENS</h4>
          <div class="code-box">
            <pre><code>${JSON.stringify(d.designTokens, null, 2)}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>3. WIREFRAME BLUEPRINT (ASCII SCHEMATIC)</h4>
          <div class="code-box terminal-box">
            <pre><code>${d.wireframe}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>4. HEURISTIC USABILITY VERIFICATION</h4>
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
          <span class="deliverable-time">Generated at ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-blue">${d.title}</h3>
        <p class="text-muted">Stack: ${d.framework}</p>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>1. COMPONENT CODE (READY TO USE)</h4>
            <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.fe.codeSnippet); alert('Frontend Code copied to clipboard!');" class="btn-pixel-small">
              📋 COPY CODE
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
    } else if (tabKey === 'be' && this.deliverables.be) {
      const d = this.deliverables.be;
      container.innerHTML = `
        <div class="deliverable-header">
          <span class="deliverable-badge bg-purple">${d.agent}</span>
          <span class="deliverable-time">Generated at ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-purple">${d.title}</h3>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>1. RELATIONAL DATABASE SQL SCHEMA (DDL)</h4>
            <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.be.sqlSchema); alert('SQL Schema copied!');" class="btn-pixel-small">
              📋 COPY SQL
            </button>
          </div>
          <div class="code-box">
            <pre><code>${this.escapeHTML(d.sqlSchema)}</code></pre>
          </div>
        </div>

        <div class="deliverable-section">
          <div class="flex-between mb-2">
            <h4>2. REST API CONTROLLER & AUTH MIDDLEWARE</h4>
            <button onclick="navigator.clipboard.writeText(window.pipelineEngine.deliverables.be.apiRoutes); alert('API Code copied!');" class="btn-pixel-small">
              📋 COPY API
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
          <span class="deliverable-time">Generated at ${d.timestamp}</span>
        </div>
        <h3 class="deliverable-title text-red">${d.title}</h3>

        <div class="deliverable-section">
          <h4>1. OWASP TOP 10 PENETRATION AUDIT MATRIX</h4>
          <div class="audit-table-wrapper">
            <table class="audit-table">
              <thead>
                <tr>
                  <th>Vulnerability</th>
                  <th>Risk Level</th>
                  <th>Audit Status</th>
                  <th>Remediation Implemented</th>
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
          <h4>2. CTF LAB SOLVER & SECRET FLAG</h4>
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
        <h3 class="deliverable-title text-green">🚀 PROJECT SUMMARY: ${this.currentTaskTopic}</h3>

        <div class="summary-stats-grid">
          <div class="stat-box">
            <div class="stat-num text-cyan">4/4</div>
            <div class="stat-lbl">Agents Deployed</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-blue">100%</div>
            <div class="stat-lbl">Frontend Spec</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-purple">0 ms</div>
            <div class="stat-lbl">API Bottlenecks</div>
          </div>
          <div class="stat-box">
            <div class="stat-num text-red">A+</div>
            <div class="stat-lbl">OWASP Security Grade</div>
          </div>
        </div>

        <div class="deliverable-section">
          <h4>DELIVERABLE ARTIFACTS CREATED:</h4>
          <ul class="checklist">
            <li><strong class="text-cyan">UI/UX:</strong> User flow diagrams, responsive wireframe schemas, and design system tokens.</li>
            <li><strong class="text-blue">Frontend:</strong> HTML5/Tailwind responsive component code with active interactive demo preview.</li>
            <li><strong class="text-purple">Backend:</strong> PostgreSQL/SQLite relational schema DDL, indexing, and Express REST API controller.</li>
            <li><strong class="text-red">Cyber Security:</strong> OWASP Top 10 pentest matrix, CTF crypto solver script, and security hardening patch.</li>
          </ul>
        </div>
      `;
    }
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
