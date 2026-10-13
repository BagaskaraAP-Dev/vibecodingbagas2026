# VibeCoding Bagas 2026 🚀

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg)](https://threejs.org/)
[![Database](https://img.shields.io/badge/SQLite-WAL--Mode-blue.svg)](https://sqlite.org/)
[![Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)](https://github.com/BagaskaraAP-Dev/vibecodingbagas2026)

Aplikasi Web **Full-Stack 3D Interactive Experience** yang dibangun dari awal oleh **Bagaskara Amukti Palapa** (@BagaskaraAP-Dev) dengan metodologi murni **Vibe Coding**.

Menggabungkan eksplorasi dunia 3D WebGL (Three.js), kontrol rover/drone interaktif, efek suara prosedural Web Audio API, serta persistent backend REST API dengan database relasional SQLite.

---

## 🌟 Fitur Utama

1. **🎮 3D Cyber Realm Arena (Three.js)**
   - Grafis 3D procedural synthwave dengan dynamic lighting dan particle burst.
   - Kontrol navigasi mulus menggunakan keyboard (`W`, `A`, `S`, `D` / Panah) dan On-screen D-Pad untuk mobile touch.
   - Mekanisme kumpul kristal energi, perisai, dan rintangan glitch.
2. **🔊 Zero-Asset Sound Synthesizer (Web Audio API)**
   - Efek suara audio instan tanpa file MP3 atau latency download.
3. **🏆 Global Hall of Fame Leaderboard**
   - Skor game otomatis dicatat ke database SQLite via REST API `POST /api/leaderboard`.
   - Menampilkan podium medali (Emas, Perak, Perunggu).
4. **📡 Cyber Guestbook (Buku Tamu Real-time)**
   - Pengunjung dapat mengirim pesan langsung dengan pilihan avatar cyberpunk.
5. **📊 Live Server Stats & Health Check**
   - Status server online live, total permainan, dan rekor skor tertinggi.

---

## 🏗️ Spesifikasi & Arsitektur

- **Dokumen Produk:** Baca selengkapnya di [PRD.md](PRD.md).
- **Spesifikasi Teknis:** Baca selengkapnya di [SPECIFICATION.md](SPECIFICATION.md).

```text
vibecodingbagas2026/
├── PRD.md                       # Product Requirements Document
├── SPECIFICATION.md             # Technical Architecture Specification
├── README.md                    # Dokumentasi proyek
├── package.json                 # Dependencies & scripts
├── server.js                    # Express REST API server & static serving
├── db.js                        # Database connection & SQLite schema
├── test/
│   └── api.test.js              # Automated test suite
└── public/
    ├── index.html               # Main landing page & 3D game UI
    ├── css/
    │   ├── style.css            # Neo-brutalist styling & HUD
    │   └── game.css             # 3D canvas viewport & controls
    └── js/
        ├── audio.js             # Web Audio API sound synthesizer
        ├── game.js              # Three.js 3D game loop & physics
        └── app.js               # Client controller & REST API consumer
```

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/BagaskaraAP-Dev/vibecodingbagas2026.git
   cd vibecodingbagas2026
   ```

2. **Pasang dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan pengujian otomatis:**
   ```bash
   npm test
   ```

4. **Jalankan server aplikasi:**
   ```bash
   npm start
   ```

5. **Buka di peramban web:**
   Akses `http://localhost:3000`

---

## 📡 Dokumentasi Endpoint REST API

| Method | Endpoint | Keterangan |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status server, uptime, dan versi |
| `GET` | `/api/stats` | Statistik total game & buku tamu |
| `GET` | `/api/leaderboard` | Mengambil Top 10 skor tertinggi |
| `POST` | `/api/leaderboard` | Menyimpan skor game baru |
| `GET` | `/api/guestbook` | Mengambil daftar pesan buku tamu |
| `POST` | `/api/guestbook` | Mengirim pesan baru ke buku tamu |

---

## 👨‍💻 Pengembang
Dibuat oleh **Bagaskara Amukti Palapa** ([@BagaskaraAP-Dev](https://github.com/BagaskaraAP-Dev))  
Palembang, Indonesia.
