import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { agentHttpHandler } from './lib/dailyAgent.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const START_TIME = Date.now();

// Security headers: single source of truth is vercel.json, applied here for local/Node runs
const { headers: headerRules = [] } = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
const SECURITY_HEADERS = headerRules.flatMap(rule => rule.headers);

app.disable('x-powered-by');
app.use((req, res, next) => {
  for (const { key, value } of SECURITY_HEADERS) res.setHeader(key, value);
  next();
});
app.use(express.json({ limit: '32kb', strict: true }));
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

// DAILY-Bot AI agent (Claude)
app.post('/api/agent', (req, res) => agentHttpHandler(req, res));

// Pipeline Trigger API
app.post('/api/pipeline/run', (req, res) => {
  const { topic } = req.body ?? {};
  if (topic !== undefined && (typeof topic !== 'string' || topic.length > 200)) {
    return res.status(400).json({ success: false, error: 'topic must be a string of at most 200 characters' });
  }
  const taskId = 'task_' + crypto.randomUUID();
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
