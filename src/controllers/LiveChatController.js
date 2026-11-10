const LiveChat = require('../models/LiveChat');

// UC 19: Halaman LiveChat Masyarakat
exports.tampilChatMasyarakat = (req, res) => {
  const idMasyarakat = req.session.user.id;
  const chatAktif = LiveChat.cariChatAktifMasyarakat(idMasyarakat) || null;
  const daftarPesan = chatAktif ? LiveChat.ambilPesanByChat(chatAktif.idChat) : [];
  const adaAdminStandby = LiveChat.cekAdaAdminStandby();

  res.render('livechat/masyarakat', {
    chatAktif,
    daftarPesan,
    adaAdminStandby
  });
};

// UC 19: Masyarakat mengakhiri sesi chat
exports.selesaiChatMasyarakat = (req, res) => {
  const idMasyarakat = req.session.user.id;
  const chat = LiveChat.cariChatAktifMasyarakat(idMasyarakat);

  if (!chat) {
    req.flash('error', 'Tidak ada sesi live chat yang sedang aktif');
    return res.redirect('/masyarakat/livechat');
  }

  LiveChat.selesaikanChat(chat.idChat);

  const io = req.app.get('io');
  if (io) {
    io.to(`chat_${chat.idChat}`).emit('sesi_selesai', { idChat: chat.idChat, oleh: 'masyarakat' });
    io.to('admin_room').emit('admin:antrean_update', {
      idChat: chat.idChat,
      statusChat: 'selesai'
    });
  }

  req.flash('sukses', 'Sesi live chat telah diakhiri');
  res.redirect('/masyarakat/livechat');
};

// UC 20: Halaman LiveChat Admin
exports.tampilChatAdmin = (req, res) => {
  const admin = LiveChat.cariAdminById(req.session.user.id);
  const daftarAntrean = LiveChat.ambilDaftarAntreanAdmin();

  let chatAktif = null;
  if (req.query.idChat) {
    chatAktif = LiveChat.cariChatById(Number(req.query.idChat)) || null;
  } else if (daftarAntrean.length > 0) {
    chatAktif = LiveChat.cariChatById(daftarAntrean[0].idChat) || null;
  }

  const daftarPesan = chatAktif ? LiveChat.ambilPesanByChat(chatAktif.idChat) : [];

  res.render('livechat/admin', {
    admin,
    daftarAntrean,
    chatAktif,
    daftarPesan
  });
};

// UC 20: Toggle statusStandby Admin (1 <-> 0)
exports.toggleStandbyAdmin = (req, res) => {
  const admin = LiveChat.cariAdminById(req.session.user.id);
  if (!admin) {
    req.flash('error', 'Akun admin tidak ditemukan');
    return res.redirect('/admin/livechat');
  }

  const statusBaru = admin.statusStandby === 1 ? 0 : 1;
  LiveChat.ubahStatusStandby(admin.idAdmin, statusBaru);

  req.flash('sukses', statusBaru === 1 ? 'Status diubah menjadi Standby' : 'Status diubah menjadi Tidak Standby');
  res.redirect('/admin/livechat');
};

// UC 20: Admin menyelesaikan sesi chat tertentu
exports.selesaiChatAdmin = (req, res) => {
  const idChat = Number(req.params.idChat);
  const chat = LiveChat.cariChatById(idChat);

  if (!chat) {
    req.flash('error', 'Sesi live chat tidak ditemukan');
    return res.redirect('/admin/livechat');
  }

  LiveChat.selesaikanChat(idChat);

  const io = req.app.get('io');
  if (io) {
    io.to(`chat_${idChat}`).emit('sesi_selesai', { idChat, oleh: 'admin' });
    io.to('admin_room').emit('admin:antrean_update', {
      idChat,
      statusChat: 'selesai'
    });
  }

  req.flash('sukses', `Sesi chat #${idChat} telah diselesaikan`);
  res.redirect('/admin/livechat');
};