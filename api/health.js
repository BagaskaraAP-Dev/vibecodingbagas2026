export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    service: 'MOONCRUST // PIXEL AI STUDIO & COMMAND CENTER',
    version: '2.0.0',
    agents: [
      { id: 'uiux', name: 'UI/UX-Bot', status: 'active', station: 'Drawing Tablet' },
      { id: 'fe', name: 'FE-Bot', status: 'active', station: 'Dual Monitors' },
      { id: 'be', name: 'BE-Bot', status: 'active', station: 'Server Console' },
      { id: 'sec', name: 'SEC-Bot', status: 'active', station: 'Radar & Terminal' }
    ],
    timestamp: new Date().toISOString()
  });
}
