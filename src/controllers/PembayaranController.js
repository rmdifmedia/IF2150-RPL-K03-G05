const Pembayaran = require('../models/Pembayaran');
const gateway = require('../services/PaymentGateway');
const { rupiah } = require('../utils/Format');

const TARIF_PER_JAM = Number(process.env.TARIF_PER_JAM || 70000);
const DURASI_JAM = Number(process.env.DURASI_SESI_JAM || 1);
const METODE = ['kartu', 'ewallet', 'virtual_account', 'qris'];

function muatSesi(req, res) {
  const sesi = Pembayaran.cariSesi(req.params.idSesi);
  if (!sesi || sesi.idMasyarakat !== req.session.user.id) {
    res.status(404).render('error', { pesan: 'Sesi konsultasi tidak ditemukan' });
    return null;
  }
  return sesi;
}

function bisaDibayar(req, res, sesi) {
  if (sesi.statusPembayaran === 'lunas') {
    req.flash('sukses', 'Sesi ini sudah dibayar');
    res.redirect('/transaksi/riwayat');
    return false;
  }
  if (String(sesi.statusSesi).toLowerCase() !== 'terjadwal') {
    req.flash('error', 'Sesi belum dikonfirmasi mitra, belum bisa dibayar');
    res.redirect('/transaksi/riwayat');
    return false;
  }
  return true;
}

exports.tampil = (req, res) => {
  const sesi = muatSesi(req, res);
  if (!sesi || !bisaDibayar(req, res, sesi)) return;
  res.render('transaksi/pembayaran', {
    sesi, biaya: Pembayaran.hitungBiaya(TARIF_PER_JAM, DURASI_JAM), rupiah, lama: {},
  });
};

exports.proses = (req, res) => {
  const sesi = muatSesi(req, res);
  if (!sesi || !bisaDibayar(req, res, sesi)) return;

  const biaya = Pembayaran.hitungBiaya(TARIF_PER_JAM, DURASI_JAM);
  const { metode, nomorKartu, kadaluwarsa, cvc } = req.body;
  const error = [];

  if (!METODE.includes(metode)) error.push('Pilih metode pembayaran');
  if (metode === 'kartu') {
    if (!/^\d{16}$/.test(String(nomorKartu || '').replace(/\s/g, ''))) error.push('Nomor kartu harus 16 digit');
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(kadaluwarsa || '')) error.push('Tanggal kadaluwarsa harus berformat BB/TT');
    if (!/^\d{3,4}$/.test(cvc || '')) error.push('Kode CVC/CVV harus 3-4 digit');
  }

  if (error.length) {
    return res.status(400).render('transaksi/pembayaran', { sesi, biaya, rupiah, lama: req.body, error });
  }

  const hasil = gateway.prosesPembayaran({
    metode, nominal: biaya.total, nomorKartu: String(nomorKartu || '').replace(/\s/g, ''),
  });

  Pembayaran.simpanHasil({
    idSesi: sesi.idSesi, idMitra: sesi.idMitra, nominal: biaya.total,
    penghasilanMitra: biaya.subtotal, metode, berhasil: hasil.berhasil,
  });

  if (!hasil.berhasil) {
    return res.status(402).render('transaksi/pembayaran', {
      sesi, biaya, rupiah, lama: req.body, error: ['Pembayaran gagal: ' + hasil.pesan],
    });
  }

  req.flash('sukses', 'Pembayaran berhasil. Klik Buka Chat pada sesi ini saat jadwal konsultasi tiba.');
  res.redirect('/konsultasi/saya');
};