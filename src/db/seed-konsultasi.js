// Data uji UC10-12 (fiktif). Jalankan setelah db:init:  npm run db:seed-konsultasi
// Membuat: 1 kasus untuk 'sisi', 1 permintaan menunggu ke 'ami', 1 sesi terjadwal+lunas hari ini (WIB) untuk 'ami'.
const db = require('./database');
const Sesi = require('../models/SesiKonsultasi');

const sisi = db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get();
const ami = db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'ami'").get();
if (!sisi || !ami) { console.error('Jalankan npm run db:init dulu.'); process.exit(1); }

let kasus = db.prepare('SELECT idKasus FROM Kasus WHERE idMasyarakat = ? LIMIT 1').get(sisi.idMasyarakat);
if (!kasus) {
  const r = db.prepare(
    'INSERT INTO Kasus (idMasyarakat, judulKasus, kategoriMasalah, deskripsi) VALUES (?, ?, ?, ?)'
  ).run(sisi.idMasyarakat, 'Sengketa sewa kontrakan', 'Hukum Perdata',
    'Pemilik kontrakan menaikkan harga sewa sepihak di tengah masa kontrak dan mengancam mengusir. (data uji)');
  kasus = { idKasus: Number(r.lastInsertRowid) };
}

const { tanggal } = Sesi.wibSekarang();
const besok = new Date(Date.now() + 86400000 + 7 * 3600000).toISOString().slice(0, 10);

// 1) permintaan baru, menunggu tanggapan mitra
Sesi.buat({ idMasyarakat: sisi.idMasyarakat, idMitra: ami.idMitra, idKasus: kasus.idKasus, tanggal: besok, waktu: '14:00' });

// 2) sesi terjadwal & lunas hari ini, siap dipakai chat (set CEK_JADWAL_CHAT=false bila di luar jam slot)
const id = db.prepare(
  `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, idKasus, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
   VALUES (?, ?, ?, ?, '16:00', 'terjadwal', 'lunas', ?)`
).run(sisi.idMasyarakat, ami.idMitra, kasus.idKasus, tanggal, new Date().toISOString()).lastInsertRowid;

console.log('Seed konsultasi selesai. Sesi chat uji: idSesi =', Number(id));
