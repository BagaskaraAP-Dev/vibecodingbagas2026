import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const START_TIME = Date.now();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health & Status API (5 Sub-Agents)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'MOONCRUST // PIXEL AI STUDIO & COMMAND CENTER',
    version: '2.6.0',
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
    agents: [
      { id: 'uiux', name: 'UI/UX-Bot', role: 'UI/UX Architect', status: 'active', station: 'Drawing Tablet' },
      { id: 'fe', name: 'FE-Bot', role: 'Frontend Engineer', status: 'active', station: 'Dual Monitors' },
      { id: 'daily', name: 'DAILY-Bot', role: 'Daily Productivity Specialist', status: 'active', station: 'Daily Productivity Hub' },
      { id: 'be', name: 'BE-Bot', role: 'Backend Architect', status: 'active', station: 'Server Console' },
      { id: 'sec', name: 'SEC-Bot', role: 'SecOps & CTF Solver', status: 'active', station: 'Radar & Terminal' }
    ],
    timestamp: new Date().toISOString()
  });
});

// Pipeline Trigger API
app.post('/api/pipeline/run', (req, res) => {
  const { topic } = req.body;
  const taskId = 'task_' + Date.now().toString(16);
  res.json({
    success: true,
    taskId,
    topic: topic || 'Autonomous Full-Stack Sprint',
    status: 'dispatched_to_5_agents',
    stages: ['uiux', 'fe', 'daily', 'be', 'sec'],
    dispatchedAt: new Date().toISOString()
  });
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server locally
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 MOONCRUST // PIXEL AI STUDIO & COMMAND CENTER`);
    console.log(`  🔗 Local Access: http://localhost:${PORT}`);
    console.log(`  🎮 5 Autonomous Specialist Sub-Agents Ready`);
    console.log(`======================================================\n`);
  });
}

export default app;
