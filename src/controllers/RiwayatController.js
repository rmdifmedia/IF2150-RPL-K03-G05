const Riwayat = require('../models/Riwayat');
const { tanggal } = require('../utils/Format');

exports.daftar = (req, res) => {
  const { id, peran } = req.session.user;
  const daftar = peran === 'mitra' ? Riwayat.untukMitra(id) : Riwayat.untukMasyarakat(id);
  res.render('transaksi/riwayat-list', { daftar, tanggal });
};

exports.detail = (req, res) => {
  const { id, peran } = req.session.user;
  const sesi = Riwayat.detailSesi(req.params.idSesi);
  const milik = sesi && (peran === 'mitra' ? sesi.idMitra === id : sesi.idMasyarakat === id);
  if (!milik) return res.status(404).render('error', { pesan: 'Riwayat tidak ditemukan' });

  res.render('transaksi/riwayat-chat', {
    sesi, pesan: Riwayat.pesanSesi(sesi.idSesi), peranSaya: peran,
    lawan: peran === 'mitra' ? sesi.namaMasyarakat : sesi.namaMitra, tanggal,
  });
};