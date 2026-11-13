const MitraPengacara = require('../models/MitraPengacara');
const DokumenLegalitas = require('../models/DokumenLegalitas');
const { JENIS_DOKUMEN } = require('../middleware/upload');

const tanggalIndo = (t) => (t
  ? new Date(t.replace(' ', 'T') + 'Z').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  : '-');

// tiga langkah pada UI "Status Registrasi"
function susunLangkah(status, tanggalKirim, catatan) {
  const selesai = status !== 'menunggu';
  return [
    { nomor: 1, status: 'selesai', judul: 'Pendaftaran terkirim',
      ket: `Dokumenmu telah dikirim untuk diverifikasi oleh admin pada tanggal ${tanggalIndo(tanggalKirim)}.` },
    { nomor: 2, status: selesai ? 'selesai' : 'berjalan', judul: 'Pemeriksaan dokumen oleh admin',
      ket: selesai ? 'Admin telah selesai memeriksa dokumenmu.' : 'Admin sedang memeriksa dokumenmu. Mohon tunggu.' },
    { nomor: 3, status: status === 'terverifikasi' ? 'selesai' : status === 'ditolak' ? 'ditolak' : 'menunggu',
      judul: 'Hasil verifikasi',
      ket: status === 'terverifikasi' ? 'Selamat, akunmu sudah terverifikasi.'
        : status === 'ditolak' ? `Pendaftaran ditolak. Catatan admin: ${catatan || '-'}`
        : 'Hasil verifikasi belum tersedia.' },
  ];
}

function tampil(res, mitra, { bolehUbah }) {
  res.render('mitra/status-registrasi', {
    judulHalaman: 'Status Registrasi',
    mitra, bolehUbah,
    langkah: susunLangkah(mitra.statusVerifikasi, mitra.tanggalKirim, mitra.catatanVerifikasi),
    dokumen: bolehUbah ? DokumenLegalitas.cariByMitra(mitra.idMitra) : [],
    jenisDokumen: JENIS_DOKUMEN,
  });
}

// GET /mitra/status-verifikasi  (mitra yang sedang login)
exports.tampilMitra = (req, res) => {
  const mitra = MitraPengacara.statusRegistrasiById(req.session.user.id);
  if (!mitra) return res.redirect('/logout');
  tampil(res, mitra, { bolehUbah: true });
};

// GET /status-verifikasi?username=...  (publik, dari form "Cek Status" di halaman login)
exports.cekPublik = (req, res) => {
  const username = String(req.query.username || '').trim();
  const mitra = username ? MitraPengacara.statusRegistrasiByUsername(username) : null;
  if (!mitra) {
    req.flash('error', 'Username mitra tidak ditemukan.');
    return res.redirect('/login');
  }
  tampil(res, mitra, { bolehUbah: false });
};