const db = require('../db/database');

exports.buat = ({ idMasyarakat, judulKasus, kategoriMasalah, deskripsi }) =>
  db.prepare(
    `INSERT INTO Kasus (idMasyarakat, judulKasus, kategoriMasalah, deskripsi)
     VALUES (?, ?, ?, ?)`
  ).run(idMasyarakat, judulKasus, kategoriMasalah, deskripsi).lastInsertRowid;

// hanya pemilik kasus yang bisa mengubah
exports.ubah = (idKasus, idMasyarakat, { judulKasus, kategoriMasalah, deskripsi }) =>
  db.prepare(
    `UPDATE Kasus SET judulKasus = ?, kategoriMasalah = ?, deskripsi = ?
      WHERE idKasus = ? AND idMasyarakat = ?`
  ).run(judulKasus, kategoriMasalah, deskripsi, idKasus, idMasyarakat).changes > 0;

exports.cariMilik = (idKasus, idMasyarakat) =>
  db.prepare('SELECT * FROM Kasus WHERE idKasus = ? AND idMasyarakat = ?').get(idKasus, idMasyarakat);