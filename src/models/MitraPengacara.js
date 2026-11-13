const db = require('../db/database');

exports.IsUsnAda = (username) =>
    !!db.prepare('SELECT 1 FROM MitraPengacara WHERE username = ?').get(username);

const simpan = db.transaction((data, daftarDokumen) => {
    const hasil = db.prepare(
        `INSERT INTO MitraPengacara (nama, username, namaFirma, email, sandiMitra)
        VALUES (?, ?, ?, ?, ?)`
    ).run(data.nama, data.username, data.namaFirma, data.email, data.sandiHash);

    const tambahDokumen = db.prepare(
        `INSERT INTO DokumenLegalitas (idMitra, jenisDokumen, namaBerkas, lokasiBerkas)
        VALUES (?, ?, ?, ?)`
    );
    for ( const d of daftarDokumen){
        tambahDokumen.run(hasil.lastInsertRowid, d.jenis, d.namaAsli, d.namaTersimpan);
    }
});

exports.daftar = simpan;

// daftar mitra yang valid (yang sudah di verif admin)

exports.cari = ({ q = '', tags = [], ratingMin = 0} = {}) => {
    const where = [`statusVerifikasi = 'terverifikasi'`, `statusAkun = 'aktif'`];
    const param = [];

    if (q) {
        where.push('(nama LIKE ? OR namaFirma LIKE ? OR deskripsi LIKE ?)');
        param.push(`%${q}%`,`%${q}%`,`%${q}%`);
    }
    if (tags.length){
        where.push('(' + tags.map(() => `(',' || tagKeahlian || ',') LIKE ?`).join(' OR ') + ')');
        tags.forEach(t => param.push(`%,${t},%`));
    }
    if (ratingMin > 0){
        where.push('rating >= ?');
        param.push(ratingMin);
    }
    return db.prepare(`
    SELECT idMitra, nama, namaFirma, deskripsi, tagKeahlian, rating, statusKetersediaan,
           (SELECT COUNT(*) FROM Ulasan u WHERE u.idMitra = MitraPengacara.idMitra) AS jumlahUlasan
    FROM MitraPengacara
    WHERE ${where.join(' AND ')}
    ORDER BY (statusKetersediaan = 'tersedia') DESC, rating DESC, nama ASC
  `).all(...param);
};

// DPPL C41 infoProfil(idMitra) - Q-412.
exports.infoProfil = (idMitra) => {
  return db.prepare(
    `SELECT idMitra, nama, username, email, namaFirma, deskripsi, tagKeahlian, statusVerifikasi
     FROM MitraPengacara WHERE idMitra = ?`
  ).get(idMitra) || null;
};

// DPPL C41 cekKetersediaanJadwal(idMitra, tanggal, waktu) - Q-411.
exports.cekKetersediaanJadwal = (idMitra, tanggal, waktu) => {
  const bentrok = db.prepare(
    `SELECT idSesi FROM SesiKonsultasi
     WHERE idMitra = ? AND tanggalJadwal = ? AND waktuJadwal = ? AND statusSesi != 'dibatalkan'`
  ).get(idMitra, tanggal, waktu);
  return !bentrok;
};

exports.ubahProfil = (idMitra, data) =>
  db.prepare(`UPDATE MitraPengacara
              SET namaFirma = ?, deskripsi = ?, tagKeahlian = ?
              WHERE idMitra = ?`)
    .run(data.namaFirma, data.deskripsi, data.tagKeahlian, idMitra);
