const db = require('../db/database');

exports.cariSesi = (idSesi) =>
  db.prepare(
    `SELECT s.*, m.nama AS namaMitra, m.tagKeahlian
     FROM SesiKonsultasi s JOIN MitraPengacara m ON m.idMitra = s.idMitra
     WHERE s.idSesi = ?`
  ).get(idSesi);

exports.sudahAda = (idSesi) =>
  !!db.prepare('SELECT 1 FROM Ulasan WHERE idSesi = ?').get(idSesi);

// Simpan ulasan lalu hitung ulang rating rata-rata mitra
exports.simpan = db.transaction(({ idSesi, idMasyarakat, idMitra, skor, teks }) => {
  db.prepare(
    `INSERT INTO Ulasan (idSesi, idMasyarakat, idMitra, skorRating, teksUlasan)
     VALUES (?, ?, ?, ?, ?)`
  ).run(idSesi, idMasyarakat, idMitra, skor, teks || null);

  const { rata } = db.prepare('SELECT AVG(skorRating) AS rata FROM Ulasan WHERE idMitra = ?').get(idMitra);
  db.prepare('UPDATE MitraPengacara SET rating = ? WHERE idMitra = ?')
    .run(Math.round(rata * 10) / 10, idMitra);
});