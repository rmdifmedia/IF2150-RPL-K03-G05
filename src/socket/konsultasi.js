// Socket.IO namespace /konsultasi untuk chat sesi konsultasi (UC12).
const db = require('../db/database');
const Sesi = require('../models/SesiKonsultasi');

module.exports = (io, sessionMiddleware) => {
  const nsp = io.of('/konsultasi');

  nsp.use((socket, next) => sessionMiddleware(socket.request, {}, next));

  nsp.use((socket, next) => {
    const user = socket.request.session && socket.request.session.user;
    if (!user || !['masyarakat', 'mitra'].includes(user.peran)) {
      return next(new Error('Harus login sebagai masyarakat atau mitra pengacara'));
    }
    const tabel = user.peran === 'masyarakat'
      ? 'SELECT statusAkun FROM Masyarakat WHERE idMasyarakat = ?'
      : 'SELECT statusAkun FROM MitraPengacara WHERE idMitra = ?';
    const akun = db.prepare(tabel).get(user.id);
    if (!akun || akun.statusAkun === 'diblokir') return next(new Error('Akun diblokir atau tidak ditemukan'));
    socket.user = user;
    next();
  });

  // anggota sesi? (kembalikan sesi bila ya)
  const ambilSesi = (user, idSesi) => {
    const sesi = Sesi.cariById(Number(idSesi));
    if (!sesi) return null;
    if (user.peran === 'masyarakat' && sesi.idMasyarakat !== user.id) return null;
    if (user.peran === 'mitra' && sesi.idMitra !== user.id) return null;
    return sesi;
  };

  // kirim daftar peran yang sedang terhubung di room (untuk status "tertunda/terputus", UC12 alt 1)
  async function umumkanPresence(room) {
    const sockets = await nsp.in(room).fetchSockets();
    const peran = [...new Set(sockets.map((s) => s.user.peran))];
    nsp.to(room).emit('presence', { peran });
  }

  nsp.on('connection', (socket) => {
    const user = socket.user;

    socket.on('gabung', ({ idSesi } = {}) => {
      let sesi = ambilSesi(user, idSesi);
      if (!sesi) return socket.emit('pesan_error', 'Tidak memiliki akses ke sesi ini');
      if (Sesi.tutupJikaIdle(sesi)) sesi = Sesi.cariById(sesi.idSesi);

      const izin = Sesi.izinChat(sesi);
      if (!izin.ok) return socket.emit('pesan_error', izin.pesan);

      const room = `sesi_${sesi.idSesi}`;
      socket.join(room);
      socket.data.room = room;
      Sesi.mulai(sesi.idSesi); // mencatat waktu mulai pada koneksi pertama (UC12 normal 1)
      umumkanPresence(room);
    });

    socket.on('kirim_pesan', ({ idSesi, isiPesan } = {}) => {
      const isi = typeof isiPesan === 'string' ? isiPesan.trim() : '';
      if (!isi) return socket.emit('pesan_error', 'Pesan tidak boleh kosong.');
      if (isi.length > 2000) return socket.emit('pesan_error', 'Pesan terlalu panjang (maks. 2000 karakter).');

      let sesi = ambilSesi(user, idSesi);
      if (!sesi) return socket.emit('pesan_error', 'Tidak memiliki akses ke sesi ini');
      if (Sesi.tutupJikaIdle(sesi)) {
        nsp.to(`sesi_${sesi.idSesi}`).emit('sesi_selesai', { idSesi: sesi.idSesi, oleh: 'sistem' });
        return;
      }
      sesi = Sesi.cariById(sesi.idSesi);
      const izin = Sesi.izinChat(sesi);
      if (!izin.ok) return socket.emit('pesan_error', izin.pesan);

      const pesan = Sesi.simpanPesan(sesi.idSesi, user.peran, user.id, isi);
      nsp.to(`sesi_${sesi.idSesi}`).emit('pesan_baru', pesan);
    });

    socket.on('disconnecting', () => {
      const room = socket.data.room;
      if (room) setTimeout(() => umumkanPresence(room), 50);
    });
  });
};