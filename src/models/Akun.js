const db = require('../db/database');

const DAFTAR_AKUN = [
  { peran: 'masyarakat', tabel: 'Masyarakat', kolomId: 'idMasyarakat', kolomSandi: 'sandi',
    kolomStatus: 'statusAkun', kolomVerifikasi: "'terverifikasi'" },
  { peran: 'mitra', tabel: 'MitraPengacara', kolomId: 'idMitra', kolomSandi: 'sandiMitra',
    kolomStatus: 'statusAkun', kolomVerifikasi: 'statusVerifikasi' },
  { peran: 'admin', tabel: 'Admin', kolomId: 'idAdmin', kolomSandi: 'sandi',
    kolomStatus: "'aktif'", kolomVerifikasi: "'terverifikasi'" }
];

// Mencari akun berdasarkan email di ketiga tabel. Mengembalikan null bila tidak ada.
exports.cariByEmail = (email) => {
  for (const a of DAFTAR_AKUN) {
    const baris = db.prepare(
      `SELECT ${a.kolomId} AS id, nama, ${a.kolomSandi} AS sandi,
              ${a.kolomStatus} AS statusAkun, ${a.kolomVerifikasi} AS statusVerifikasi
       FROM ${a.tabel} WHERE email = ?`
    ).get(email);
    if (baris) return { ...baris, peran: a.peran };
  }
  return null;
};