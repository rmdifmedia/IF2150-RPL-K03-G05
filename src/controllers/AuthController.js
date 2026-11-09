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
  const akun = Akun.cariByEmail(email);

  if (!akun || !bcrypt.compareSync(kataSandi, akun.sandi)) {
    req.flash('error', 'Email atau kata sandi salah');
    return res.redirect('/login');
  }
  if (akun.statusAkun === 'diblokir') {
    req.flash('error', 'Akun Anda diblokir');
    return res.redirect('/login');
  }

  req.session.user = { id: akun.id, nama: akun.nama, peran: akun.peran };
  res.redirect('/' + akun.peran);
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};