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

exports.prosesLogin = (req, res) => {
  const { email, kataSandi } = req.body;
  const akun = Akun.cariByEmail((email || '').trim());

  // 1) akun tidak ada
  if (!akun) {
    req.flash('error', 'Akun tidak ditemukan');
    return res.redirect('/login');
  }

  // 2) kata sandi salah
  if (!bcrypt.compareSync(kataSandi || '', akun.sandi)) {
    req.flash('error', 'Kombinasi username/password salah');
    return res.redirect('/login');
  }

  // 3) akun diblokir
  if (akun.statusAkun === 'diblokir') {
    req.flash('error', 'Akun Anda diblokir');
    return res.redirect('/login');
  }

  // 4) mitra belum terverifikasi
  if (akun.peran === 'mitra' && akun.statusVerifikasi !== 'terverifikasi') {
    const pesan = {
      'menunggu': 'Akun Anda belum diverifikasi oleh admin',
      'ditolak': 'Pendaftaran akun Anda ditolak',
      'wajib revisi': 'Akun Anda perlu revisi dokumen'
    };
    req.flash('error', pesan[akun.statusVerifikasi] || 'Akun Anda belum terverifikasi');
    return res.redirect('/login');
  }

  // 5) berhasil
  req.session.user = { id: akun.id, nama: akun.nama, peran: akun.peran };
  res.redirect('/' + akun.peran);
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};