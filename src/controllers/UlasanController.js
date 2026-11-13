const Ulasan = require('../models/Ulasan');

function muat(req, res) {
  const sesi = Ulasan.cariSesi(req.params.idSesi);
  if (!sesi || sesi.idMasyarakat !== req.session.user.id) {
    res.status(404).render('error', { pesan: 'Sesi konsultasi tidak ditemukan' });
    return null;
  }
  const selesai = sesi.statusKonsul === 'selesai' || !!sesi.waktuSelesai;
  if (!selesai) {
    req.flash('error', 'Ulasan hanya bisa diberikan setelah sesi konsultasi selesai');
    res.redirect('/transaksi/riwayat');
    return null;
  }
  if (Ulasan.sudahAda(sesi.idSesi)) {
    req.flash('error', 'Kamu sudah memberi ulasan untuk sesi ini');
    res.redirect('/transaksi/riwayat');
    return null;
  }
  return sesi;
}

exports.tampil = (req, res) => {
  const sesi = muat(req, res);
  if (sesi) res.render('transaksi/ulasan', { sesi, lama: {} });
};

exports.kirim = (req, res) => {
  const sesi = muat(req, res);
  if (!sesi) return;

  const skor = parseInt(req.body.skor, 10);
  const teks = (req.body.teks || '').trim();
  const error = [];
  if (!(skor >= 1 && skor <= 5)) error.push('Rating wajib diisi (1-5 bintang)');
  if (teks.length > 1000) error.push('Ulasan maksimal 1000 karakter');

  if (error.length) {
    return res.status(400).render('transaksi/ulasan', { sesi, lama: req.body, error });
  }

  Ulasan.simpan({
    idSesi: sesi.idSesi, idMasyarakat: sesi.idMasyarakat, idMitra: sesi.idMitra, skor, teks,
  });
  req.flash('sukses', 'Ulasan berhasil dikirim');
  res.redirect('/transaksi/riwayat');
};