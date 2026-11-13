const db = require('../db/database');

exports.profilKeuangan = (idMitra) =>
  db.prepare('SELECT idMitra, nama, saldo, rekeningPencairan FROM MitraPengacara WHERE idMitra = ?').get(idMitra);

exports.simpanRekening = (idMitra, teks) =>
  db.prepare('UPDATE MitraPengacara SET rekeningPencairan = ? WHERE idMitra = ?').run(teks, idMitra);

exports.transaksiMasuk = (idMitra) =>
  db.prepare(
    `SELECT p.idPembayaran, p.nominal, p.statusPembayaran, p.metodeBayar, p.waktuTransaksi,
            ma.nama AS klien
     FROM Pembayaran p
     JOIN SesiKonsultasi s ON s.idSesi = p.idSesi
     JOIN Masyarakat ma ON ma.idMasyarakat = s.idMasyarakat
     WHERE s.idMitra = ?
     ORDER BY p.idPembayaran DESC LIMIT 20`
  ).all(idMitra);

exports.riwayatPencairan = (idMitra) =>
  db.prepare(
    `SELECT * FROM PencairanDana WHERE idMitra = ? ORDER BY idPencairan DESC LIMIT 20`
  ).all(idMitra);

// Catat pencairan; saldo hanya berkurang jika berhasil. Throw jika saldo tidak cukup.
exports.ajukan = db.transaction(({ idMitra, nominal, rekening, berhasil }) => {
  if (berhasil) {
    const r = db.prepare('UPDATE MitraPengacara SET saldo = saldo - ? WHERE idMitra = ? AND saldo >= ?')
      .run(nominal, idMitra, nominal);
    if (r.changes !== 1) throw new Error('Saldo tidak mencukupi');
  }
  db.prepare(
    `INSERT INTO PencairanDana (idMitra, totalPencairan, statusPencairan, rekeningTujuan)
     VALUES (?, ?, ?, ?)`
  ).run(idMitra, nominal, berhasil ? 'berhasil' : 'ditolak', rekening);
});