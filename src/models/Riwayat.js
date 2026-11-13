const db = require('../db/database');

const DASAR = `
  SELECT s.idSesi, s.tanggalJadwal, s.waktuJadwal, s.statusSesi, s.statusKonsul,
         k.judulKasus, k.deskripsi AS deskripsiKasus,
         (SELECT 1 FROM Ulasan u WHERE u.idSesi = s.idSesi) AS sudahUlasan,`;

exports.untukMasyarakat = (idMasyarakat) =>
  db.prepare(
    `${DASAR} m.nama AS lawan
     FROM SesiKonsultasi s
     JOIN MitraPengacara m ON m.idMitra = s.idMitra
     LEFT JOIN Kasus k ON k.idKasus = s.idKasus
     WHERE s.idMasyarakat = ? AND s.statusPembayaran = 'lunas'
     ORDER BY s.tanggalJadwal DESC, s.waktuJadwal DESC`
  ).all(idMasyarakat);

exports.untukMitra = (idMitra) =>
  db.prepare(
    `${DASAR} ma.nama AS lawan
     FROM SesiKonsultasi s
     JOIN Masyarakat ma ON ma.idMasyarakat = s.idMasyarakat
     LEFT JOIN Kasus k ON k.idKasus = s.idKasus
     WHERE s.idMitra = ? AND s.statusPembayaran = 'lunas'
     ORDER BY s.tanggalJadwal DESC, s.waktuJadwal DESC`
  ).all(idMitra);

exports.detailSesi = (idSesi) =>
  db.prepare(
    `SELECT s.*, m.nama AS namaMitra, ma.nama AS namaMasyarakat,
            k.judulKasus, k.deskripsi AS deskripsiKasus
     FROM SesiKonsultasi s
     JOIN MitraPengacara m ON m.idMitra = s.idMitra
     JOIN Masyarakat ma ON ma.idMasyarakat = s.idMasyarakat
     LEFT JOIN Kasus k ON k.idKasus = s.idKasus
     WHERE s.idSesi = ?`
  ).get(idSesi);

exports.pesanSesi = (idSesi) =>
  db.prepare('SELECT * FROM PesanChat WHERE idSesi = ? ORDER BY idPesan').all(idSesi);