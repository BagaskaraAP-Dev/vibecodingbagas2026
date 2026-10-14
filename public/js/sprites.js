// Pixel Art Character Sprite Renderer for MOONCRUST // PIXEL AI STUDIO
// Procedural pixel-art engine for 5 distinct specialist sub-agents

class PixelSpriteEngine {
  constructor() {
    this.scale = 2; // 1 pixel in sprite = scale x scale on screen
  }

  // Draw an agent sprite at (x, y) with animation frame and state
  drawAgent(ctx, agent, frameTick) {
    ctx.save();
    const x = Math.round(agent.x);
    const y = Math.round(agent.y);
    const scale = this.scale;
    const isWalking = agent.state === 'WALKING';
    const isWorking = agent.state === 'WORKING';
    const dir = agent.dir || 1; // 1: right/down, -1: left/up

    // Walk cycle phase (0 to 3)
    const walkFrame = isWalking ? Math.floor((frameTick / 8) % 4) : 0;
    // Idle breath bob (0 or 1 pixel)
    const idleBob = (!isWalking && !isWorking) ? Math.floor(Math.sin(frameTick * 0.08) * 1.2) : 0;
    // Working typing wobble
    const workWobble = isWorking ? (Math.floor(frameTick / 4) % 2) : 0;

    // Palette lookup based on bot ID
    const palette = this.getPalette(agent.id);

    // Shadow on floor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 12 * scale, y + 26 * scale, 10 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite offset for bobbing
    const offsetY = idleBob + (isWorking ? workWobble : 0);

    // Direction flip
    if (dir === -1) {
      ctx.translate(x + 24 * scale, y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(x, y);
    }

    // Render body parts pixel-by-pixel (12x14 grid scaled)
    this.renderCharacterBody(ctx, palette, walkFrame, isWalking, isWorking, offsetY, scale, agent.id);

    ctx.restore();

    // Render Speech Bubble if active
    if (agent.bubble && agent.bubble.text) {
      this.renderSpeechBubble(ctx, agent, x, y - 10 + offsetY);
    }

    // Render Selection indicator if selected
    if (agent.isSelected) {
      this.renderSelectionRing(ctx, x, y, scale, palette.primary);
    }
  }

  getPalette(id) {
    switch (id) {
      case 'uiux':
        return {
          id: 'uiux',
          name: 'UI/UX-Bot',
          title: 'Lead UI/UX Architect',
          primary: '#00f3ff',     // Cyan
          secondary: '#0099b8',
          accent: '#ffffff',
          dark: '#0a2533',
          hair: '#e2f8ff',
          skin: '#ffd4b2',
          glow: 'rgba(0, 243, 255, 0.6)'
        };
      case 'fe':
        return {
          id: 'fe',
          name: 'FE-Bot',
          title: 'Frontend Engineer',
          primary: '#3b82f6',     // Royal Blue
          secondary: '#1d4ed8',
          accent: '#60a5fa',
          dark: '#0f172a',
          hair: '#fde047',       // Blonde cyber hair
          skin: '#ffe0bd',
          glow: 'rgba(59, 130, 246, 0.6)'
        };
      case 'be':
        return {
          id: 'be',
          name: 'BE-Bot',
          title: 'Backend Architect',
          primary: '#a855f7',     // Purple
          secondary: '#7e22ce',
          accent: '#d8b4fe',
          dark: '#1e112a',
          hair: '#c084fc',
          skin: '#fcd5b5',
          glow: 'rgba(168, 85, 247, 0.6)'
        };
      case 'sec':
        return {
          id: 'sec',
          name: 'SEC-Bot',
          title: 'SecOps & CTF Solver',
          primary: '#ef4444',     // Crimson
          secondary: '#991b1b',
          accent: '#f59e0b',     // Gold accent
          dark: '#260808',
          hair: '#374151',       // Dark tactical
          skin: '#fed7aa',
          glow: 'rgba(239, 68, 68, 0.6)'
        };
      case 'daily':
        return {
          id: 'daily',
          name: 'DAILY-Bot',
          title: 'Daily Productivity Specialist',
          primary: '#10b981',     // Emerald Green
          secondary: '#059669',
          accent: '#6ee7b7',      // Mint highlight
          dark: '#064e3b',
          hair: '#fed7aa',        // Soft Chestnut hair
          skin: '#ffe0bd',
          glow: 'rgba(16, 185, 129, 0.6)'
        };
      case 'admin':
        return {
          id: 'admin',
          name: 'ADMIN',
          title: 'MOONCRUST Studio Admin',
          primary: '#f59e0b',     // Gold
          secondary: '#b45309',
          accent: '#fde68a',
          dark: '#1f2937',
          hair: '#1f2937',
          skin: '#ffd4b2',
          glow: 'rgba(245, 158, 11, 0.6)'
        };
      default:
        return {
          id: 'core',
          name: 'AI-Bot',
          title: 'Agent',
          primary: '#10b981',
          secondary: '#047857',
          accent: '#6ee7b7',
          dark: '#064e3b',
          hair: '#d1fae5',
          skin: '#ffd4b2',
          glow: 'rgba(16, 185, 129, 0.6)'
        };
    }
  }

  renderCharacterBody(ctx, p, walkFrame, isWalking, isWorking, offsetY, s, botId) {
    const px = (gridX, gridY, color, width = 1, height = 1) => {
      ctx.fillStyle = color;
      ctx.fillRect(gridX * s, (gridY + offsetY) * s, width * s, height * s);
    };

    // 1. LEGS & SHOES
    let legL_Y = 17;
    let legR_Y = 17;
    let legL_X = 7;
    let legR_X = 11;

    if (isWalking) {
      if (walkFrame === 1) {
        legL_Y -= 1;
        legR_Y += 1;
      } else if (walkFrame === 3) {
        legL_Y += 1;
        legR_Y -= 1;
      }
    }

    // Left Leg
    px(legL_X, legL_Y, p.dark, 2, 4);
    px(legL_X - 1, legL_Y + 4, '#111827', 3, 2); // Shoe
    // Right Leg
    px(legR_X, legR_Y, p.dark, 2, 4);
    px(legR_X, legR_Y + 4, '#111827', 3, 2); // Shoe

    // 2. TORSO / COAT / HOODIE
    px(6, 10, p.primary, 8, 7); // Main jacket
    px(7, 10, p.secondary, 6, 7); // Shading
    px(9, 11, p.accent, 2, 5); // Zipper / center light strip

    // Bot specific gear on torso
    if (botId === 'uiux') {
      px(7, 11, '#ffffff', 1, 4);
      px(6, 15, '#00f3ff', 2, 1);
    } else if (botId === 'fe') {
      px(8, 12, '#60a5fa', 4, 1);
      px(9, 14, '#fde047', 2, 2);
    } else if (botId === 'be') {
      px(7, 12, '#f8fafc', 2, 3);
      px(8, 14, '#c084fc', 1, 1);
    } else if (botId === 'sec') {
      px(9, 12, '#fbbf24', 2, 2);
      px(10, 13, '#ef4444', 1, 1);
    } else if (botId === 'daily') {
      // Daily planner green badge & pen pocket
      px(7, 11, '#6ee7b7', 2, 2);
      px(10, 12, '#ffffff', 1, 3);
    } else if (botId === 'admin') {
      // Admin ID badge
      px(7, 12, '#ffffff', 2, 2);
      px(7, 12, '#00f3ff', 2, 1);
    }

    // 3. ARMS & HANDS
    let armL_Y = 11;
    let armR_Y = 11;
    if (isWalking) {
      armL_Y += (walkFrame === 1 ? -1 : (walkFrame === 3 ? 1 : 0));
      armR_Y += (walkFrame === 1 ? 1 : (walkFrame === 3 ? -1 : 0));
    } else if (isWorking) {
      armL_Y -= 1;
      armR_Y += 1;
    }

    px(4, armL_Y, p.secondary, 2, 5);
    px(4, armL_Y + 5, p.skin, 2, 2); // Left hand

    px(14, armR_Y, p.secondary, 2, 5);
    px(14, armR_Y + 5, p.skin, 2, 2); // Right hand

    // Special item in hand
    if (botId === 'uiux') {
      px(15, armR_Y + 4, '#00f3ff', 1, 3); // Cyan digital stylus
    } else if (botId === 'sec') {
      px(15, armR_Y + 4, '#f59e0b', 2, 2); // Golden token key
    } else if (botId === 'daily') {
      px(15, armR_Y + 3, '#10b981', 3, 4); // Daily agenda planner notebook
      px(16, armR_Y + 4, '#ffffff', 1, 2);
    }

    // 4. HEAD & FACE
    px(6, 4, p.skin, 8, 6);
    px(5, 5, p.skin, 10, 4);

    // Hair
    px(5, 2, p.hair, 10, 3);
    px(4, 3, p.hair, 2, 4);
    px(14, 3, p.hair, 2, 3);
    px(7, 1, p.hair, 6, 2);

    // Bot specific headwear / visors
    if (botId === 'uiux') {
      px(7, 5, '#00f3ff', 7, 2);
      px(8, 5, '#ffffff', 2, 1);
    } else if (botId === 'fe') {
      px(4, 4, '#1d4ed8', 2, 3);
      px(14, 4, '#1d4ed8', 2, 3);
      px(6, 2, '#3b82f6', 8, 1);
      px(12, 7, '#60a5fa', 2, 1);
      px(8, 6, '#1e293b', 1, 2);
      px(11, 6, '#1e293b', 1, 2);
    } else if (botId === 'be') {
      px(5, 2, '#581c87', 10, 2);
      px(4, 3, '#581c87', 2, 5);
      px(14, 3, '#581c87', 2, 5);
      px(8, 6, '#c084fc', 2, 1);
      px(12, 6, '#7e22ce', 1, 1);
    } else if (botId === 'sec') {
      px(7, 5, '#ef4444', 3, 2);
      px(8, 5, '#fde047', 1, 1);
      px(12, 6, '#111827', 1, 2);
    } else if (botId === 'admin') {
      // Gold crown + headset mic
      px(6, 0, '#fbbf24', 8, 1);
      px(6, -1, '#fbbf24', 1, 1);
      px(9, -1, '#fbbf24', 2, 1);
      px(13, -1, '#fbbf24', 1, 1);
      px(4, 5, '#334155', 1, 3);
      px(5, 8, '#334155', 3, 1);
    } else if (botId === 'daily') {
      // Smart green focus glasses
      px(6, 5, '#10b981', 8, 2);
      px(7, 5, '#ffffff', 2, 1);
      px(11, 5, '#ffffff', 2, 1);
    }

    // Smile / mouth
    px(9, 8, '#991b1b', 2, 1);
  }

  // Render Speech Bubble above agent head
  renderSpeechBubble(ctx, agent, x, y) {
    const text = agent.bubble.text;
    const s = this.scale;
    const p = this.getPalette(agent.id);

    ctx.save();
    ctx.font = '9px "Press Start 2P", "Courier New", monospace';
    const textWidth = ctx.measureText(text).width;
    const padX = 10;
    const boxW = Math.max(80, textWidth + padX * 2);
    const boxH = 24;
    const boxX = Math.round(x + 12 * s - boxW / 2);
    const boxY = Math.round(y - boxH - 12);

    // Bubble Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(boxX + 3, boxY + 3, boxW, boxH);

    // Bubble Body
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Border with Agent primary color
    ctx.strokeStyle = p.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Corner accents
    ctx.fillStyle = p.accent;
    ctx.fillRect(boxX, boxY, 2, 2);
    ctx.fillRect(boxX + boxW - 2, boxY, 2, 2);
    ctx.fillRect(boxX, boxY + boxH - 2, 2, 2);
    ctx.fillRect(boxX + boxW - 2, boxY + boxH - 2, 2, 2);

    // Downward Pointer Triangle (Tail)
    const tailX = Math.round(x + 12 * s);
    const tailY = boxY + boxH;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(tailX - 5, tailY);
    ctx.lineTo(tailX, tailY + 6);
    ctx.lineTo(tailX + 5, tailY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = p.primary;
    ctx.beginPath();
    ctx.moveTo(tailX - 5, tailY);
    ctx.lineTo(tailX, tailY + 6);
    ctx.lineTo(tailX + 5, tailY);
    ctx.stroke();

    // Text Label inside Bubble
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(text, boxX + padX, boxY + 16);

    ctx.restore();
  }

  // Draw circular glowing selection ring
  renderSelectionRing(ctx, x, y, scale, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(x + 12 * scale, y + 26 * scale, 14 * scale, 6 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

window.pixelSprites = new PixelSpriteEngine();
