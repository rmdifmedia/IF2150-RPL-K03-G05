// Helper pengujian integrasi (HIUPL Bab 4.3).
// Menyalakan server LawHub SUNGGUHAN (server.js) dengan basis data SQLite uji yang terpisah,
// sehingga pengujian melewati komponen nyata (route -> controller -> model -> basis data),
// bukan mock. Basis data asli (db/lawhub.db) tidak tersentuh.
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const Database = require('better-sqlite3');
const request = require('supertest');
const { io: ioClient } = require('socket.io-client');

const FOLDER_SRC = path.join(__dirname, '..', '..', '..');
const FOLDER_UPLOAD = path.join(FOLDER_SRC, 'uploads');

// cari port kosong supaya tidak bentrok dengan server yang sedang jalan (mis. npm run dev)
function cariPortKosong() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on('error', reject);
  });
}

function tungguServerSiap(proses, batasMs = 15000) {
  return new Promise((resolve, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error('Server tidak menyala:\n' + log)), batasMs);
    const baca = (data) => {
      log += data.toString();
      if (log.includes('LawHub berjalan')) {
        clearTimeout(timer);
        resolve();
      }
    };
    proses.stdout.on('data', baca);
    proses.stderr.on('data', baca);
    proses.on('exit', (kode) => {
      clearTimeout(timer);
      reject(new Error(`Server berhenti (kode ${kode}):\n${log}`));
    });
  });
}

// Menyalakan server + basis data uji. Dipanggil di beforeAll setiap file test.
async function siapkanLingkungan() {
  const port = await cariPortKosong();
  const dbPath = path.join(os.tmpdir(), `lawhub-integrasi-${process.pid}-${port}.db`);
  const uploadAwal = new Set(fs.existsSync(FOLDER_UPLOAD) ? fs.readdirSync(FOLDER_UPLOAD) : []);

  // nilai env ditulis eksplisit agar isi .env laptop tidak mengubah perilaku yang diuji
  const env = {
    ...process.env,
    PORT: String(port),
    DB_PATH: dbPath,
    SESSION_SECRET: 'rahasia-uji-integrasi',
    BYPASS_PEMBAYARAN: 'false',
    CEK_JADWAL_CHAT: 'true',
  };

  // 1) buat basis data uji dari schema.sql + data seed (sama seperti npm run db:init)
  execFileSync(process.execPath, ['db/init.js'], { cwd: FOLDER_SRC, env, stdio: 'ignore' });

  // 2) nyalakan server sungguhan
  let proses = spawn(process.execPath, ['server.js'], { cwd: FOLDER_SRC, env });
  await tungguServerSiap(proses);

  const url = `http://localhost:${port}`;
  const db = new Database(dbPath);

  const lingkungan = {
    url,
    db,
    dbPath,

    // matikan lalu nyalakan lagi server dengan basis data yang sama (uji persistensi)
    async restartServer() {
      proses.removeAllListeners('exit');
      proses.kill();
      await new Promise((r) => setTimeout(r, 300));
      proses = spawn(process.execPath, ['server.js'], { cwd: FOLDER_SRC, env });
      await tungguServerSiap(proses);
    },

    // dipanggil di afterAll: matikan server, hapus basis data uji dan berkas unggahan uji
    async bersihkan() {
      proses.removeAllListeners('exit');
      proses.kill();
      db.close();
      for (const akhiran of ['', '-wal', '-shm', '-journal']) {
        fs.rmSync(dbPath + akhiran, { force: true });
      }
      if (fs.existsSync(FOLDER_UPLOAD)) {
        for (const nama of fs.readdirSync(FOLDER_UPLOAD)) {
          if (!uploadAwal.has(nama)) fs.rmSync(path.join(FOLDER_UPLOAD, nama), { force: true });
        }
      }
    },
  };
  return lingkungan;
}

// Login lewat form sungguhan dan kembalikan "klien" yang membawa cookie sesi.
// halaman: '/login' untuk mitra & admin, '/login-masyarakat' untuk masyarakat.
async function login(url, email, kataSandi, halaman = '/login') {
  const res = await request(url).post(halaman).type('form').send({ email, kataSandi });
  const cookie = (res.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
  return buatKlien(url, cookie, res);
}

function buatKlien(url, cookie = '', resLogin = null) {
  return {
    cookie,
    resLogin,
    get: (p) => request(url).get(p).set('Cookie', cookie),
    post: (p) => request(url).post(p).set('Cookie', cookie).type('form'),
    // POST multipart (unggah berkas)
    postBerkas: (p) => request(url).post(p).set('Cookie', cookie),
  };
}

// Koneksi Socket.IO sungguhan dengan cookie sesi hasil login.
function sambungSocket(url, cookie, namespace = '/') {
  return new Promise((resolve, reject) => {
    const socket = ioClient(url + namespace, {
      transports: ['websocket'],
      extraHeaders: { Cookie: cookie },
      reconnection: false,
      forceNew: true,
    });
    socket.once('connect', () => resolve(socket));
    socket.once('connect_error', (err) => {
      socket.close();
      reject(err);
    });
  });
}

// Tunggu satu event socket (gagal bila tidak datang dalam batas waktu).
// syarat (opsional): hanya event yang datanya memenuhi syarat ini yang diterima.
function tungguEvent(socket, namaEvent, syarat = () => true, batasMs = 3000) {
  return new Promise((resolve, reject) => {
    const penerima = (data) => {
      if (!syarat(data)) return;
      clearTimeout(timer);
      socket.off(namaEvent, penerima);
      resolve(data);
    };
    const timer = setTimeout(() => {
      socket.off(namaEvent, penerima);
      reject(new Error(`Event "${namaEvent}" tidak diterima`));
    }, batasMs);
    socket.on(namaEvent, penerima);
  });
}

const jeda = (ms) => new Promise((r) => setTimeout(r, ms));

// Tanggal YYYY-MM-DD, n hari dari hari ini (zona WIB, sama dengan aplikasi)
function tanggalWib(n = 0) {
  const d = new Date(Date.now() + n * 86400000);
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' }).format(d);
}

// Jam sekarang di WIB, dibulatkan ke bawah per jam: "HH:00"
function jamWibSekarang() {
  const jam = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false })
    .format(new Date());
  return `${jam}:00`;
}

// Berkas palsu untuk unggahan (isi kecil, tipe sesuai yang diizinkan aplikasi)
const berkasPdf = (nama) => ({ buffer: Buffer.from('%PDF-1.4 berkas uji'), opsi: { filename: nama, contentType: 'application/pdf' } });
const berkasTeks = (nama) => ({ buffer: Buffer.from('bukan dokumen legal'), opsi: { filename: nama, contentType: 'text/plain' } });

module.exports = {
  FOLDER_UPLOAD,
  siapkanLingkungan,
  login,
  buatKlien,
  sambungSocket,
  tungguEvent,
  jeda,
  tanggalWib,
  jamWibSekarang,
  berkasPdf,
  berkasTeks,
};
