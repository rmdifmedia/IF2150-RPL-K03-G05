// Data uji untuk modul transaksi (jalankan: node db/seed-transaksi.js)
// Login uji: masyarakat "uji@mail.com" / mitra "mitra@mail.com", sandi "rahasia123"
const bcrypt = require('bcryptjs');
const db = require('./database');
const h = bcrypt.hashSync('rahasia123', 10);

const ma = db.prepare(`INSERT OR IGNORE INTO Masyarakat (nama, username, nohp, email, sandi) VALUES ('Warga Uji','warga_uji','+6281200000000','uji@mail.com',?)`).run(h);
const mi = db.prepare(`INSERT OR IGNORE INTO MitraPengacara (nama, email, username, sandiMitra, statusVerifikasi, validitas, tagKeahlian) VALUES ('Mitra Uji','mitra@mail.com','mitra_uji',?, 'terverifikasi', 1, 'Hukum Pidana, Hukum Perdata')`).run(h);
const idMa = db.prepare('SELECT idMasyarakat id FROM Masyarakat WHERE email=?').get('uji@mail.com').id;
const idMi = db.prepare('SELECT idMitra id FROM MitraPengacara WHERE email=?').get('mitra@mail.com').id;
const kasus = db.prepare(`INSERT INTO Kasus (idMasyarakat, judulKasus, kategoriMasalah, deskripsi) VALUES (?, 'Sengketa sewa', 'Hukum Perdata', 'Uji')`).run(idMa).lastInsertRowid;

// 1) sesi terjadwal belum dibayar -> /transaksi/pembayaran/<id>
const s1 = db.prepare(`INSERT INTO SesiKonsultasi (idMasyarakat,idMitra,idKasus,tanggalJadwal,waktuJadwal,statusSesi) VALUES (?,?,?,date('now','+1 day'),'10:00','terjadwal')`).run(idMa, idMi, kasus).lastInsertRowid;
// 2) sesi lunas & selesai -> riwayat + ulasan
const s2 = db.prepare(`INSERT INTO SesiKonsultasi (idMasyarakat,idMitra,idKasus,tanggalJadwal,waktuJadwal,statusSesi,statusKonsul,statusPembayaran,waktuSelesai) VALUES (?,?,?,date('now','-1 day'),'09:00','siap dimulai','selesai','lunas',datetime('now'))`).run(idMa, idMi, kasus).lastInsertRowid;
db.prepare(`INSERT INTO PesanChat (idSesi, peranPengirim, idPengirim, isiPesan) VALUES (?, 'masyarakat', ?, 'Halo, saya mau tanya soal sewa'), (?, 'mitra', ?, 'Baik, silakan ceritakan')`).run(s2, idMa, s2, idMi);
db.prepare(`UPDATE MitraPengacara SET saldo = 500000, rekeningPencairan = 'BCA|1234567890|Mitra Uji' WHERE idMitra = ?`).run(idMi);
console.log({ sesiBelumBayar: s1, sesiSelesai: s2 });