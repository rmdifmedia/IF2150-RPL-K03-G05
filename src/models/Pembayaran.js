const db = require('../db/database');

const PAJAK = 0.11;

exports.hitungBiaya = (tarifPerJam, durasiJam) => {
  const subtotal = tarifPerJam * durasiJam;
  const pajak = Math.round(subtotal * PAJAK);
  return { tarifPerJam, durasiJam, subtotal, pajak, total: subtotal + pajak };
};

exports.cariSesi = (idSesi) =>
  db.prepare(
    `SELECT s.*, m.nama AS namaMitra
     FROM SesiKonsultasi s JOIN MitraPengacara m ON m.idMitra = s.idMitra
     WHERE s.idSesi = ?`
  ).get(idSesi);

// Simpan hasil transaksi. Jika berhasil: sesi jadi lunas, saldo mitra bertambah.
exports.simpanHasil = db.transaction(({ idSesi, idMitra, nominal, penghasilanMitra, metode, berhasil }) => {
  db.prepare(
    `INSERT INTO Pembayaran (idSesi, nominal, statusPembayaran, metodeBayar)
     VALUES (?, ?, ?, ?)`
  ).run(idSesi, nominal, berhasil ? 'berhasil' : 'gagal', metode);

  if (berhasil) {
    db.prepare(
      `UPDATE SesiKonsultasi SET statusPembayaran = 'lunas', statusSesi = 'siap dimulai'
       WHERE idSesi = ?`
    ).run(idSesi);
    db.prepare('UPDATE MitraPengacara SET saldo = saldo + ? WHERE idMitra = ?')
      .run(penghasilanMitra, idMitra);
  }
});