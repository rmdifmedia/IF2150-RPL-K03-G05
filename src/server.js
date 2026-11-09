require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// variabel yang otomatis di semua halaman
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.sukses = req.flash('sukses');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/auth'));
app.use('/masyarakat', require('./routes/masyarakat'));
app.use('/mitra', require('./routes/mitra'));
app.use('/konsultasi', require('./routes/konsultasi'));
app.use('/transaksi', require('./routes/transaksi'));
app.use('/admin', require('./routes/admin'));
app.use('/halolaw', require('./routes/halolaw'));

app.use((req, res) =>
  res.status(404).render('error', { pesan: 'Halaman tidak ditemukan' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LawHub berjalan di http://localhost:${port}`));