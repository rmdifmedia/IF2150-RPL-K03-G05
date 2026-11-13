const db = require('../db/database');

const SEKARANG = `datetime('now', 'localtime')`;

exports.ringkasan = (idMitra) => {
    const mitra = db.prepare(
        'SELECT nama, rating, saldo FROM MitraPengacara WHERE idMitra = ?'
    ). get(idMitra);

    const menunggu = db.prepare(
        `SELECT COUNT(*) AS n FROM SesiKonsultasi WHERE idMitra = ? AND LOWER(statusSesi) LIKE 'menunggu%'`
    ).get(idMitra).n;

    const terjadwal = db.prepare(
    `SELECT COUNT(*) AS n FROM SesiKonsultasi
     WHERE idMitra = ? AND LOWER(statusSesi) = 'terjadwal'
       AND (tanggalJadwal || ' ' || waktuJadwal) >= ${SEKARANG}`
  ).get(idMitra).n;

  return { ...mitra, menunggu, terjadwal };
};

exports.permintaanTerbaru = (idMitra) => db.prepare(
  `SELECT s.idSesi, m.nama AS namaMasyarakat, s.tanggalJadwal, s.waktuJadwal
   FROM SesiKonsultasi s JOIN Masyarakat m ON m.idMasyarakat = s.idMasyarakat
   WHERE s.idMitra = ? AND LOWER(s.statusSesi) LIKE 'menunggu%'
   ORDER BY s.idSesi DESC LIMIT 3`
).all(idMitra);

exports.sesiBerikutnya = (idMitra) => db.prepare(
  `SELECT s.idSesi, m.nama AS namaMasyarakat, s.tanggalJadwal, s.waktuJadwal
   FROM SesiKonsultasi s JOIN Masyarakat m ON m.idMasyarakat = s.idMasyarakat
   WHERE s.idMitra = ? AND LOWER(s.statusSesi) = 'terjadwal'
     AND (s.tanggalJadwal || ' ' || s.waktuJadwal) >= ${SEKARANG}
   ORDER BY s.tanggalJadwal, s.waktuJadwal LIMIT 3`
).all(idMitra);