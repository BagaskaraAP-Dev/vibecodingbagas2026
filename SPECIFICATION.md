# Technical Specification — VibeCoding Bagas 2026

**Repository:** `vibecodingbagas2026`  
**Stack:** Node.js, Express, SQLite3, Three.js, Web Audio API, Modern CSS3 & Vanilla ES6+

---

## 1. Struktur Direktori Proyek

```text
vibecodingbagas2026/
├── PRD.md                       # Product Requirements Document
├── SPECIFICATION.md             # Technical Architecture Specification
├── README.md                    # Panduan instalasi, fitur & dokumentasi
├── package.json                 # Node.js dependencies & scripts
├── server.js                    # Express REST API server & static serving
├── db.js                        # Database connection & SQLite schema initialization
├── public/                      # Static client assets
│   ├── index.html               # Main landing page & 3D game container
│   ├── css/
│   │   ├── style.css            # Cyber neo-brutalist styling & HUD
│   │   └── game.css             # 3D canvas overlay, touch d-pad & modals
│   └── js/
│       ├── audio.js             # Procedural Web Audio API synth sound FX
│       ├── game.js              # Three.js 3D Game loop, physics & controls
│       └── app.js               # API consumer, leaderboard & guestbook controller
└── test/
    └── api.test.js              # Automated backend test suite
```

---

## 2. Kontrak REST API (API Contracts)

### A. Health & Status Check
- **Endpoint:** `GET /api/health`
- **Response:**
  ```json
  {
    "status": "online",
    "service": "VibeCoding Bagas 2026",
    "version": "1.0.0",
    "uptime": 128.4,
    "timestamp": "2026-10-14T02:50:00.000Z"
  }
  ```

### B. Leaderboard (Game Score)
- **Endpoint:** `GET /api/leaderboard`
  - **Response:** `[ { "id": 1, "player_name": "Bagas", "score": 2500, "crystals_collected": 15, "created_at": "..." }, ... ]`
- **Endpoint:** `POST /api/leaderboard`
  - **Request Body:**
    ```json
    {
      "player_name": "CyberPilot",
      "score": 1850,
      "crystals_collected": 12
    }
    ```
  - **Response:** `{ "success": true, "message": "Score saved", "id": 2 }`

### C. Cyber Guestbook
- **Endpoint:** `GET /api/guestbook`
  - **Response:** `[ { "id": 1, "name": "Visitor", "message": "Keren game 3D-nya!", "avatar": "drone", "created_at": "..." }, ... ]`
- **Endpoint:** `POST /api/guestbook`
  - **Request Body:**
    ```json
    {
      "name": "Alex",
      "message": "Vibe codingnya berasa banget!",
      "avatar": "rover"
    }
    ```
  - **Response:** `{ "success": true, "message": "Pesan berhasil ditambahkan", "id": 3 }`

---

## 3. Arsitektur 3D Game Engine (Three.js)

1. **Procedural World Generation:**
   - Grid floor dengan neon glowing lines (synthwave aesthetic).
   - Pilar-pilar cyber & floating platforms.
   - Kristal energi (rotating octahedron / icosahedron dengan glowing point light).
   - Anomali glitch / hazard (kubus berputar dengan deteksi tabrakan AABB sederhana).
2. **Player Controller:**
   - Model pemain: Sci-fi Drone / Cyber Rover dengan thruster glow.
   - Keyboard listener: `W`, `A`, `S`, `D` & Arrow Keys.
   - Virtual Joystick / On-screen buttons untuk mobile touch.
   - Kamera: Smooth third-person follow camera dengan lerp damping.
3. **Sound Synthesizer (Zero-Asset Web Audio):**
   - Crystal collect: High-pitch sine wave arp (`~880Hz -> 1320Hz`).
   - Hazard hit: Low square wave rumble with noise filter.
   - Level start / Game over: Synth brass chords.

---

## 4. Keamanan & Performa

- **Database Safety:** Semua query SQLite menggunakan *prepared statements* parameterized untuk mencegah SQL Injection.
- **XSS Sanitization:** Semua string nama & pesan buku tamu disanitasi sebelum dikembalikan ke HTML.
- **Lightweight Footprint:** Menggunakan Three.js r128 yang efisien, tanpa asset 3D berukuran puluhan megabyte.
