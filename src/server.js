require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('io', io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'lawhub-dev-secret',
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);
app.use(flash());

// variabel yang otomatis di semua halaman
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.sukses = req.flash('sukses');
  res.locals.error = req.flash('error');

      // Default untuk header
  res.locals.varian = 'polos';
  res.locals.beranda = '/';
  res.locals.menu = [];
  res.locals.judul = '';
  res.locals.ikonJudul = '';

  
  next();
});

require('./socket/livechat')(io, sessionMiddleware);
require('./socket/konsultasi')(io, sessionMiddleware);   // UC12 chat konsultasi (namespace /konsultasi)

// Tugas berkala UC11/UC12: batalkan permintaan yang tidak ditanggapi & tutup sesi chat yang idle (otomatis di DB)
const SesiKonsultasi = require('./models/SesiKonsultasi');
setInterval(() => {
  try {
    SesiKonsultasi.batalkanKedaluwarsa();
    SesiKonsultasi.tutupIdleSemua().forEach((id) =>
      io.of('/konsultasi').to(`sesi_${id}`).emit('sesi_selesai', { idSesi: id, oleh: 'sistem' }));
  } catch (e) { console.error('Job konsultasi gagal:', e.message); }
}, 60 * 1000).unref();

app.use('/', require('./routes/auth'));
app.use('/masyarakat', require('./routes/masyarakat'));
app.use('/mitra', require('./routes/mitra'));
app.use('/konsultasi', require('./routes/konsultasi'));
app.use('/transaksi', require('./routes/transaksi'));
app.use('/admin', require('./routes/admin'));
app.use('/searchlaw', require('./routes/searchLaw'));
app.use('/halolaw', require('./routes/halolaw'));
app.use('/laporan', require('./routes/laporan'));

app.use((req, res) =>
  res.status(404).render('error', { pesan: 'Halaman tidak ditemukan' })
);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).render('error', { pesan: 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`LawHub berjalan di http://localhost:${PORT}`);
});