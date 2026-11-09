const bcrypt = require('bcryptjs');
const Akun = require('../models/Akun');

exports.tampilLogin = (req, res) => {
  if (req.session.user) return res.redirect('/' + req.session.user.peran);
  res.render('auth/login');
};

exports.tampilLoginMasyarakat = (req, res) => {
  if (req.session.user) return res.redirect('/' + req.session.user.peran);
  res.render('auth/login-masyarakat');
}

const PESAN_KOSONG    = 'Email dan password wajib diisi.';
const PESAN_MASYARAKAT = 'Email/password salah atau akun tidak ditemukan.';
const PESAN_MITRA      = 'Email/password salah atau akun mitra belum terverifikasi oleh Admin.';

// private: bandingkan sandi yang diketik dengan hash di database
function verifikasiSandi(sandiInput, sandiHash) {
  return bcrypt.compareSync(sandiInput, sandiHash);
}

// mengembalikan pesan error, atau null bila berhasil
function autentikasiMasyarakat(akun, sandi) {
  if (!akun || akun.statusAkun === 'diblokir' || !verifikasiSandi(sandi, akun.sandi)) {
    return PESAN_MASYARAKAT;
  }
  return null;
}

function autentikasiMitra(akun, sandi) {
  if (!akun || akun.statusAkun === 'diblokir' ||
      akun.statusVerifikasi !== 'terverifikasi' ||
      !verifikasiSandi(sandi, akun.sandi)) {
    return PESAN_MITRA;
  }
  return null;
}

exports.prosesLogin = (req, res) => {
  const email = (req.body.email || '').trim();
  const sandi = req.body.kataSandi || '';

  if (!email || !sandi) {
    req.flash('error', PESAN_KOSONG);
    return res.redirect('/login');
  }

  const akun = Akun.cariByEmail(email);
  const pesan = (akun && akun.peran === 'mitra')
    ? autentikasiMitra(akun, sandi)
    : autentikasiMasyarakat(akun, sandi);

  if (pesan) {
    req.flash('error', pesan);
    return res.redirect('/login');
  }

  req.session.user = { id: akun.id, nama: akun.nama, peran: akun.peran };
  res.redirect('/' + akun.peran);
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};