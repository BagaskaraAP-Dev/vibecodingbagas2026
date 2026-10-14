// UI wiring for MOONCRUST // PIXEL AI STUDIO
// All handlers are bound here via data-action delegation so the page runs under a CSP without 'unsafe-inline' scripts.

function toggleAudio() {
  if (window.studioAudio) {
    const isMuted = window.studioAudio.toggleMute();
    const btn = document.getElementById('toggleAudioBtn');
    if (btn) btn.textContent = isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ON';
  }
}

function resetStudioPositions() {
  if (window.pixelStudio) {
    const studio = window.pixelStudio;
    studio.agents.forEach(agent => {
      const home = studio.stations[agent.stationId];
      agent.targetX = home.x;
      agent.targetY = home.y;
      agent.state = 'WORKING';
    });
    if (window.studioAudio) window.studioAudio.playKey();
    studio.logTerminal('[System] Posisi agen direset ke meja masing-masing.');
  }
}

function currentTopic() {
  const input = document.getElementById('taskTopicInput');
  return input ? input.value : 'Tugas Mandiri';
}

function switchTab(tabKey) {
  if (window.pipelineEngine) window.pipelineEngine.switchTabSilently(tabKey);
  if (window.studioAudio) window.studioAudio.playKey();
}

window.updateInspectorCard = function(agent) {
  const palette = window.pixelSprites.getPalette(agent.id);
  document.getElementById('inspectBadge').style.background = palette.primary;
  document.getElementById('inspectName').textContent = agent.name;
  document.getElementById('inspectStation').textContent = `(${window.pixelStudio.stations[agent.stationId].name})`;

  document.querySelectorAll('.agent-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.bot === agent.id);
  });
};

const actions = {
  'toggle-audio': () => toggleAudio(),
  'reset-positions': () => resetStudioPositions(),
  'launch-pipeline': () => window.pipelineEngine?.runPipeline(currentTopic()),
  'launch-solo': el => window.pipelineEngine?.runSingleAgent(el.dataset.agent, currentTopic()),
  'select-agent': el => window.pixelStudio?.selectAgent(el.dataset.agent),
  'agent-cmd': el => window.pixelStudio?.commandSelectedAgent(el.dataset.cmd),
  'switch-tab': el => switchTab(el.dataset.tab),
  'pomo-start': () => window.pipelineEngine?.startPomodoro(),
  'pomo-pause': () => window.pipelineEngine?.pausePomodoro(),
  'pomo-reset': () => window.pipelineEngine?.resetPomodoro(),
  'add-task': () => window.pipelineEngine?.addNewTask(),
  'toggle-task': el => window.pipelineEngine?.toggleTaskDone(Number(el.dataset.id)),
  'delete-task': el => window.pipelineEngine?.deleteTask(Number(el.dataset.id)),
  'copy': el => window.pipelineEngine?.copyDeliverable(el.dataset.copy),
  'export-md': () => window.pipelineEngine?.exportFullMarkdown(),
  'agent-send': () => window.agentChat?.send(),
  'agent-set-code': () => window.agentChat?.setCode()
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const handler = actions[el.dataset.action];
  if (handler) handler(el);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'newDailyTaskInput') window.pipelineEngine?.addNewTask();
  if (e.key === 'Enter' && e.target.id === 'agentChatInput') window.agentChat?.send();
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.pipelineEngine) {
      const defaultTopic = 'Jadwal Kuliah, Belajar Coding Vibe, & Target Olahraga Harian';
      const domain = window.pipelineEngine.analyzeDomain(defaultTopic);
      window.pipelineEngine.currentTaskTopic = defaultTopic;
      window.pipelineEngine.deliverables.daily = window.pipelineEngine.generateDAILY(defaultTopic, domain);
      window.pipelineEngine.deliverables.fe = window.pipelineEngine.generateFE(defaultTopic, domain);
      window.pipelineEngine.deliverables.be = window.pipelineEngine.generateBE(defaultTopic, domain);
      window.pipelineEngine.deliverables.uiux = window.pipelineEngine.generateUIUX(defaultTopic, domain);
      window.pipelineEngine.deliverables.sec = window.pipelineEngine.generateSEC(defaultTopic, domain);

      window.pipelineEngine.renderDeliverableTab('daily');
      window.pipelineEngine.renderDeliverableTab('fe');
      window.pipelineEngine.renderDeliverableTab('be');
      window.pipelineEngine.renderDeliverableTab('uiux');
      window.pipelineEngine.renderDeliverableTab('sec');
      window.pipelineEngine.renderDeliverableTab('summary');
    }
  }, 300);
});
