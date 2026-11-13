const db = require('../db/database');

// Pastikan kolom catatanAdmin tersedia pada tabel Laporan untuk input "Tulis catatan..."
function pastikanKolomCatatanAdmin() {
  try {
    const kolom = db.prepare('PRAGMA table_info(Laporan)').all();
    if (kolom.length > 0 && !kolom.some((c) => c.name === 'catatanAdmin')) {
      db.exec('ALTER TABLE Laporan ADD COLUMN catatanAdmin TEXT');
    }
  } catch (err) {
    console.warn('Info skema Laporan:', err.message);
  }
}
pastikanKolomCatatanAdmin();

// =========================================================================
// BAGIAN UC14 & UC15: Pembuatan Laporan Pelanggaran (routes/laporan.js)
// =========================================================================
function cariTargetAkun(peranTerlapor, idTerlapor) {
  if (peranTerlapor === 'masyarakat') {
    return db
      .prepare('SELECT idMasyarakat AS id, nama, email, statusAkun FROM Masyarakat WHERE idMasyarakat = ?')
      .get(idTerlapor);
  }
  if (peranTerlapor === 'mitra') {
    return db
      .prepare('SELECT idMitra AS id, nama, email, statusAkun FROM MitraPengacara WHERE idMitra = ?')
      .get(idTerlapor);
  }
  return null;
}

function cariUlasanById(idUlasan) {
  return db
    .prepare(`
      SELECT u.*, m.nama AS namaPenulis
      FROM Ulasan u
      LEFT JOIN Masyarakat m ON u.idMasyarakat = m.idMasyarakat
      WHERE u.idUlasan = ?
    `)
    .get(idUlasan);
}

function buatLaporan({
  idPelapor,
  peranPelapor,
  idTerlapor,
  peranTerlapor,
  idUlasan = null,
  jenisPelanggaran,
  deskripsi
}) {
  const stmt = db.prepare(`
    INSERT INTO Laporan (
      idPelapor,
      peranPelapor,
      idTerlapor,
      peranTerlapor,
      idUlasan,
      jenisPelanggaran,
      deskripsi,
      statusLaporan,
      tanggalLaporan
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'menunggu', date('now', 'localtime'))
  `);

  return stmt.run(
    idPelapor,
    peranPelapor,
    idTerlapor,
    peranTerlapor,
    idUlasan || null,
    jenisPelanggaran,
    deskripsi
  );
}

// =========================================================================
// BAGIAN UC17: Tinjauan Laporan & Pemblokiran Akun oleh Admin
// =========================================================================
function ambilDaftarLaporan(statusFilter = 'menunggu') {
  const kondisi =
    statusFilter && statusFilter !== 'semua'
      ? 'WHERE l.statusLaporan = ?'
      : '';
  const params = statusFilter && statusFilter !== 'semua' ? [statusFilter] : [];

  const sql = `
    SELECT
      l.*,
      CASE
        WHEN l.peranPelapor = 'masyarakat' THEN mp.nama
        WHEN l.peranPelapor = 'mitra' THEN mtp.nama
        ELSE 'Pengguna'
      END AS namaPelapor,
      CASE
        WHEN l.peranPelapor = 'masyarakat' THEN mp.email
        WHEN l.peranPelapor = 'mitra' THEN mtp.email
        ELSE '-'
      END AS emailPelapor,
      CASE
        WHEN l.peranTerlapor = 'masyarakat' THEN mt.nama
        WHEN l.peranTerlapor = 'mitra' THEN mtt.nama
        ELSE 'Pengguna'
      END AS namaTerlapor,
      CASE
        WHEN l.peranTerlapor = 'masyarakat' THEN mt.email
        WHEN l.peranTerlapor = 'mitra' THEN mtt.email
        ELSE '-'
      END AS emailTerlapor,
      CASE
        WHEN l.peranTerlapor = 'masyarakat' THEN mt.statusAkun
        WHEN l.peranTerlapor = 'mitra' THEN mtt.statusAkun
        ELSE NULL
      END AS statusAkunTerlapor,
      u.teksUlasan,
      u.skorRating
    FROM Laporan l
    LEFT JOIN Masyarakat mp
      ON l.peranPelapor = 'masyarakat' AND l.idPelapor = mp.idMasyarakat
    LEFT JOIN MitraPengacara mtp
      ON l.peranPelapor = 'mitra' AND l.idPelapor = mtp.idMitra
    LEFT JOIN Masyarakat mt
      ON l.peranTerlapor = 'masyarakat' AND l.idTerlapor = mt.idMasyarakat
    LEFT JOIN MitraPengacara mtt
      ON l.peranTerlapor = 'mitra' AND l.idTerlapor = mtt.idMitra
    LEFT JOIN Ulasan u
      ON l.idUlasan = u.idUlasan
    ${kondisi}
    ORDER BY
      CASE l.statusLaporan WHEN 'menunggu' THEN 0 ELSE 1 END,
      l.idLaporan DESC
  `;

  return db.prepare(sql).all(...params);
}

function getDetailLaporan(idLaporan) {
  const sql = `
    SELECT
      l.*,
      CASE
        WHEN l.peranPelapor = 'masyarakat' THEN mp.nama
        WHEN l.peranPelapor = 'mitra' THEN mtp.nama
        ELSE 'Pengguna'
      END AS namaPelapor,
      CASE
        WHEN l.peranTerlapor = 'masyarakat' THEN mt.nama
        WHEN l.peranTerlapor = 'mitra' THEN mtt.nama
        ELSE 'Pengguna'
      END AS namaTerlapor,
      u.teksUlasan,
      u.skorRating
    FROM Laporan l
    LEFT JOIN Masyarakat mp
      ON l.peranPelapor = 'masyarakat' AND l.idPelapor = mp.idMasyarakat
    LEFT JOIN MitraPengacara mtp
      ON l.peranPelapor = 'mitra' AND l.idPelapor = mtp.idMitra
    LEFT JOIN Masyarakat mt
      ON l.peranTerlapor = 'masyarakat' AND l.idTerlapor = mt.idMasyarakat
    LEFT JOIN MitraPengacara mtt
      ON l.peranTerlapor = 'mitra' AND l.idTerlapor = mtt.idMitra
    LEFT JOIN Ulasan u
      ON l.idUlasan = u.idUlasan
    WHERE l.idLaporan = ?
  `;

  return db.prepare(sql).get(idLaporan);
}

// Tombol "Blokir": Setujui laporan & ubah statusAkun terlapor menjadi 'diblokir'
const eksekusiBlokirTransaksi = db.transaction((idLaporan, catatan = '') => {
  const laporan = db
    .prepare('SELECT * FROM Laporan WHERE idLaporan = ?')
    .get(idLaporan);

  if (!laporan) throw new Error('LAPORAN_TIDAK_DITEMUKAN');
  if (laporan.statusLaporan !== 'menunggu') throw new Error('LAPORAN_SUDAH_DITINJAU');

  if (laporan.peranTerlapor === 'masyarakat') {
    const res = db
      .prepare("UPDATE Masyarakat SET statusAkun = 'diblokir' WHERE idMasyarakat = ?")
      .run(laporan.idTerlapor);
    if (res.changes === 0) throw new Error('AKUN_TERLAPOR_TIDAK_DITEMUKAN');
  } else if (laporan.peranTerlapor === 'mitra') {
    const res = db
      .prepare("UPDATE MitraPengacara SET statusAkun = 'diblokir' WHERE idMitra = ?")
      .run(laporan.idTerlapor);
    if (res.changes === 0) throw new Error('AKUN_TERLAPOR_TIDAK_DITEMUKAN');
  } else {
    throw new Error('PERAN_TERLAPOR_TIDAK_VALID');
  }

  db.prepare(
    "UPDATE Laporan SET statusLaporan = 'disetujui', catatanAdmin = ? WHERE idLaporan = ?"
  ).run(catatan || null, idLaporan);

  return laporan;
});

function prosesBlokirAkun(idLaporan, catatan = '') {
  return eksekusiBlokirTransaksi(idLaporan, catatan);
}

// Tombol "Tolak Blokir": Tolak laporan tanpa memblokir akun terlapor
function tolakLaporan(idLaporan, catatan = '') {
  const laporan = db
    .prepare('SELECT * FROM Laporan WHERE idLaporan = ?')
    .get(idLaporan);

  if (!laporan) throw new Error('LAPORAN_TIDAK_DITEMUKAN');
  if (laporan.statusLaporan !== 'menunggu') throw new Error('LAPORAN_SUDAH_DITINJAU');

  db.prepare(
    "UPDATE Laporan SET statusLaporan = 'ditolak', catatanAdmin = ? WHERE idLaporan = ?"
  ).run(catatan || null, idLaporan);

  return laporan;
}

module.exports = {
  cariTargetAkun,
  cariUlasanById,
  buatLaporan,
  ambilDaftarLaporan,
  getDetailLaporan,
  prosesBlokirAkun,
  tolakLaporan
};
