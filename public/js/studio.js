// 2D Pixel Art & Retro Isometric Studio Engine for MOONCRUST // PIXEL AI STUDIO
// Canvas simulator with animated environment, workstations, server racks, and autonomous agents

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
    this.selectedAgentId = null;

    // Steam particles for coffee machine
    this.steamParticles = [];
    // Twinkling stars for lunar window
    this.stars = [];
    this.initStars();

    // Workstation locations
    this.stations = {
      uiux: { x: 120, y: 220, name: 'UI/UX Design Station', icon: '🎨' },
      fe: { x: 140, y: 380, name: 'Frontend Dev Rig', icon: '💻' },
      be: { x: 740, y: 220, name: 'Backend & Server Console', icon: '🗄️' },
      sec: { x: 720, y: 380, name: 'SecOps & CTF Radar Lab', icon: '🛡️' },
      coffee: { x: 440, y: 155, name: 'Caffeine Fuel Hub', icon: '☕' },
      whiteboard: { x: 260, y: 155, name: 'Agile Whiteboard', icon: '📋' },
      serverRack: { x: 860, y: 155, name: 'Mainframe Cluster', icon: '🖥️' }
    };

    // Initialize 4 Autonomous Specialist Agents
    this.agents = [
      {
        id: 'uiux',
        name: 'UI/UX-Bot',
        role: 'Lead UI/UX Architect',
        desc: 'Specialist in User Flows, Wireframes, Design Tokens & Heuristic UX.',
        x: this.stations.uiux.x,
        y: this.stations.uiux.y,
        targetX: this.stations.uiux.x,
        targetY: this.stations.uiux.y,
        state: 'WORKING', // WORKING, IDLE, WALKING
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
        desc: 'Specialist in HTML5/CSS3/Tailwind, Responsive UI & Micro-interactions.',
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
      }
    ];

    // Mouse click event listener
    this.canvas.addEventListener('click', (e) => this.handleClick(e));

    // Start main game loop
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

    // Update coffee steam particles
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

    // Autonomous behavior update for each agent (if not locked by pipeline)
    this.agents.forEach(agent => {
      // Decrement speech bubble timer
      if (agent.bubble) {
        agent.bubble.timer--;
        if (agent.bubble.timer <= 0) {
          agent.bubble = null;
        }
      }

      // Movement logic toward target
      const dx = agent.targetX - agent.x;
      const dy = agent.targetY - agent.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 2) {
        agent.state = 'WALKING';
        agent.dir = dx >= 0 ? 1 : -1;
        const moveSpeed = 1.6;
        agent.x += (dx / dist) * moveSpeed;
        agent.y += (dy / dist) * moveSpeed;
      } else {
        // Arrived at target
        agent.x = agent.targetX;
        agent.y = agent.targetY;
        if (agent.state === 'WALKING') {
          // If returned to personal station, switch to working
          const homeStation = this.stations[agent.stationId];
          if (Math.hypot(agent.x - homeStation.x, agent.y - homeStation.y) < 5) {
            agent.state = 'WORKING';
          } else {
            agent.state = 'IDLE';
          }
        }
      }

      // Autonomous idle wandering (when pipeline isn't controlling them)
      if (!window.pipelineEngine || !window.pipelineEngine.isActive) {
        if (this.frameTick >= agent.nextActionTick) {
          this.decideNextAutonomousAction(agent);
        }
      }
    });
  }

  decideNextAutonomousAction(agent) {
    // Schedule next decision in 240-420 ticks (4 to 7 seconds)
    agent.nextActionTick = this.frameTick + 240 + Math.floor(Math.random() * 180);

    // If currently away from home station, head back home
    const homeStation = this.stations[agent.stationId];
    const isAtHome = Math.hypot(agent.x - homeStation.x, agent.y - homeStation.y) < 10;

    if (!isAtHome) {
      agent.targetX = homeStation.x;
      agent.targetY = homeStation.y;
      const returnQuotes = {
        uiux: 'Back to the wireframes!',
        fe: 'Resuming code sprint...',
        be: 'Checking API endpoints...',
        sec: 'Back to radar sweep!'
      };
      this.triggerAgentBubble(agent.id, returnQuotes[agent.id] || 'Back to work!', 100);
      return;
    }

    // Agent is at home, pick a random leisure / collaboration action
    const actions = ['coffee', 'whiteboard', 'serverRack', 'visitPeer', 'stayWorking'];
    const choice = actions[Math.floor(Math.random() * actions.length)];

    if (choice === 'coffee') {
      agent.targetX = this.stations.coffee.x + (Math.random() * 20 - 10);
      agent.targetY = this.stations.coffee.y + 20;
      this.triggerAgentBubble(agent.id, 'Need fresh espresso ☕', 120);
    } else if (choice === 'whiteboard') {
      agent.targetX = this.stations.whiteboard.x + (Math.random() * 30 - 15);
      agent.targetY = this.stations.whiteboard.y + 25;
      this.triggerAgentBubble(agent.id, 'Reviewing sprint tasks 📌', 120);
    } else if (choice === 'serverRack' && (agent.id === 'be' || agent.id === 'sec')) {
      agent.targetX = this.stations.serverRack.x - 20;
      agent.targetY = this.stations.serverRack.y + 20;
      this.triggerAgentBubble(agent.id, 'Monitoring server load 🖥️', 120);
    } else if (choice === 'visitPeer') {
      // Pick another agent to chat with
      const otherAgents = this.agents.filter(a => a.id !== agent.id);
      const peer = otherAgents[Math.floor(Math.random() * otherAgents.length)];
      agent.targetX = peer.x + (agent.x < peer.x ? -35 : 35);
      agent.targetY = peer.y;

      const chatDialogues = {
        uiux: [`Hey ${peer.name}, reviewed the user flow?`, 'New micro-interaction spec ready!'],
        fe: [`Syncing UI components with ${peer.name}`, 'Bundle size under 32KB!'],
        be: [`Schema migration 100% verified`, `Passing JWT auth to ${peer.name}`],
        sec: [`Zero vulnerabilities detected!`, `Running CTF reverse challenge...`]
      };
      const dialog = chatDialogues[agent.id][Math.floor(Math.random() * chatDialogues[agent.id].length)];
      this.triggerAgentBubble(agent.id, dialog, 140);
    } else {
      // Stay working and quote domain thought
      const workThoughts = {
        uiux: ['Figma tokens synced!', 'Checking WCAG AA contrast...', 'Refining mobile touch targets'],
        fe: ['Flexbox grid perfectly aligned', 'Adding buttery CSS transitions', 'Optimizing WebGL canvas render'],
        be: ['Database vacuumed: 1.2ms', 'REST API response 200 OK', 'JWT bearer tokens refreshed'],
        sec: ['OWASP Top 10 checklist: CLEAR', 'Cipher decrypted: SHA-256 validated', 'Payload sanitization locked']
      };
      const quote = workThoughts[agent.id][Math.floor(Math.random() * workThoughts[agent.id].length)];
      this.triggerAgentBubble(agent.id, quote, 130);
    }
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

    // Check if an agent was clicked (bounding box around agent)
    let agentFound = false;
    this.agents.forEach(agent => {
      const dist = Math.hypot(clickX - (agent.x + 24), clickY - (agent.y + 26));
      if (dist < 36) {
        this.selectAgent(agent.id);
        agentFound = true;
      }
    });

    if (!agentFound) {
      // Check if a station was clicked
      for (const [key, station] of Object.entries(this.stations)) {
        const dist = Math.hypot(clickX - station.x, clickY - station.y);
        if (dist < 45) {
          if (window.studioAudio) window.studioAudio.playKey();
          this.showStationInfo(key);
          break;
        }
      }
    }
  }

  selectAgent(agentId) {
    this.selectedAgentId = agentId;
    this.agents.forEach(a => a.isSelected = (a.id === agentId));
    const agent = this.agents.find(a => a.id === agentId);

    if (agent) {
      if (window.studioAudio) window.studioAudio.playKey();
      // Greet user
      const greetings = {
        uiux: 'UI/UX Bot online! Ready to design wireframes & design systems.',
        fe: 'FE Bot reporting! Ready to code responsive HTML5/CSS/JS components.',
        be: 'BE Bot standing by! Ready for SQL schemas, REST APIs & algorithms.',
        sec: 'SEC Bot deployed! Ready for OWASP security audit & CTF forensics.'
      };
      this.triggerAgentBubble(agent.id, greetings[agent.id] || 'Agent ready!', 140);

      // Update Inspector UI in HTML HUD
      if (window.updateInspectorCard) {
        window.updateInspectorCard(agent);
      }
    }
  }

  showStationInfo(stationKey) {
    const s = this.stations[stationKey];
    if (!s) return;
    const tips = {
      coffee: 'Caffeine Fuel Station: Essential for high-frequency vibe coding!',
      whiteboard: 'Sprint Whiteboard: UI/UX, FE, BE, SEC collaborative task roadmap.',
      serverRack: 'Mainframe Rack: 8 Server blades, active cooling, zero downtime.',
      uiux: 'UI/UX Workstation: Drawing tablet, wireframes, and design system swatches.',
      fe: 'Frontend Rig: Dual 4K monitors running Vite, Tailwind & responsive preview.',
      be: 'Backend Console: Postgres & SQLite databases, REST endpoints, Node.js runtime.',
      sec: 'SecOps Radar Lab: Continuous network vulnerability sweeps & CTF solver.'
    };
    const tipText = tips[stationKey] || s.name;
    const banner = document.getElementById('liveStatusTicker');
    if (banner) {
      banner.innerHTML = `<span style="color:#00f3ff;">[STATION FOCUS]</span> ${tipText}`;
    }
  }

  // ==========================================
  // RENDER PIPELINE: ROOM, OBJECTS, LIGHTING
  // ==========================================
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. BACK WALL & CYBER BACKGROUND
    this.renderBackWall(ctx);

    // 2. OBSERVATION WINDOW (MOON & STARS)
    this.renderObservationWindow(ctx);

    // 3. NEON SIGN "MOONCRUST"
    this.renderNeonSign(ctx);

    // 4. CHECKERED FLOOR
    this.renderCheckeredFloor(ctx);

    // 5. STATIC INTERIOR FURNITURE (Background layer)
    this.renderWhiteboard(ctx);
    this.renderServerRack(ctx);
    this.renderCoffeeCorner(ctx);
    this.renderPixelPlants(ctx);

    // 6. WORKSTATIONS (DESKS & GEAR)
    this.renderWorkstations(ctx);

    // 7. AUTONOMOUS AGENTS (SORTED BY Y FOR DEPTH)
    const sortedAgents = [...this.agents].sort((a, b) => a.y - b.y);
    sortedAgents.forEach(agent => {
      window.pixelSprites.drawAgent(ctx, agent, this.frameTick);
    });

    // 8. COFFEE STEAM PARTICLES
    this.renderCoffeeSteam(ctx);

    // 9. AMBIENT SCANLINE & VIGNETTE EFFECT
    this.renderVignette(ctx);
  }

  renderBackWall(ctx) {
    // Upper wall background
    const grad = ctx.createLinearGradient(0, 0, 0, 150);
    grad.addColorStop(0, '#0a0d18');
    grad.addColorStop(1, '#151928');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, 150);

    // Wall grid / panel seam lines
    ctx.strokeStyle = '#1e2538';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 150);
      ctx.stroke();
    }
    // Baseboard divider trim with cyan accent
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

    // Window frame border
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(winX - 4, winY - 4, winW + 8, winH + 8);
    ctx.strokeStyle = '#273553';
    ctx.lineWidth = 3;
    ctx.strokeRect(winX - 4, winY - 4, winW + 8, winH + 8);

    // Window interior sky
    const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
    skyGrad.addColorStop(0, '#02040a');
    skyGrad.addColorStop(1, '#081226');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX, winY, winW, winH);

    // Twinkling stars
    this.stars.forEach(s => {
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin((this.frameTick + s.twinkleOffset) * 0.05));
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Crescent Moon / Lunar Surface
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(winX + 225, winY + 36, 18, 0, Math.PI * 2);
    ctx.fill();
    // Moon craters
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(winX + 220, winY + 32, 4, 0, Math.PI * 2);
    ctx.arc(winX + 230, winY + 40, 3, 0, Math.PI * 2);
    ctx.arc(winX + 225, winY + 45, 2, 0, Math.PI * 2);
    ctx.fill();

    // Satellite passing by
    const satX = winX + ((this.frameTick * 0.4) % (winW + 30)) - 10;
    const satY = winY + 48;
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(satX, satY, 4, 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(satX - 3, satY - 1, 2, 4);
    ctx.fillRect(satX + 5, satY - 1, 2, 4);

    // Window crossbars
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
    ctx.font = 'bold 15px "Press Start 2P", "Courier New", monospace';

    // Neon glow pulse calculation
    const pulse = 0.75 + 0.25 * Math.sin(this.frameTick * 0.08);

    // Diffuse glow
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 18 * pulse;

    // Glowing outline
    ctx.fillStyle = `rgba(0, 243, 255, ${0.4 * pulse})`;
    ctx.fillText(text, x, y);

    // Bright inner core
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x, y);

    // Neon mount bracket
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 95, y + 4, 190, 2);

    ctx.restore();
  }

  renderCheckeredFloor(ctx) {
    const startY = 154;
    const tileW = 40;
    const tileH = 24; // Isometric squish ratio

    const cols = Math.ceil(this.width / tileW) + 1;
    const rows = Math.ceil((this.height - startY) / tileH) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileW;
        const y = startY + r * tileH;
        const isEven = (r + c) % 2 === 0;

        // Alternating retro checkered slate tiles
        ctx.fillStyle = isEven ? '#181e2e' : '#1e2638';
        ctx.fillRect(x, y, tileW, tileH);

        // Tile bevel borders
        ctx.strokeStyle = '#141824';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileW, tileH);

        // Subtle highlight on top edge of even tiles
        if (isEven) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(x, y, tileW, 1);
        }
      }
    }

    // Floor area demarcation lines for departments
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(30, 180, 420, 330); // Left wing: UX & FE
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.strokeRect(510, 180, 420, 330); // Right wing: BE & SEC
    ctx.setLineDash([]);
  }

  renderWhiteboard(ctx) {
    const wbX = 210;
    const wbY = 70;
    const wbW = 105;
    const wbH = 68;

    // Frame
    ctx.fillStyle = '#334155';
    ctx.fillRect(wbX, wbY, wbW, wbH);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(wbX + 3, wbY + 3, wbW - 6, wbH - 6);

    // Title & Columns
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

    // Sticky Notes
    const stickies = [
      { x: wbX + 8, y: wbY + 20, c: '#fef08a' }, // Yellow TODO
      { x: wbX + 20, y: wbY + 32, c: '#fbcfe8' }, // Pink
      { x: wbX + 42, y: wbY + 22, c: '#bae6fd' }, // Cyan DOING
      { x: wbX + 54, y: wbY + 38, c: '#fed7aa' }, // Amber
      { x: wbX + 76, y: wbY + 24, c: '#bbf7d0' }, // Green DONE
      { x: wbX + 88, y: wbY + 40, c: '#bbf7d0' }
    ];
    stickies.forEach(s => {
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x, s.y, 10, 10);
      ctx.fillStyle = '#334155';
      ctx.fillRect(s.x + 2, s.y + 3, 6, 1);
      ctx.fillRect(s.x + 2, s.y + 6, 4, 1);
    });

    // Marker tray at bottom
    ctx.fillStyle = '#64748b';
    ctx.fillRect(wbX + 10, wbY + wbH, wbW - 20, 3);
  }

  renderServerRack(ctx) {
    const rackX = 810;
    const rackY = 40;
    const rackW = 120;
    const rackH = 104;

    // Dark chassis
    ctx.fillStyle = '#090d16';
    ctx.fillRect(rackX, rackY, rackW, rackH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(rackX, rackY, rackW, rackH);

    // 3 Server Units
    for (let u = 0; u < 3; u++) {
      const uX = rackX + 6 + u * 38;
      const uY = rackY + 6;
      const uW = 32;
      const uH = rackH - 12;

      ctx.fillStyle = '#131b2c';
      ctx.fillRect(uX, uY, uW, uH);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(uX, uY, uW, uH);

      // Ventilation horizontal slits
      ctx.fillStyle = '#0a0f1d';
      for (let s = 0; s < 12; s++) {
        ctx.fillRect(uX + 4, uY + 20 + s * 5, uW - 8, 2);
      }

      // Blinking LEDs
      const ledColors = ['#10b981', '#00f3ff', '#f59e0b', '#ef4444'];
      for (let l = 0; l < 4; l++) {
        const isBlinking = ((this.frameTick + u * 15 + l * 23) % 40) < 22;
        ctx.fillStyle = isBlinking ? ledColors[l] : '#1f2937';
        ctx.fillRect(uX + 4 + l * 6, uY + 8, 3, 3);
      }
    }

    // Overhead Cable Loom running toward BE desk
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

    // Counter table
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(cX, cY + 16, 50, 20);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(cX - 2, cY + 14, 54, 4);

    // Espresso Machine
    ctx.fillStyle = '#475569';
    ctx.fillRect(cX + 12, cY, 26, 16);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cX + 16, cY + 4, 18, 8);

    // Coffee pot & nozzle
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cX + 22, cY + 11, 6, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cX + 23, cY + 15, 4, 1); // Water indicator

    // Mug
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(cX + 32, cY + 11, 6, 6);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(cX + 33, cY + 12, 4, 2); // Coffee liquid
  }

  renderCoffeeSteam(ctx) {
    this.steamParticles.forEach(p => {
      ctx.fillStyle = `rgba(240, 249, 255, ${p.alpha})`;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
  }

  renderPixelPlants(ctx) {
    // Left corner plant
    this.drawPlant(ctx, 30, 150);
    // Right mid plant
    this.drawPlant(ctx, 650, 150);
    // Bottom edge accent plant
    this.drawPlant(ctx, 470, 480);
  }

  drawPlant(ctx, x, y) {
    // Pot
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x + 4, y + 16, 16, 14);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + 2, y + 14, 20, 3);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 5, y + 15, 14, 2);

    // Leaves
    ctx.fillStyle = '#15803d';
    ctx.fillRect(x + 2, y + 4, 8, 8);
    ctx.fillRect(x + 14, y + 2, 8, 9);
    ctx.fillRect(x + 8, y - 2, 8, 10);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + 4, y + 6, 4, 4);
    ctx.fillRect(x + 16, y + 4, 4, 4);
    ctx.fillRect(x + 10, y, 4, 4);
  }

  // ==========================================
  // 4 SPECIALIZED WORKSTATIONS
  // ==========================================
  renderWorkstations(ctx) {
    // 1. UI/UX Workstation (Top-Left)
    this.drawUIUXStation(ctx, this.stations.uiux.x - 30, this.stations.uiux.y - 30);

    // 2. FE Workstation (Bottom-Left)
    this.drawFEStation(ctx, this.stations.fe.x - 30, this.stations.fe.y - 30);

    // 3. BE Workstation (Top-Right)
    this.drawBEStation(ctx, this.stations.be.x - 40, this.stations.be.y - 30);

    // 4. SEC Workstation (Bottom-Right)
    this.drawSECStation(ctx, this.stations.sec.x - 40, this.stations.sec.y - 30);
  }

  // UI/UX Station: Drawing tablet, wireframes, color swatches
  drawUIUXStation(ctx, x, y) {
    // Desk Surface
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 110, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 110, 4);
    // Cyan LED edge line
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(x, y + 22, 110, 2);

    // Desk legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 98, y + 62, 6, 26);

    // Drawing Tablet with Stylus
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 14, y + 28, 30, 20);
    // Glowing tablet canvas
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(x + 17, y + 31, 24, 14);
    // Wireframe boxes on tablet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 19, y + 33, 9, 4);
    ctx.fillRect(x + 19, y + 39, 14, 3);

    // Large Wireframe Monitor
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 52, y - 8, 48, 30);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 55, y - 5, 42, 24);
    // Screen contents: UI wireframe layout
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 58, y - 2, 36, 4); // Nav bar
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 58, y + 5, 16, 11); // Hero box
    ctx.fillRect(x + 77, y + 5, 17, 11); // Sidebar

    // Monitor stand
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 72, y + 22, 8, 4);

    // Color Swatches on desk
    const swatches = ['#00f3ff', '#3b82f6', '#a855f7', '#ef4444'];
    swatches.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(x + 52 + i * 7, y + 34, 5, 5);
    });
  }

  // FE Station: Dual-monitors (Code & Live UI), RGB keyboard
  drawFEStation(ctx, x, y) {
    // Desk
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 115, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 115, 4);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x, y + 22, 115, 2); // Blue LED trim

    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 103, y + 62, 6, 26);

    // Left Monitor: Code IDE
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 12, y - 10, 42, 28);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 14, y - 8, 38, 24);
    // Fake syntax highlighted code lines
    const codeColors = ['#f43f5e', '#38bdf8', '#4ade80', '#fbbf24', '#c084fc'];
    for (let l = 0; l < 5; l++) {
      ctx.fillStyle = codeColors[(l + Math.floor(this.frameTick / 20)) % codeColors.length];
      ctx.fillRect(x + 17, y - 5 + l * 4, 18 + (l % 3) * 6, 2);
    }

    // Right Monitor: Live Browser Preview
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 58, y - 10, 42, 28);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 60, y - 8, 38, 24);
    // Web page mockup
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 62, y - 5, 34, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 64, y + 3, 12, 6);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + 80, y + 4, 12, 4); // CTA Button

    // RGB Mechanical Keyboard
    const rgbHue = (this.frameTick * 2) % 360;
    ctx.fillStyle = `hsl(${rgbHue}, 80%, 60%)`;
    ctx.fillRect(x + 36, y + 30, 36, 12);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 38, y + 32, 32, 8);

    // Mouse & Pad
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 78, y + 32, 14, 10);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 83, y + 34, 4, 6);
  }

  // BE Station: Server console, Database schema charts, Purple glow
  drawBEStation(ctx, x, y) {
    // Desk
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 115, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 115, 4);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(x, y + 22, 115, 2); // Purple LED trim

    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 103, y + 62, 6, 26);

    // Main Monitor: Database Entity Relationships (ERD)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 20, y - 10, 50, 30);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x + 22, y - 8, 46, 26);

    // SQL tables schema boxes
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

    // Secondary Terminal: REST API streaming logs
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 74, y - 6, 32, 24);
    ctx.fillStyle = '#052e16';
    ctx.fillRect(x + 76, y - 4, 28, 20);
    // Green text log lines
    ctx.fillStyle = '#4ade80';
    for (let l = 0; l < 4; l++) {
      ctx.fillRect(x + 78, y - 2 + l * 4, 18 + (l % 2) * 5, 2);
    }

    // Terminal keyboard & Auth Token Keycard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 30, y + 30, 36, 10);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(x + 76, y + 32, 10, 6); // Keycard
  }

  // SEC Station: Rotating radar sweep, Matrix green terminal, Red/Gold tactical
  drawSECStation(ctx, x, y) {
    // Desk
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 20, 115, 42);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 18, 115, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x, y + 22, 115, 2); // Crimson LED trim

    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 6, y + 62, 6, 26);
    ctx.fillRect(x + 103, y + 62, 6, 26);

    // Left Display: Circular Rotating Radar Sweep
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

    // Radar concentric rings
    ctx.beginPath();
    ctx.arc(radarCX, radarCY, radarR * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // Radar sweeping beam
    const radarAngle = (this.frameTick * 0.06) % (Math.PI * 2);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(radarCX, radarCY);
    ctx.lineTo(radarCX + Math.cos(radarAngle) * radarR, radarCY + Math.sin(radarAngle) * radarR);
    ctx.stroke();

    // Blip detected on radar
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(radarCX + 6, radarCY - 5, 2, 2);

    // Right Display: Matrix Hacker Terminal
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x + 58, y - 10, 48, 28);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 60, y - 8, 44, 24);

    // Matrix falling code effect
    ctx.fillStyle = '#22c55e';
    for (let c = 0; c < 6; c++) {
      const dropY = ((this.frameTick * 2 + c * 7) % 20);
      ctx.fillRect(x + 63 + c * 7, y - 6 + dropY, 3, 2);
    }

    // Hologram Floating Shield / CTF Lock
    const shieldBob = Math.sin(this.frameTick * 0.1) * 3;
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
    ctx.beginPath();
    ctx.arc(x + 88, y + 32 + shieldBob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 86, y + 30 + shieldBob, 4, 4); // Lock shackle
    ctx.restore();
  }

  renderVignette(ctx) {
    // Subtle retro CRT scanline every 4px
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < this.height; y += 4) {
      ctx.fillRect(0, y, this.width, 1);
    }

    // Vignette border
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

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.pixelStudio = new PixelStudioEngine('studioCanvas');
});
