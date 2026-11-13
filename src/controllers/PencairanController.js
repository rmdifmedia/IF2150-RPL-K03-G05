const Pencairan = require('../models/PencairanDana');
const gateway = require('../services/paymentGateway');
const { rupiah, tanggal } = require('../utils/format');

// rekeningPencairan disimpan sebagai "Bank|Nomor|Pemilik"
const urai = (teks) => {
  if (!teks) return null;
  const [bank, nomor, pemilik] = teks.split('|');
  return { bank, nomor, pemilik, tersamar: nomor.slice(0, 3) + '*'.repeat(Math.max(nomor.length - 5, 3)) + nomor.slice(-2) };
};

const LABEL = { berhasil: 'Berhasil', menunggu: 'Pending', gagal: 'Belum' };

exports.tampil = (req, res) => {
  const idMitra = req.session.user.id;
  const profil = Pencairan.profilKeuangan(idMitra);
  res.render('transaksi/pencairan', {
    saldo: profil.saldo, rekening: urai(profil.rekeningPencairan),
    transaksi: Pencairan.transaksiMasuk(idMitra), pencairan: Pencairan.riwayatPencairan(idMitra),
    rupiah, tanggal, LABEL,
  });
};

exports.simpanRekening = (req, res) => {
  const bank = (req.body.bank || '').trim().replace(/\|/g, '');
  const nomor = (req.body.nomor || '').replace(/\s/g, '');
  const pemilik = (req.body.pemilik || '').trim().replace(/\|/g, '');
  if (!bank || !pemilik || !/^\d{6,20}$/.test(nomor)) {
    req.flash('error', 'Lengkapi bank/e-wallet, nomor rekening (6-20 digit), dan nama pemilik');
    return res.redirect('/transaksi/pencairan');
  }
  Pencairan.simpanRekening(req.session.user.id, [bank, nomor, pemilik].join('|'));
  req.flash('sukses', 'Rekening tujuan disimpan');
  res.redirect('/transaksi/pencairan');
};

exports.cairkan = (req, res) => {
  const idMitra = req.session.user.id;
  const profil = Pencairan.profilKeuangan(idMitra);
  const nominal = Number(req.body.nominal);

  const gagal = (pesan) => { req.flash('error', pesan); return res.redirect('/transaksi/pencairan'); };

  if (!profil.rekeningPencairan) return gagal('Isi rekening tujuan terlebih dahulu');
  if (!Number.isFinite(nominal) || nominal <= 0) return gagal('Nominal pencairan harus lebih dari 0');
  if (nominal > profil.saldo) return gagal('Saldo tidak mencukupi');

  const hasil = gateway.prosesPencairan({ rekening: profil.rekeningPencairan, nominal });
  try {
    Pencairan.ajukan({ idMitra, nominal, rekening: profil.rekeningPencairan, berhasil: hasil.berhasil });
  } catch (e) {
    return gagal(e.message);
  }
  if (!hasil.berhasil) return gagal('Pencairan ditolak: ' + hasil.pesan);

  req.flash('sukses', 'Pencairan dana ' + rupiah(nominal) + ' berhasil diproses');
  res.redirect('/transaksi/pencairan');
};