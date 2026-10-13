# 🚀 MOONCRUST // PIXEL AI STUDIO & COMMAND CENTER

Aplikasi web simulasi Mission Control Dashboard bergaya **2D Pixel Art & Retro Isometric Game** dengan **4 Autonomous Specialist Sub-Agents** yang bergerak, berinteraksi, dan bekerja sama dalam rantai tugas rekayasa perangkat lunak (*Auto-Pipeline Mode*).

---

## 🌟 Fitur Utama

### 1. Ruangan Studio Pixel & Lingkungan Interaktif
- **HTML5 Canvas 2D Pixel Simulator (960x540):** Simulasi frame-by-frame dengan lantai berpetak (*checkered floor*), interior detail, dan efek scanline retro.
- **Papan Neon Menyala "MOONCRUST":** Efek neon berpendar (*diffuse glow*) dinamis di dinding ruangan.
- **Interior & Fasilitas Lengkap:**
  - 🖥️ **Rak Server Multi-Blade:** Lampu LED berkedip asinkron, ventilasi kisi-kisi, dan kabel loom fiber.
  - 📋 **Papan Tulis Agile (Whiteboard):** Sticky notes, sprint backlog kolom TODO/DOING/DONE, dan diagram arsitektur.
  - ☕ **Pojok Mesin Kopi:** Partikel uap animasi bergerak naik, cangkir kopi, dan galon air.
  - 🪴 **Tanaman Pixel:** Tanaman monstera berarsir di sudut ruangan.
  - 🌌 **Jendela Observasi:** Pemandangan langit berbintang malam hari dan permukaan bulan dengan satelit melintas.

### 2. 4 Karakter Sub-Agent Spesialis
1. **[UI/UX-Bot] (Kostum Cyan - Meja Drawing Tablet & Wireframe):**
   - Merancang user flows, struktur wireframe halaman, sistem desain (*color tokens, typography*), dan verifikasi heuristik usability.
2. **[FE-Bot] (Kostum Biru - Meja Dual Monitor UI):**
   - Mengubah wireframe menjadi kode nyata (HTML5 semantic, CSS3/Tailwind, JavaScript modern), responsivitas layar, dan komponen interaktif dengan live preview.
3. **[BE-Bot] (Kostum Ungu - Meja Server Rack Console):**
   - Merancang skema relasional database (SQL DDL, indexing, constraints), arsitektur REST API, autentikasi JWT, dan integrasi server.
4. **[SEC-Bot] (Kostum Merah/Emas - Meja Radar & Terminal Hijau):**
   - Spesialis Cyber Security & CTF Solver: Audit celah OWASP Top 10 (SQLi, XSS, CSRF, IDOR), simulator CTF crypto & reverse solver, serta security hardening patch.

### 3. Sistem Kerja Otonom & Auto-Pipeline Mode
- **Autonomous Room Loop:** Saat idle, karakter secara berkala berjalan mengambil kopi, memeriksa server, meninjau papan tulis, mendatangi rekan untuk berdiskusi, dan memunculkan balon teks (*speech bubble*).
- **Auto-Pipeline Mode:** Menjalankan alur sekuensial kolaboratif (UI/UX ➔ FE ➔ BE ➔ SEC) untuk menghasilkan artefak rekayasa lengkap berdasarkan topik tugas.
- **Inspector Telemetry:** Klik agen mana pun untuk melihat metrik efisiensi, status, stasiun kerja, dan pemikiran terkini.
- **8-Bit Web Audio Synthesizer:** Efek suara retro prosedural (blip teks, ketukan keyboard, radar sweep, chime progres, dan level-up fanfare) dengan tombol mute/unmute.

---

## 🛠️ Menjalankan Secara Lokal

```bash
# Clone repository
git clone git@github.com:BagaskaraAP-Dev/vibecodingbagas2026.git
cd vibecodingbagas2026

# Install dependencies
npm install

# Jalankan server
npm start
```
Buka browser pada `http://localhost:3000`.

---

## 🚀 Deployment

Dideploy secara publik ke Vercel Edge Network menggunakan Vercel CLI.
