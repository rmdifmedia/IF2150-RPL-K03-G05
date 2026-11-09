const db = require('../db/database');

exports.cariTargetAkun = (peran, idTarget) => {
  if (peran === 'mitra') {
    return db
      .prepare('SELECT idMitra AS id, nama, namaFirma FROM MitraPengacara WHERE idMitra = ?')
      .get(idTarget);
  }
  if (peran === 'masyarakat') {
    return db
      .prepare('SELECT idMasyarakat AS id, nama, username FROM Masyarakat WHERE idMasyarakat = ?')
      .get(idTarget);
  }
  return null;
};

exports.cariUlasanById = (idUlasan) => {
  return db
    .prepare(`
      SELECT u.idUlasan, u.idMasyarakat, u.idMitra, u.skorRating, u.teksUlasan,
             m.nama AS namaMasyarakat
      FROM Ulasan u
      LEFT JOIN Masyarakat m ON u.idMasyarakat = m.idMasyarakat
      WHERE u.idUlasan = ?
    `)
    .get(idUlasan);
};

exports.buatLaporan = ({ idPelapor, peranPelapor, idTerlapor, peranTerlapor, idUlasan, jenisPelanggaran, deskripsi }) => {
  const stmt = db.prepare(`
    INSERT INTO Laporan (
      idPelapor, peranPelapor, idTerlapor, peranTerlapor,
      idUlasan, jenisPelanggaran, deskripsi
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    idPelapor,
    peranPelapor,
    idTerlapor,
    peranTerlapor,
    idUlasan || null,
    jenisPelanggaran,
    deskripsi || null
  );

  return info.lastInsertRowid;
};