import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.sqlite');

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  // Init tables
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      crystals_collected INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      avatar TEXT DEFAULT 'drone',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if empty
  const countLeaderboard = await dbInstance.get('SELECT COUNT(*) as count FROM leaderboard');
  if (countLeaderboard.count === 0) {
    await dbInstance.run(`
      INSERT INTO leaderboard (player_name, score, crystals_collected)
      VALUES 
        ('Bagas VibeMaster', 3500, 25),
        ('CyberPilot', 2800, 19),
        ('AeroRacer', 1950, 14),
        ('LunarGlitch', 1200, 8);
    `);
  }

  const countGuestbook = await dbInstance.get('SELECT COUNT(*) as count FROM guestbook');
  if (countGuestbook.count === 0) {
    await dbInstance.run(`
      INSERT INTO guestbook (name, message, avatar)
      VALUES 
        ('BagaskaraAP-Dev', 'Selamat datang di VibeCoding 2026! Coba kalahkan high score di game 3D!', 'drone'),
        ('Cyber Visitor', '3D synthwave areanya keren banget bro! Mantap full-stacknya.', 'rover'),
        ('Tech Explorer', 'Desain neo-brutalism + WebGL Three.js mantap jiwa.', 'glitch');
    `);
  }

  return dbInstance;
}

export async function getLeaderboard(limit = 10) {
  const db = await getDb();
  return db.all('SELECT * FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT ?', [limit]);
}

export async function addLeaderboard(playerName, score, crystals = 0) {
  const db = await getDb();
  const safeName = String(playerName || 'Anonymous').trim().slice(0, 30);
  const safeScore = Math.max(0, parseInt(score, 10) || 0);
  const safeCrystals = Math.max(0, parseInt(crystals, 10) || 0);

  const result = await db.run(
    'INSERT INTO leaderboard (player_name, score, crystals_collected) VALUES (?, ?, ?)',
    [safeName, safeScore, safeCrystals]
  );
  return { id: result.lastID, player_name: safeName, score: safeScore, crystals_collected: safeCrystals };
}

export async function getGuestbook(limit = 20) {
  const db = await getDb();
  return db.all('SELECT * FROM guestbook ORDER BY id DESC LIMIT ?', [limit]);
}

export async function addGuestbook(name, message, avatar = 'drone') {
  const db = await getDb();
  const safeName = String(name || 'Anon').trim().slice(0, 30);
  const safeMessage = String(message || '').trim().slice(0, 200);
  const validAvatars = ['drone', 'rover', 'glitch', 'pilot'];
  const safeAvatar = validAvatars.includes(avatar) ? avatar : 'drone';

  if (!safeMessage) {
    throw new Error('Pesan tidak boleh kosong');
  }

  const result = await db.run(
    'INSERT INTO guestbook (name, message, avatar) VALUES (?, ?, ?)',
    [safeName, safeMessage, safeAvatar]
  );
  return { id: result.lastID, name: safeName, message: safeMessage, avatar: safeAvatar };
}

export async function getStats() {
  const db = await getDb();
  const totalGames = await db.get('SELECT COUNT(*) as count FROM leaderboard');
  const topScore = await db.get('SELECT MAX(score) as maxScore FROM leaderboard');
  const totalCrystals = await db.get('SELECT SUM(crystals_collected) as sumCrystals FROM leaderboard');
  const totalGuestMessages = await db.get('SELECT COUNT(*) as count FROM guestbook');

  return {
    totalGames: totalGames.count,
    topScore: topScore.maxScore || 0,
    totalCrystals: totalCrystals.sumCrystals || 0,
    totalGuestMessages: totalGuestMessages.count
  };
}
