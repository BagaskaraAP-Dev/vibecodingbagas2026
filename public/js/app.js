// Client Application Controller - REST API Integration
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Game
  const game = new window.VibeGame3D('game-canvas-container');

  // DOM Elements
  const btnStartGame = document.getElementById('btn-start-game');
  const btnRestartGame = document.getElementById('btn-restart-game');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const scoreModal = document.getElementById('score-modal');
  const modalClose = document.getElementById('modal-close');
  const formSubmitScore = document.getElementById('form-submit-score');
  const modalFinalScore = document.getElementById('modal-final-score');
  const modalFinalCrystals = document.getElementById('modal-final-crystals');
  const modalReason = document.getElementById('modal-reason');

  const leaderboardList = document.getElementById('leaderboard-list');
  const guestbookList = document.getElementById('guestbook-list');
  const formGuestbook = document.getElementById('form-guestbook');
  const apiStatusBadge = document.getElementById('api-status-badge');
  const toast = document.getElementById('toast');

  let lastGameStats = { score: 0, crystals: 0 };

  // Toast Helper
  const showToast = (message, isError = false) => {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${isError ? 'toast-error' : 'toast-success'}`;
    setTimeout(() => {
      toast.className = 'toast';
    }, 3500);
  };

  // Sound Toggle
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      if (window.soundSynth) {
        const isMuted = window.soundSynth.toggleMute();
        btnToggleSound.textContent = isMuted ? '🔇 Audio OFF' : '🔊 Audio ON';
        showToast(isMuted ? 'Suara dinonaktifkan' : 'Suara diaktifkan');
      }
    });
  }

  // Game Lifecycle Listeners
  if (btnStartGame) {
    btnStartGame.addEventListener('click', () => {
      game.start();
      btnStartGame.style.display = 'none';
      if (btnRestartGame) btnRestartGame.style.display = 'inline-block';
      showToast('Game 3D Dimulai! Kendalikan dengan W,A,S,D atau D-Pad.');
    });
  }

  if (btnRestartGame) {
    btnRestartGame.addEventListener('click', () => {
      game.start();
      showToast('Game di-restart!');
    });
  }

  // Game Finished Callback
  window.onGameFinished = (data) => {
    lastGameStats = data;
    if (modalFinalScore) modalFinalScore.textContent = data.score;
    if (modalFinalCrystals) modalFinalCrystals.textContent = data.crystals;
    if (modalReason) modalReason.textContent = data.reason;
    if (scoreModal) scoreModal.classList.add('active');
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (scoreModal) scoreModal.classList.remove('active');
    });
  }

  // Handle Score Submit
  if (formSubmitScore) {
    formSubmitScore.addEventListener('submit', async (e) => {
      e.preventDefault();
      const playerName = document.getElementById('input-player-name').value.trim();
      if (!playerName) {
        showToast('Masukkan nama pilot Anda!', true);
        return;
      }

      try {
        const res = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_name: playerName,
            score: lastGameStats.score,
            crystals_collected: lastGameStats.crystals
          })
        });
        const result = await res.json();
        if (result.success) {
          showToast('Skor berhasil masuk ke Hall of Fame!');
          if (scoreModal) scoreModal.classList.remove('active');
          loadLeaderboard();
          loadStats();
        } else {
          showToast(result.error || 'Gagal menyimpan skor', true);
        }
      } catch (err) {
        showToast('Koneksi ke backend terputus', true);
      }
    });
  }

  // Load API Health
  async function checkHealth() {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'online' && apiStatusBadge) {
        apiStatusBadge.innerHTML = `<span class="pulse-dot"></span> LIVE BACKEND (Port 3000) • v${data.version}`;
        apiStatusBadge.classList.add('badge-online');
      }
    } catch {
      if (apiStatusBadge) {
        apiStatusBadge.innerHTML = `<span class="pulse-dot red"></span> SERVER OFFLINE`;
        apiStatusBadge.classList.remove('badge-online');
      }
    }
  }

  // Load Leaderboard
  async function loadLeaderboard() {
    if (!leaderboardList) return;
    try {
      const res = await fetch('/api/leaderboard?limit=8');
      const json = await res.json();
      if (!json.success || !json.data) return;

      leaderboardList.innerHTML = '';
      json.data.forEach((item, index) => {
        let badge = `#${index + 1}`;
        let badgeClass = 'rank-normal';
        if (index === 0) { badge = '🥇 1st'; badgeClass = 'rank-gold'; }
        else if (index === 1) { badge = '🥈 2nd'; badgeClass = 'rank-silver'; }
        else if (index === 2) { badge = '🥉 3rd'; badgeClass = 'rank-bronze'; }

        const row = document.createElement('div');
        row.className = `leaderboard-item ${badgeClass}`;
        row.innerHTML = `
          <div class="rank-badge">${badge}</div>
          <div class="player-info">
            <span class="player-name">${escapeHtml(item.player_name)}</span>
            <span class="crystal-tag">💎 ${item.crystals_collected || 0} Crystals</span>
          </div>
          <div class="player-score">${item.score.toLocaleString()} PTS</div>
        `;
        leaderboardList.appendChild(row);
      });
    } catch (err) {
      leaderboardList.innerHTML = '<div class="empty-state">Gagal memuat peringkat.</div>';
    }
  }

  // Load Guestbook
  async function loadGuestbook() {
    if (!guestbookList) return;
    try {
      const res = await fetch('/api/guestbook?limit=12');
      const json = await res.json();
      if (!json.success || !json.data) return;

      guestbookList.innerHTML = '';
      json.data.forEach((entry) => {
        const card = document.createElement('div');
        card.className = 'guestbook-card';
        card.innerHTML = `
          <div class="card-header">
            <span class="avatar-tag">${getAvatarEmoji(entry.avatar)} ${escapeHtml(entry.name)}</span>
            <span class="card-time">${formatDate(entry.created_at)}</span>
          </div>
          <p class="card-msg">${escapeHtml(entry.message)}</p>
        `;
        guestbookList.appendChild(card);
      });
    } catch (err) {
      guestbookList.innerHTML = '<div class="empty-state">Gagal memuat buku tamu.</div>';
    }
  }

  // Handle Guestbook Form
  if (formGuestbook) {
    formGuestbook.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputName = document.getElementById('input-guest-name');
      const inputMsg = document.getElementById('input-guest-msg');
      const selectAvatar = document.getElementById('select-guest-avatar');

      const name = inputName.value.trim();
      const message = inputMsg.value.trim();
      const avatar = selectAvatar ? selectAvatar.value : 'drone';

      if (!name || !message) {
        showToast('Isi nama dan pesan terlebih dahulu!', true);
        return;
      }

      try {
        const res = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, message, avatar })
        });
        const result = await res.json();
        if (result.success) {
          showToast('Pesan berhasil dipublikasikan!');
          inputMsg.value = '';
          loadGuestbook();
          loadStats();
        } else {
          showToast(result.error || 'Gagal mengirim pesan', true);
        }
      } catch (err) {
        showToast('Koneksi ke backend gagal', true);
      }
    });
  }

  // Load Stats
  async function loadStats() {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success && json.stats) {
        const elStatsGames = document.getElementById('stat-total-games');
        const elStatsTopScore = document.getElementById('stat-top-score');
        const elStatsMessages = document.getElementById('stat-total-msgs');

        if (elStatsGames) elStatsGames.textContent = json.stats.totalGames;
        if (elStatsTopScore) elStatsTopScore.textContent = json.stats.topScore.toLocaleString();
        if (elStatsMessages) elStatsMessages.textContent = json.stats.totalGuestMessages;
      }
    } catch {}
  }

  function getAvatarEmoji(avatar) {
    switch (avatar) {
      case 'drone': return '🛸';
      case 'rover': return '🚙';
      case 'glitch': return '👾';
      case 'pilot': return '🧑‍🚀';
      default: return '⚡';
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Baru saja';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  // Initial Loads
  checkHealth();
  loadLeaderboard();
  loadGuestbook();
  loadStats();
  setInterval(checkHealth, 15000);
});
