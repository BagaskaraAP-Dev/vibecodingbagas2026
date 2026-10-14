// DAILY-Bot chat client: talks to /api/agent and applies the agent's changes to the local to-do list.

class AgentChat {
  constructor() {
    this.history = []; // plain-text turns sent back to the server; capped to the server's limit
    this.busy = false;
  }

  getCode() {
    try {
      return localStorage.getItem('mooncrust_agent_code') || '';
    } catch (e) {
      return '';
    }
  }

  setCode() {
    const code = window.prompt('Masukkan kode akses DAILY-Bot (AGENT_ACCESS_CODE di server):', '');
    if (code === null) return false;
    try {
      localStorage.setItem('mooncrust_agent_code', code.trim());
    } catch (e) {}
    return code.trim() !== '';
  }

  appendMessage(text, kind) {
    const log = document.getElementById('agentChatLog');
    if (!log) return null;
    const div = document.createElement('div');
    div.className = `agent-msg agent-msg-${kind}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  localTime() {
    const now = new Date();
    const date = now.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    return `${date} ${tz}`.slice(0, 64);
  }

  applyResult(result) {
    const engine = window.pipelineEngine;
    if (!engine) return;
    if (Array.isArray(result.tasks)) {
      engine.dailyTasks = result.tasks;
      engine.saveTasks();
    }
    if (Array.isArray(result.schedule) && engine.deliverables.daily) {
      engine.deliverables.daily.schedule = result.schedule;
    }
    engine.renderDeliverableTab('daily');
    engine.switchTabSilently('daily');
    if (Array.isArray(result.actions) && result.actions.includes('start_pomodoro')) engine.startPomodoro();
  }

  async send() {
    if (this.busy) return;
    const input = document.getElementById('agentChatInput');
    const message = input ? input.value.trim() : '';
    if (!message) return;
    if (!this.getCode() && !this.setCode()) return;

    this.busy = true;
    const sendBtn = document.getElementById('agentChatSend');
    if (sendBtn) sendBtn.disabled = true;
    input.value = '';
    this.appendMessage(message, 'user');
    const pending = this.appendMessage('DAILY-Bot sedang berpikir...', 'bot');
    if (pending) pending.classList.add('agent-msg-pending');
    if (window.pixelStudio) {
      window.pixelStudio.selectAgent('daily');
      window.pixelStudio.triggerAgentBubble('daily', 'Memproses permintaanmu...', 120);
    }

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Access-Code': this.getCode() },
        body: JSON.stringify({
          message,
          history: this.history,
          tasks: (window.pipelineEngine?.dailyTasks || []).map(t => ({ id: t.id, text: t.text, done: t.done === true, priority: t.priority })),
          localTime: this.localTime()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (pending) pending.remove();

      if (!res.ok) {
        if (res.status === 401) {
          try { localStorage.removeItem('mooncrust_agent_code'); } catch (e) {}
        }
        this.appendMessage(`⚠ ${data.error || `HTTP ${res.status}`}`, 'error');
        return;
      }

      this.appendMessage(data.reply, 'bot');
      this.history.push({ role: 'user', content: message }, { role: 'assistant', content: String(data.reply).slice(0, 4000) });
      this.history = this.history.slice(-20);
      this.applyResult(data);
      if (window.studioAudio) window.studioAudio.playKey();
      if (window.pixelStudio) window.pixelStudio.logTerminal(`[DAILY-Bot] ${String(data.reply).slice(0, 80)}`);
    } catch (e) {
      if (pending) pending.remove();
      this.appendMessage('⚠ Gagal terhubung ke server.', 'error');
    } finally {
      this.busy = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }
}

window.agentChat = new AgentChat();
