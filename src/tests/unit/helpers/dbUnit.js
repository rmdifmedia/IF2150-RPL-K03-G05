// Helper pengujian unit (HIUPL Bab 4.2).
// Membuat salinan basis data SQLite sementara di os.tmpdir() lewat DB_PATH
//sehingga basis data utama (db/lawhub.db) tidak pernah tersentuh.
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const FOLDER_SRC = path.join(__dirname, '..', '..', '..');

function siapkanDbUnit() {
  const unik = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const dbPath = path.join(os.tmpdir(), `lawhub-unit-${unik}.db`);

  process.env.DB_PATH = dbPath;
  process.env.SESSION_SECRET = 'rahasia-uji-unit';
  process.env.CHAT_KEY = 'kunci-chat-uji-unit-32-byte-ok!!';
  process.env.BYPASS_PEMBAYARAN = 'false';
  process.env.CEK_JADWAL_CHAT = 'true';

  execFileSync(process.execPath, ['db/init.js'], {
    cwd: FOLDER_SRC,
    env: { ...process.env, DB_PATH: dbPath },
    stdio: 'ignore',
  });

  if (typeof jest !== 'undefined' && jest.resetModules) {
    jest.resetModules();
  }

  const db = require('../../../db/database');

  return {
    db,
    dbPath,
    bersihkan() {
      try {
        if (db && db.open) db.close();
      } catch (_) {}
      for (const akhiran of ['', '-wal', '-shm', '-journal']) {
        fs.rmSync(dbPath + akhiran, { force: true });
      }
    },
  };
}

function tanggalWib(n = 0) {
  const d = new Date(Date.now() + n * 86400000);
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' }).format(d);
}

module.exports = { siapkanDbUnit, tanggalWib };