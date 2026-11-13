const db = require('../db/database');
const fs = require('fs');
const path = require('path');
const { FOLDER_UPLOAD } = require('../middleware/upload');

exports.cariByMitra = (idMitra) =>
  db.prepare('SELECT * FROM DokumenLegalitas WHERE idMitra = ?').all(idMitra);

// DPPL C45 tambahDokumen - Q-001.
// Berkas sudah disimpan multer di uploads/; basis data hanya menyimpan namanya.
exports.tambahDokumen = (idMitra, berkas) => {
  try {
    const hasil = db.prepare(
      `INSERT INTO DokumenLegalitas (idMitra, jenisDokumen, validitas, namaBerkas, lokasiBerkas)
       VALUES (?, ?, 0, ?, ?)`
    ).run(idMitra, berkas.jenis, berkas.originalname, berkas.filename);
    return hasil.lastInsertRowid;
  } catch (e) {
    return null;
  }
};

// DPPL C28 Q-282 (mode Edit): menimpa dokumen lama yang jenisnya sama
exports.timpaDokumen = (idMitra, berkas) => {
  const lama = db.prepare(
    'SELECT idDokumen, lokasiBerkas FROM DokumenLegalitas WHERE idMitra = ? AND jenisDokumen = ?'
  ).get(idMitra, berkas.jenis);
  if (!lama) return false;
  db.prepare(
    "UPDATE DokumenLegalitas SET namaBerkas = ?, lokasiBerkas = ?, validitas = 0, waktuUnggah = datetime('now') WHERE idDokumen = ?"
  ).run(berkas.originalname, berkas.filename, lama.idDokumen);
  if (lama.lokasiBerkas) fs.unlink(path.join(FOLDER_UPLOAD, lama.lokasiBerkas), () => {});
  return true;
};