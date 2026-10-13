import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLeaderboard, addLeaderboard, getGuestbook, addGuestbook, getStats } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const START_TIME = Date.now();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'VibeCoding Bagas 2026',
    version: '1.0.0',
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const leaderboard = await getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const { player_name, score, crystals_collected } = req.body;
    if (!player_name || score === undefined) {
      return res.status(400).json({ success: false, error: 'Nama pemain dan skor harus disertakan' });
    }

    const newRecord = await addLeaderboard(player_name, score, crystals_collected);
    res.status(201).json({ success: true, message: 'Skor berhasil dicatat', data: newRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/guestbook', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const entries = await getGuestbook(limit);
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const { name, message, avatar } = req.body;
    if (!name || !message) {
      return res.status(400).json({ success: false, error: 'Nama dan pesan tidak boleh kosong' });
    }

    const newEntry = await addGuestbook(name, message, avatar);
    res.status(201).json({ success: true, message: 'Pesan berhasil dipublikasikan', data: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 VibeCoding Bagas 2026 Server Berjalan!`);
    console.log(`  🔗 Akses Lokal: http://localhost:${PORT}`);
    console.log(`  🎮 Game 3D & REST API siap menerima koneksi.`);
    console.log(`======================================================\n`);
  });
}

export default app;
