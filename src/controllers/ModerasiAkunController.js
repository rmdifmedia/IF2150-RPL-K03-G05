const Laporan = require('../models/Laporan');

const STATUS_VALID = ['menunggu', 'disetujui', 'ditolak', 'semua'];

// GET /admin/laporan
exports.prosesTinjauan = (req, res) => {
  try {
    const statusAktif = STATUS_VALID.includes(req.query.status)
      ? req.query.status
      : 'menunggu';

    const daftarLaporan = Laporan.ambilDaftarLaporan(statusAktif);

    res.render('admin/laporan', {
      statusAktif,
      daftarLaporan
    });
  } catch (err) {
    console.error('Gagal memuat daftar laporan:', err);
    req.flash('error', 'Terjadi kesalahan saat memuat daftar laporan pelanggaran.');
    res.redirect('/admin');
  }
};

// POST /admin/laporan/:idLaporan/blokir
exports.prosesBlokirAkun = (req, res) => {
  const idLaporan = Number(req.params.idLaporan);
  const catatan = (req.body.catatan || '').trim();

  if (!Number.isInteger(idLaporan) || idLaporan <= 0) {
    req.flash('error', 'ID laporan tidak valid.');
    return res.redirect('/admin/laporan');
  }

  try {
    const laporan = Laporan.prosesBlokirAkun(idLaporan, catatan);
    const infoCatatan = catatan ? ` Catatan: "${catatan}".` : '';
    req.flash(
      'sukses',
      `Laporan #${laporan.idLaporan} disetujui dan akun terlapor berhasil diblokir.${infoCatatan}`
    );
    return res.redirect('/admin/laporan');
  } catch (err) {
    if (err.message === 'LAPORAN_TIDAK_DITEMUKAN') {
      req.flash('error', 'Data laporan tidak ditemukan.');
    } else if (err.message === 'LAPORAN_SUDAH_DITINJAU') {
      req.flash('error', 'Laporan ini sudah pernah ditinjau sebelumnya.');
    } else if (err.message === 'AKUN_TERLAPOR_TIDAK_DITEMUKAN') {
      req.flash('error', 'Akun terlapor tidak ditemukan di basis data.');
    } else {
      console.error('Gagal memblokir akun:', err);
      req.flash('error', 'Gagal memproses pemblokiran akun.');
    }
    return res.redirect('/admin/laporan');
  }
};

// POST /admin/laporan/:idLaporan/tolak
exports.tolakLaporan = (req, res) => {
  const idLaporan = Number(req.params.idLaporan);
  const catatan = (req.body.catatan || '').trim();

  if (!Number.isInteger(idLaporan) || idLaporan <= 0) {
    req.flash('error', 'ID laporan tidak valid.');
    return res.redirect('/admin/laporan');
  }

  try {
    const laporan = Laporan.tolakLaporan(idLaporan, catatan);
    const infoCatatan = catatan ? ` Catatan: "${catatan}".` : '';
    req.flash(
      'sukses',
      `Pemblokiran untuk laporan #${laporan.idLaporan} ditolak. Akun terlapor tetap aktif.${infoCatatan}`
    );
    return res.redirect('/admin/laporan');
  } catch (err) {
    if (err.message === 'LAPORAN_TIDAK_DITEMUKAN') {
      req.flash('error', 'Data laporan tidak ditemukan.');
    } else if (err.message === 'LAPORAN_SUDAH_DITINJAU') {
      req.flash('error', 'Laporan ini sudah pernah ditinjau sebelumnya.');
    } else {
      console.error('Gagal menolak laporan:', err);
      req.flash('error', 'Gagal memperbarui status laporan.');
    }
    return res.redirect('/admin/laporan');
  }
};