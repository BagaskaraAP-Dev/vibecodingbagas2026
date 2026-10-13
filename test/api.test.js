import assert from 'assert';
import { getLeaderboard, addLeaderboard, getGuestbook, addGuestbook, getStats } from '../db.js';

async function runTests() {
  console.log('🧪 Memulai Test Suite VibeCoding Bagas 2026...');

  // Test 1: Get initial stats
  const initialStats = await getStats();
  assert(initialStats.totalGames >= 0, 'Stats totalGames should be a number');
  console.log('  ✓ Test 1: Database stats terverifikasi');

  // Test 2: Add leaderboard score
  const newPlayer = 'TestVibeRunner_' + Date.now();
  const addedScore = await addLeaderboard(newPlayer, 9999, 42);
  assert.strictEqual(addedScore.player_name, newPlayer);
  assert.strictEqual(addedScore.score, 9999);
  assert.strictEqual(addedScore.crystals_collected, 42);
  console.log('  ✓ Test 2: Insert leaderboard record berhasil');

  // Test 3: Get leaderboard top rank
  const leaders = await getLeaderboard(5);
  assert(leaders.length > 0, 'Leaderboard must not be empty');
  assert.strictEqual(leaders[0].score, 9999, 'Top score should be 9999');
  console.log('  ✓ Test 3: Leaderboard sorting & query valid');

  // Test 4: Add guestbook entry
  const guestMsg = 'Pesan uji coba otomatis ' + Date.now();
  const guestEntry = await addGuestbook('TesterBot', guestMsg, 'glitch');
  assert.strictEqual(guestEntry.name, 'TesterBot');
  assert.strictEqual(guestEntry.message, guestMsg);
  console.log('  ✓ Test 4: Guestbook submit berhasil');

  // Test 5: Verify guestbook retrieval
  const entries = await getGuestbook(5);
  assert(entries.some(e => e.message === guestMsg), 'New guest message should exist in guestbook');
  console.log('  ✓ Test 5: Guestbook retrieval verified');

  console.log('\n🎉 SEMUA 5/5 TEST BACKEND & DATABASE LULUS DENGAN SEMPURNA!\n');
}

runTests().catch(err => {
  console.error('❌ Test gagal:', err);
  process.exit(1);
});
