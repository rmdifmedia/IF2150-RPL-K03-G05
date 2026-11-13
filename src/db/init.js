const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./database');

db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

const hash = (teks) => bcrypt.hashSync(teks, 10);

db.prepare(
  'INSERT OR IGNORE INTO Admin (nama, email, sandi) VALUES (?, ?, ?)'
).run('Admin Uji', 'admin@lawhub.test', hash('admin123'));

db.prepare(
  'INSERT OR IGNORE INTO Masyarakat (nama, username, noHp, email, sandi) VALUES (?, ?, ?, ?, ?)'
).run('Sisi Masyarakat', 'sisi', '+6281234567890', 'sisi@lawhub.test', hash('sisi947'));

db.prepare(
  `INSERT OR IGNORE INTO MitraPengacara
   (nama, username, namaFirma, email, sandiMitra, validitas, statusVerifikasi, tagKeahlian, spesialisasi, rekeningPencairan)
   VALUES (?, ?, ?, ?, ?, 1, 'terverifikasi', ?, ?, ?)`
).run('Ami Pengacara', 'ami', 'Firma Ami', 'ami@lawhub.test', hash('ami657'),
      'pidana,perdata', 'Hukum Pidana', 'BCA 1234567890');

// dummy klien mitra ami
// --- data uji dashboard mitra ---
const hariKe = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

db.prepare('UPDATE MitraPengacara SET rating = 4.7, saldo = 1250000 WHERE email = ?').run('ami@lawhub.test');

const tambahMasy = db.prepare(
  'INSERT OR IGNORE INTO Masyarakat (nama, username, noHp, email, sandi) VALUES (?, ?, ?, ?, ?)'
);
tambahMasy.run('Rina Wijaya', 'rina', '+6281300000001', 'rina@lawhub.test', hash('rina123'));
tambahMasy.run('Tono Hartono', 'tono', '+6281300000002', 'tono@lawhub.test', hash('tono123'));

const ami = db.prepare('SELECT idMitra FROM MitraPengacara WHERE email = ?').get('ami@lawhub.test');
const masy = (email) => db.prepare('SELECT idMasyarakat AS id FROM Masyarakat WHERE email = ?').get(email).id;
const tambahSesi = db.prepare(
  `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi)
   VALUES (?, ?, ?, ?, ?)`
);
tambahSesi.run(masy('sisi@lawhub.test'), ami.idMitra, hariKe(2), '10:00', 'menunggu');
tambahSesi.run(masy('rina@lawhub.test'), ami.idMitra, hariKe(3), '13:00', 'menunggu');
tambahSesi.run(masy('tono@lawhub.test'), ami.idMitra, hariKe(5), '09:00', 'menunggu');
tambahSesi.run(masy('sisi@lawhub.test'), ami.idMitra, hariKe(1), '15:00', 'terjadwal');
tambahSesi.run(masy('rina@lawhub.test'), ami.idMitra, hariKe(4), '11:00', 'terjadwal');
tambahSesi.run(masy('tono@lawhub.test'), ami.idMitra, hariKe(6), '16:00', 'terjadwal');
tambahSesi.run(masy('sisi@lawhub.test'), ami.idMitra, hariKe(8), '10:30', 'terjadwal');

// dummy SearchLaw
const jumlahPasal = db.prepare('SELECT COUNT(*) AS n FROM DasarHukum').get().n;
if (jumlahPasal === 0) {
  const tambahPasal = db.prepare(
    'INSERT INTO DasarHukum (namaPeraturan, nomorPasal, isiPasal) VALUES (?, ?, ?)'
  );
  tambahPasal.run('Peraturan Contoh A', 'Pasal 1', 'Isi pasal contoh pertama (data uji).');
  tambahPasal.run('Peraturan Contoh A', 'Pasal 2', 'Isi pasal contoh kedua (data uji).');
  tambahPasal.run('Peraturan Contoh B', 'Pasal 10', 'Isi pasal contoh tentang kontrak (data uji).');
}

console.log('Database siap.');