const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const VerifikasiMitra = require('../models/verifikasiMitra');

const MENU_ADMIN = [
  { href: '/admin/verifikasi', teks: 'Verifikasi Mitra' },
  { href: '/admin/laporan', teks: 'Tinjau Laporan' },
  { href: '/admin/livechat', teks: 'Live Chat' }
];

exports.tampilDaftarMitra = (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const status = ['semua', 'tertunda', 'terverifikasi', 'ditolak'].includes(req.query.status)
      ? req.query.status
      : 'semua';
    const urutan = req.query.urutan === 'terlama' ? 'terlama' : 'terbaru';

    const daftarMitra = VerifikasiMitra.ambilDaftarMitra({ q, status, urutan });

    res.render('admin/verifikasi', {
      title: 'Verifikasi Mitra',
      menu: MENU_ADMIN,
      daftarMitra,
      filter: { q, status, urutan }
    });
  } catch (err) {
    console.error('Gagal memuat daftar mitra:', err);
    req.flash('error', 'Terjadi kesalahan saat memuat daftar mitra pengacara.');
    res.redirect('/admin');
  }
};

exports.tampilDetailMitra = (req, res) => {
  const idMitra = Number(req.params.idMitra);
  if (!Number.isInteger(idMitra) || idMitra <= 0) {
    req.flash('error', 'ID mitra pengacara tidak valid.');
    return res.redirect('/admin/verifikasi');
  }

  try {
    const detail = VerifikasiMitra.ambilDetailMitra(idMitra);
    if (!detail) {
      req.flash('error', 'Data mitra pengacara tidak ditemukan.');
      return res.redirect('/admin/verifikasi');
    }

    res.render('admin/verifikasi-detail', {
      title: 'Verifikasi Mitra Pengacara',
      menu: MENU_ADMIN,
      mitra: detail.mitra,
      daftarDokumen: detail.daftarDokumen
    });
  } catch (err) {
    console.error('Gagal memuat detail verifikasi mitra:', err);
    req.flash('error', 'Gagal memuat detail dokumen mitra pengacara.');
    res.redirect('/admin/verifikasi');
  }
};

exports.prosesVerifikasi = (req, res) => {
  const idMitra = Number(req.params.idMitra);
  const { keputusan, catatan } = req.body;
  const catatanBersih = (catatan || '').trim();

  if (!Number.isInteger(idMitra) || idMitra <= 0) {
    req.flash('error', 'ID mitra pengacara tidak valid.');
    return res.redirect('/admin/verifikasi');
  }

  if (!['verifikasi', 'tolak'].includes(keputusan)) {
    req.flash('error', 'Aksi verifikasi tidak valid.');
    return res.redirect(`/admin/verifikasi/${idMitra}`);
  }

  if (keputusan === 'tolak' && !catatanBersih) {
    req.flash('error', 'Harap tulis catatan/alasan penolakan sebelum menekan tombol Tolak.');
    return res.redirect(`/admin/verifikasi/${idMitra}`);
  }

  try {
    const hasil = VerifikasiMitra.prosesKeputusanVerifikasi(idMitra, keputusan, catatanBersih);
    if (keputusan === 'verifikasi') {
      req.flash('sukses', `Akun mitra "${hasil.nama}" berhasil diverifikasi.`);
    } else {
      req.flash('sukses', `Pengajuan mitra "${hasil.nama}" ditolak beserta catatan.`);
    }
    return res.redirect('/admin/verifikasi');
  } catch (err) {
    if (err.message === 'MITRA_TIDAK_DITEMUKAN') {
      req.flash('error', 'Data mitra pengacara tidak ditemukan.');
    } else {
      console.error('Gagal menyimpan keputusan verifikasi:', err);
      req.flash('error', 'Gagal memperbarui status verifikasi mitra.');
    }
    return res.redirect('/admin/verifikasi');
  }
};

function kirimBerkasTerdekripsi(res, relPath) {
  const bersih = relPath.replace(/^\/+/, '');
  const fullPath = bersih.startsWith('uploads/')
    ? path.join(__dirname, '..', bersih)
    : path.join(__dirname, '..', 'uploads', bersih);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).render('error', { pesan: 'Berkas fisik dokumen tidak ditemukan di server.' });
  }

  const rawBuffer = fs.readFileSync(fullPath);
  const keyHex = process.env.ENCRYPTION_KEY || process.env.AES_SECRET;

  if (keyHex && fullPath.endsWith('.enc') && rawBuffer.length > 16) {
    const key =
      keyHex.length === 64
        ? Buffer.from(keyHex, 'hex')
        : crypto.createHash('sha256').update(keyHex).digest();
    const iv = rawBuffer.subarray(0, 16);
    const encrypted = rawBuffer.subarray(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    res.setHeader('Content-Type', 'application/pdf');
    return res.send(decrypted);
  }

  return res.sendFile(fullPath);
}

exports.lihatDokumenById = (req, res) => {
  const idDokumen = Number(req.params.idDokumen);
  if (!Number.isInteger(idDokumen) || idDokumen <= 0) {
    return res.status(400).render('error', { pesan: 'ID dokumen tidak valid.' });
  }

  try {
    const dokumen = VerifikasiMitra.ambilDokumenById(idDokumen);
    if (!dokumen) {
      return res.status(404).render('error', { pesan: 'Dokumen legalitas tidak ditemukan.' });
    }

    const relPath = dokumen.lokasiBerkas;
    if (!relPath) {
      return res.status(404).render('error', { pesan: 'Path berkas dokumen tidak tersedia.' });
    }

    return kirimBerkasTerdekripsi(res, relPath);
  } catch (err) {
    console.error('Gagal membuka dokumen:', err);
    return res.status(500).render('error', { pesan: 'Gagal membuka berkas dokumen.' });
  }
};

exports.lihatDokumenByJenis = (req, res) => {
  const idMitra = Number(req.params.idMitra);
  const jenis = (req.params.jenis || '').toLowerCase();

  try {
    const relPath = VerifikasiMitra.ambilBerkasDariMitra(idMitra, jenis);
    if (!relPath) {
      return res.status(404).render('error', { pesan: 'Berkas dokumen belum diunggah oleh pendaftar.' });
    }
    return kirimBerkasTerdekripsi(res, relPath);
  } catch (err) {
    console.error('Gagal membuka berkas mitra:', err);
    return res.status(500).render('error', { pesan: 'Gagal membuka berkas dokumen.' });
  }
};