# PRD — VibeCoding Bagas 2026 (Full-Stack 3D Interactive Web Experience)

**Author:** Bagaskara Amukti Palapa (@BagaskaraAP-Dev)  
**Status:** In Progress / Draft  
**Target Release:** 2026  
**Repository:** `BagaskaraAP-Dev/vibecodingbagas2026`

---

## 1. Executive Summary & Visi Produk

**VibeCoding Bagas 2026** adalah web aplikasi *Full-Stack* showcase yang menggabungkan:
1. **Interactive 3D Game / Canvas Experience** (menggunakan Three.js — terinspirasi dari arsitektur 3D *RS Bagas* dan tema retro-futuristik *latihan-vibecodingpolsri2026*).
2. **Modern Full-Stack Architecture**: Frontend interaktif yang berkomunikasi real-time dengan backend REST API (Express / Node.js) dan persistent database SQLite.
3. **Live Social Features**: Sistem leaderboard game global, visitor stats, dan interactive guestbook (buku tamu live).

Proyek ini menjadi **benchmark nyata pembuktian keahlian Full-Stack Vibe Coder**: bukan hanya template statis, melainkan web hidup dengan sistem grafis 3D, backend, database relasional, dan deployment siap produksi.

---

## 2. Arah Visual & Desain (Design Language)

- **Tema:** *Cyber-Neo Brutalism & Sci-Fi Voxel Universe*.
- **Palet Warna Utama:**
  - `Midnight Abyss`: `#090d16` (latar belakang dominan)
  - `Neon Emerald`: `#10b981` (indikator online & status sukses)
  - `Electric Cyan`: `#06b6d4` / `#38bdf8` (pencahayaan 3D, neon wireframe)
  - `Cyber Magenta`: `#ec4899` / `#f43f5e` (aksen tombol & game items)
  - `Vibrant Gold`: `#f59e0b` (skor & trophy leaderboard)
- **Karakter Tipografi:** Monospace display untuk elemen terminal & data; sans-serif modern ultra-clean untuk teks antarmuka.

---

## 3. Fitur Utama & Modul Sistem

### A. Modul 3D Interactive Game ("Vibe Realm Exploration")
- **Viewport:** Canvas 3D Three.js yang terintegrasi halus ke dalam hero layout (bisa full-screen mode).
- **Kontrol:** WASD / Arrow keys untuk desktop, serta On-Screen D-Pad / Touch controls untuk perangkat mobile.
- **Mekanika Gameplay:**
  - Player mengendalikan drone / rover sci-fi yang menjelajahi platform pulau digital.
  - Mengumpulkan "Vibe Crystals" dan "Bug Fix Tokens" untuk menambah skor dan multiplier.
  - Menghindari hazard / rintangan glitch arena.
  - Game Over & Win conditions yang memicu form submit skor langsung ke server backend.
- **Lighting & Visual FX:** Ambient neon glow, particle dust, grid floor synthwave, dan smooth camera damping.
- **Audio:** Web Audio API synth SFX bawaan (tanpa beban download file mp3 berat).

### B. Modul Full-Stack Backend & REST API
- **Engine:** Node.js + Express.js.
- **Database:** SQLite3 (`database.sqlite`) dengan WAL mode untuk keandalan dan kecepatan tinggi tanpa dependensi eksternal.
- **Endpoints:**
  1. `GET /api/health` — Status kesehatan server, uptime, dan versi sistem.
  2. `GET /api/leaderboard` — Mengambil Top 10 skor tertinggi.
  3. `POST /api/leaderboard` — Validasi & penyimpanan skor game baru (player name, score, level).
  4. `GET /api/guestbook` — Mengambil daftar pesan dan dukungan pengunjung terbaru.
  5. `POST /api/guestbook` — Pengiriman pesan buku tamu dengan sanitasi input anti-XSS.
  6. `GET /api/stats` — Statistik langsung (total game dimainkan, total skor dicetak, total pesan).

### C. Modul Frontend Interaktif (Client Experience)
- **HUD & Status Bar:** Menampilkan ping API, status server live, jumlah pemain, dan kontrol audio (Mute/Unmute).
- **Interactive Leaderboard Panel:** Tampilan peringkat real-time dengan medali (Emas, Perak, Perunggu).
- **Cyber Guestbook:** Pengunjung bisa meninggalkan pesan, memilih avatar avatar cyberpunk, dan melihat pesan mereka muncul seketika.
- **Responsive Layout:** 100% responsif dari resolusi mobile (360px) hingga monitor ultrawide (4K).

---

## 4. Spesifikasi Database Schema

```sql
-- Tabel Peringkat Game
CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    crystals_collected INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Buku Tamu
CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    avatar TEXT DEFAULT 'drone',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Non-Functional Requirements & Standar Mutu

1. **Zero External Heavy Assets:** Semua model 3D, partikel, tekstur prosedural, dan efek audio dibangkitkan via kode murni untuk kecepatan load instan (< 1.5 detik).
2. **Cross-Platform & Offline-Friendly:** Berjalan mulus di Chrome, Firefox, Safari, Edge, Android, dan iOS.
3. **Security:** Proteksi input XSS, rate-limiting sederhana pada endpoint POST, dan query parameter terproteksi dari SQL Injection (prepared statements).
4. **Deployability:** Siap dijalankan secara lokal dengan `npm start` atau `node server.js`, serta mudah di-deploy ke Vercel / Railway / Render.

---

## 6. Milestone Roadmap Pelaksanaan

- [ ] **Milestone 1:** Finalisasi PRD & spesifikasi arsitektur (`PRD.md`, `SPECIFICATION.md`).
- [ ] **Milestone 2:** Setup repositori lokal & GitHub remote `vibecodingbagas2026`.
- [ ] **Milestone 3:** Pembangunan Backend API & Database SQLite lengkap dengan test suites.
- [ ] **Milestone 4:** Pembangunan 3D Game Engine (Three.js + procedural sci-fi arena + player controls).
- [ ] **Milestone 5:** Integrasi Frontend UI (HUD, Leaderboard, Guestbook, responsive design).
- [ ] **Milestone 6:** Verifikasi end-to-end, testing, commit, dan push ke GitHub.
