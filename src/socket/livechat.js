const db = require('../db/database');
const LiveChat = require('../models/LiveChat');

module.exports = (io, sessionMiddleware) => {
  // membagikan session Express ke Socket.IO
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  // verifikasi login & status akun
  io.use((socket, next) => {
    const user = socket.request.session && socket.request.session.user;
    if (!user || !['masyarakat', 'admin'].includes(user.peran)) {
      return next(new Error('Harus login sebagai masyarakat atau admin'));
    }

    if (user.peran === 'masyarakat') {
      const akun = db
        .prepare('SELECT statusAkun FROM Masyarakat WHERE idMasyarakat = ?')
        .get(user.id);
      if (!akun || akun.statusAkun === 'diblokir') {
        return next(new Error('Akun diblokir atau tidak ditemukan'));
      }
    } else {
      const admin = db
        .prepare('SELECT idAdmin FROM Admin WHERE idAdmin = ?')
        .get(user.id);
      if (!admin) {
        return next(new Error('Akun admin tidak ditemukan'));
      }
    }

    socket.user = user;
    next();
  });

  io.on('connection', (socket) => {
    const user = socket.user;

    if (user.peran === 'admin') {
      socket.join('admin_room');
    } else {
      socket.join(`masyarakat_${user.id}`);
    }

    // bergabung ke room percakapan tertentu
    socket.on('gabung_chat', (payload) => {
      const idChat = Number(payload && payload.idChat);
      if (!idChat) return;

      const chat = LiveChat.cariChatById(idChat);
      if (!chat) return;

      if (user.peran === 'masyarakat' && chat.idMasyarakat !== user.id) {
        socket.emit('pesan_error', 'Tidak memiliki akses ke sesi chat ini');
        return;
      }

      socket.join(`chat_${idChat}`);
    });

    // mengirim pesan real-time
    socket.on('kirim_pesan', (payload) => {
      const isiPesan = typeof (payload && payload.isiPesan) === 'string' ? payload.isiPesan.trim() : '';
      if (!isiPesan) return;

      if (user.peran === 'masyarakat') {
        const akun = db
          .prepare('SELECT statusAkun FROM Masyarakat WHERE idMasyarakat = ?')
          .get(user.id);
        if (!akun || akun.statusAkun === 'diblokir') {
          socket.emit('pesan_error', 'Akun Anda diblokir');
          return;
        }

        const requestedChatId = Number(payload && payload.idChat);
        let chat = requestedChatId
          ? LiveChat.cariChatById(requestedChatId)
          : LiveChat.cariChatAktifMasyarakat(user.id);

        if (chat) {
          if (chat.idMasyarakat !== user.id) {
            socket.emit('pesan_error', 'Tidak memiliki akses ke sesi chat ini');
            return;
          }
          if (chat.statusChat === 'selesai') {
            socket.emit('pesan_error', 'Sesi chat sudah berakhir. Muat ulang halaman untuk memulai chat baru.');
            return;
          }
        } else {
          if (!LiveChat.cekAdaAdminStandby()) {
            socket.emit('pesan_error', 'Belum ada Admin yang standby saat ini.');
            return;
          }

          chat = LiveChat.buatSesiChat(user.id);
          io.in(`masyarakat_${user.id}`).socketsJoin(`chat_${chat.idChat}`);
          io.to(`masyarakat_${user.id}`).emit('sesi_dibuat', {
            idChat: chat.idChat,
            statusChat: chat.statusChat
          });
        }

        const pesanBaru = LiveChat.tambahPesan({
          idChat: chat.idChat,
          peranPengirim: 'masyarakat',
          idPengirim: user.id,
          isiPesan
        });

        io.to(`chat_${chat.idChat}`).emit('pesan_baru', pesanBaru);
        io.to('admin_room').emit('admin:antrean_update', {
          idChat: chat.idChat,
          namaMasyarakat: chat.namaMasyarakat,
          statusChat: chat.statusChat,
          pesanTerakhir: isiPesan
        });
        return;
      }

      // admin membalas pesan
      if (user.peran === 'admin') {
        const idChat = Number(payload && payload.idChat);
        const chat = idChat ? LiveChat.cariChatById(idChat) : null;

        if (!chat) {
          socket.emit('pesan_error', 'Pilih sesi chat terlebih dahulu');
          return;
        }
        if (chat.statusChat === 'selesai') {
          socket.emit('pesan_error', 'Sesi chat ini sudah diselesaikan');
          return;
        }

        if (chat.statusChat === 'menunggu' || !chat.idAdmin) {
          LiveChat.klaimChatOlehAdmin(chat.idChat, user.id);
          io.to(`chat_${chat.idChat}`).emit('status_berubah', {
            idChat: chat.idChat,
            statusChat: 'berlangsung',
            namaAdmin: user.nama
          });
        }

        const pesanBaru = LiveChat.tambahPesan({
          idChat: chat.idChat,
          peranPengirim: 'admin',
          idPengirim: user.id,
          isiPesan
        });

        io.to(`chat_${chat.idChat}`).emit('pesan_baru', pesanBaru);
        io.to('admin_room').emit('admin:antrean_update', {
          idChat: chat.idChat,
          namaMasyarakat: chat.namaMasyarakat,
          statusChat: 'berlangsung',
          pesanTerakhir: isiPesan
        });
      }
    });
  });
};