const db = require('../db/database');

exports.daftarByTanggal = (idMitra, tanggal) =>
  db.prepare(`SELECT * FROM JadwalKetersediaan
              WHERE idMitra = ? AND tanggal = ? ORDER BY waktuMulai`).all(idMitra, tanggal);

exports.tanggalAdaSlot = (idMitra, awal, akhir) =>
  db.prepare(`SELECT DISTINCT tanggal FROM JadwalKetersediaan
              WHERE idMitra = ? AND tanggal BETWEEN ? AND ?`)
    .all(idMitra, awal, akhir).map((r) => r.tanggal);

exports.cariById = (idJadwal) =>
  db.prepare('SELECT * FROM JadwalKetersediaan WHERE idJadwal = ?').get(idJadwal);

exports.bentrok = (idMitra, tanggal, mulai, selesai, kecualiId) =>
  !!db.prepare(`SELECT idJadwal FROM JadwalKetersediaan
                WHERE idMitra = ? AND tanggal = ? AND idJadwal != ?
                  AND waktuMulai < ? AND waktuSelesai > ?`)
    .get(idMitra, tanggal, kecualiId, selesai, mulai);

exports.tambah = (idMitra, tanggal, mulai, selesai) =>
  db.prepare(`INSERT INTO JadwalKetersediaan (idMitra, tanggal, waktuMulai, waktuSelesai)
              VALUES (?, ?, ?, ?)`).run(idMitra, tanggal, mulai, selesai);

exports.ubah = (idJadwal, mulai, selesai) =>
  db.prepare('UPDATE JadwalKetersediaan SET waktuMulai = ?, waktuSelesai = ? WHERE idJadwal = ?')
    .run(mulai, selesai, idJadwal);

exports.hapus = (idJadwal) =>
  db.prepare('DELETE FROM JadwalKetersediaan WHERE idJadwal = ?').run(idJadwal);