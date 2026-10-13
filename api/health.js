export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    service: 'MOONCRUST // PIXEL AI STUDIO & COMMAND CENTER',
    version: '2.6.0',
    agents: [
      { id: 'uiux', name: 'UI/UX-Bot', role: 'UI/UX Architect', status: 'active', station: 'Drawing Tablet' },
      { id: 'fe', name: 'FE-Bot', role: 'Frontend Engineer', status: 'active', station: 'Dual Monitors' },
      { id: 'daily', name: 'DAILY-Bot', role: 'Daily Productivity Specialist', status: 'active', station: 'Daily Productivity Hub' },
      { id: 'be', name: 'BE-Bot', role: 'Backend Architect', status: 'active', station: 'Server Console' },
      { id: 'sec', name: 'SEC-Bot', role: 'SecOps & CTF Solver', status: 'active', station: 'Radar & Terminal' }
    ],
    timestamp: new Date().toISOString()
  });
}
