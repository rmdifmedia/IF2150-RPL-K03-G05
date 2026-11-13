const db = require('../db/database');

const URUTAN_DOKUMEN = [
  { key: 'ijazah', label: 'Ijazah' },
  { key: 'kta', label: 'KTA' },
  { key: 'sipa', label: 'SIPA' },
  { key: 'bas', label: 'BAS' },
  { key: 'ktp', label: 'KTP' },
  { key: 'cv', label: 'CV' }
];

function ambilKolomTabel(namaTabel) {
  try {
    return db
      .prepare(`PRAGMA table_info(${namaTabel})`)
      .all()
      .map((col) => col.name);
  } catch {
    return [];
  }
}


function ambilDaftarMitra({ q = '', status = 'semua', urutan = 'terbaru' } = {}) {
  const kolomMitra = ambilKolomTabel('MitraPengacara');
  const whereClauses = [];
  const params = [];

  if (q && q.trim() !== '') {
    const keyword = `%${q.trim()}%`;
    const subConditions = ['m.nama LIKE ?', 'm.email LIKE ?'];
    params.push(keyword, keyword);

    if (kolomMitra.includes('username')) {
      subConditions.push('m.username LIKE ?');
      params.push(keyword);
    }
    if (kolomMitra.includes('namaFirma')) {
      subConditions.push('m.namaFirma LIKE ?');
      params.push(keyword);
    }
    if (kolomMitra.includes('spesialisasi')) {
      subConditions.push('m.spesialisasi LIKE ?');
      params.push(keyword);
    }
    whereClauses.push(`(${subConditions.join(' OR ')})`);
  }

  if (status === 'tertunda') {
    whereClauses.push("m.statusVerifikasi IN ('pending', 'tertunda', 'revisi', 'wajib revisi sesuai ketentuan')");
  } else if (status === 'terverifikasi') {
    whereClauses.push("m.statusVerifikasi IN ('terverifikasi', 'approved')");
  } else if (status === 'ditolak') {
    whereClauses.push("m.statusVerifikasi IN ('ditolak', 'rejected', 'belum_terverifikasi')");
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const orderSql = urutan === 'terlama' ? 'ORDER BY m.idMitra ASC' : 'ORDER BY m.idMitra DESC';

  return db
    .prepare(`SELECT m.* FROM MitraPengacara m ${whereSql} ${orderSql}`)
    .all(...params);
}

function ambilDetailMitra(idMitra) {
  const mitra = db
    .prepare('SELECT * FROM MitraPengacara WHERE idMitra = ?')
    .get(idMitra);

  if (!mitra) return null;

  const kolomDokumen = ambilKolomTabel('DokumenLegalitas');
  const rowsDokumen =
    kolomDokumen.length > 0
      ? db
          .prepare('SELECT * FROM DokumenLegalitas WHERE idMitra = ? ORDER BY idDokumen ASC')
          .all(idMitra)
      : [];

  const daftarDokumen = URUTAN_DOKUMEN.map((slot) => {
    const cocok = rowsDokumen.find((doc) => {
      const jenis = String(doc.jenisDokumen || doc.namaDokumen || doc.tipe || '').toLowerCase();
      return jenis.includes(slot.key);
    });

    const kolomLangsung = Object.keys(mitra).find((k) =>
      k.toLowerCase().includes(slot.key)
    );

    return {
      key: slot.key,
      label: slot.label,
      idDokumen: cocok ? cocok.idDokumen : null,
      adaBerkas: Boolean(cocok || (kolomLangsung && mitra[kolomLangsung])),
      validitas: cocok ? cocok.validitas : null
    };
  });

  return {
    mitra,
    daftarDokumen
  };
}

function ambilDokumenById(idDokumen) {
  return db
    .prepare('SELECT * FROM DokumenLegalitas WHERE idDokumen = ?')
    .get(idDokumen);
}

function ambilBerkasDariMitra(idMitra, jenisKey) {
  if (!URUTAN_DOKUMEN.some((u) => u.key === jenisKey)) return null;
  const mitra = db
    .prepare('SELECT * FROM MitraPengacara WHERE idMitra = ?')
    .get(idMitra);
  if (!mitra) return null;

  const kolom = Object.keys(mitra).find((k) => k.toLowerCase().includes(jenisKey));
  return kolom ? mitra[kolom] : null;
}

const simpanKeputusanTransaksi = db.transaction((idMitra, keputusan, catatan = '') => {
  const mitra = db
    .prepare('SELECT * FROM MitraPengacara WHERE idMitra = ?')
    .get(idMitra);

  if (!mitra) throw new Error('MITRA_TIDAK_DITEMUKAN');

  const kolomDokumen = ambilKolomTabel('DokumenLegalitas');
  let statusTarget;
  let validitasDokumen;

  if (keputusan === 'verifikasi') {
    statusTarget = 'terverifikasi';
    validitasDokumen = 1;
  } else if (keputusan === 'tolak') {
    statusTarget = 'ditolak';
    validitasDokumen = 0;
  } else {
    throw new Error('KEPUTUSAN_TIDAK_VALID');
  }

  try {
    db.prepare(
      'UPDATE MitraPengacara SET statusVerifikasi = ?, catatanVerifikasi = ? WHERE idMitra = ?'
    ).run(statusTarget, catatan || null, idMitra);
  } catch (err) {
    if (String(err.message).includes('CHECK')) {
      const statusFallback = keputusan === 'verifikasi' ? 'approved' : 'rejected';
      db.prepare(
        'UPDATE MitraPengacara SET statusVerifikasi = ?, catatanVerifikasi = ? WHERE idMitra = ?'
      ).run(statusFallback, catatan || null, idMitra);
      statusTarget = statusFallback;
    } else {
      throw err;
    }
  }

  if (kolomDokumen.includes('validitas')) {
    db.prepare('UPDATE DokumenLegalitas SET validitas = ? WHERE idMitra = ?')
      .run(validitasDokumen, idMitra);
  }

  return {
    idMitra,
    nama: mitra.nama,
    statusBaru: statusTarget
  };
});

function prosesKeputusanVerifikasi(idMitra, keputusan, catatan = '') {
  return simpanKeputusanTransaksi(idMitra, keputusan, catatan);
}

module.exports = {
  ambilDaftarMitra,
  ambilDetailMitra,
  ambilDokumenById,
  ambilBerkasDariMitra,
  prosesKeputusanVerifikasi
};