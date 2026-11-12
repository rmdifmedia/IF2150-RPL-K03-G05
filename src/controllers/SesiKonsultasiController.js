// C32 SesiKonsultasiController (UC11 + UC12)
const Sesi = require('../models/SesiKonsultasi');

const LABEL_STATUS = {
  menunggu: 'Menunggu tanggapan mitra',
  terjadwal: 'Terjadwal',
  berlangsung: 'Sedang berlangsung',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

// format tanggal ISO -> "12/11/2026" dan jam WIB "14:05"
const pisah = (iso) => {
  if (!iso) return { tanggal: '-', jam: '-' };
  const f = (opt) => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', ...opt }).format(new Date(iso));
  return {
    tanggal: f({ day: '2-digit', month: '2-digit', year: 'numeric' }),
    jam: f({ hour: '2-digit', minute: '2-digit', hour12: false }),
  };
};

// untuk UC11: Menanggapi Sesi Konsultasi (mitra)

// GET /konsultasi/pengajuan  -> daftar permintaan masuk
exports.daftarPengajuan = (req, res) => {
  Sesi.batalkanKedaluwarsa();
  const daftar = Sesi.daftarPengajuanMitra(req.session.user.id);
  res.render('konsultasi/pengajuan', {
    judulHalaman: 'List Pengajuan', css: '/css/konsultasi.css', navMitra: 'pengajuan', daftar, LABEL_STATUS, pisah,
  });
};

// GET /konsultasi/pengajuan/:idSesi -> tampilkanPermintaanJadwal() (UI Konfirmasi Konsultasi)
exports.tampilKonfirmasi = (req, res) => {
  Sesi.batalkanKedaluwarsa();
  const sesi = Sesi.cariById(Number(req.params.idSesi));
  if (!sesi || sesi.idMitra !== req.session.user.id) {
    return res.status(404).render('error', { pesan: 'Permintaan konsultasi tidak ditemukan' });
  }
  res.render('konsultasi/konfirmasi', {
    judulHalaman: 'Konfirmasi Konsultasi', css: '/css/konsultasi.css', navMitra: 'konfirmasi',
    sesi, LABEL_STATUS, pisah, labelSlot: Sesi.labelSlot,
    sisaDetik: sesi.statusSesi === 'menunggu' ? Sesi.sisaDetikRespon(sesi) : 0,
  });
};

// POST /konsultasi/pengajuan/:idSesi  body: aksi=terima|tolak, catatan  -> prosesKonfirmasiJadwal()
exports.prosesKonfirmasi = (req, res) => {
  const idSesi = Number(req.params.idSesi);
  const { aksi } = req.body;
  const catatan = String(req.body.catatan || '').trim().slice(0, 500);
  Sesi.batalkanKedaluwarsa();

  if (!['terima', 'tolak'].includes(aksi)) {
    req.flash('error', 'Pilihan tanggapan tidak valid.');
    return res.redirect(`/konsultasi/pengajuan/${idSesi}`);
  }
  const berhasil = Sesi.tanggapi(idSesi, req.session.user.id, aksi === 'terima' ? 'terjadwal' : 'dibatalkan', catatan);
  if (!berhasil) {
    req.flash('error', 'Gagal memproses tanggapan. Permintaan mungkin sudah ditanggapi atau kedaluwarsa.');
    return res.redirect('/konsultasi/pengajuan');
  }
  req.flash('sukses', aksi === 'terima' ? 'Permintaan konsultasi diterima. Jadwal telah dikunci.' : 'Permintaan konsultasi ditolak.');
  res.redirect('/konsultasi/pengajuan');
};

// daftar sesi milik masyarakat (pintu masuk ke chat)

// GET /konsultasi/saya
exports.daftarSaya = (req, res) => {
  Sesi.batalkanKedaluwarsa();
  const daftar = Sesi.daftarMasyarakat(req.session.user.id);
  res.render('konsultasi/saya', { judulHalaman: 'Sesi Konsultasi Saya', css: '/css/konsultasi.css', judul: 'HaloLaw', ikonJudul: 'telepon', daftar, LABEL_STATUS, labelSlot: Sesi.labelSlot, Sesi });
};

// untuk UC12: Melakukan Sesi Konsultasi (chat)

function sesiMilik(req) {
  const sesi = Sesi.cariById(Number(req.params.idSesi));
  if (!sesi) return null;
  const { id, peran } = req.session.user;
  if (peran === 'masyarakat' && sesi.idMasyarakat !== id) return null;
  if (peran === 'mitra' && sesi.idMitra !== id) return null;
  return sesi;
}

// GET /konsultasi/chat/:idSesi  -> UI-10 (masyarakat) / UI-11 (mitra)
exports.tampilChat = (req, res) => {
  let sesi = sesiMilik(req);
  if (!sesi) return res.status(404).render('error', { pesan: 'Sesi konsultasi tidak ditemukan' });

  if (Sesi.tutupJikaIdle(sesi)) sesi = Sesi.cariById(sesi.idSesi);
  const izin = Sesi.izinChat(sesi);
  const peran = req.session.user.peran;
  const lawan = peran === 'masyarakat' ? sesi.namaMitra : sesi.namaMasyarakat;

  res.render('konsultasi/chat', {
    judulHalaman: 'Chat Konsultasi', css: '/css/konsultasi.css', judul: peran === 'masyarakat' ? 'HaloLaw' : '', ikonJudul: peran === 'masyarakat' ? 'telepon' : '', navMitra: peran === 'mitra' ? 'chat' : undefined,
    tanpaFooter: true, bodyClass: 'halaman-konsul-chat',
    sesi, izin, lawan, peran,
    // sesi selesai tetap boleh dibaca (riwayat), tapi gak bisa mengirim
    daftarPesan: Sesi.ambilPesan(sesi.idSesi),
    kasusAwal: sesi.deskripsiKasus || null,
  });
};

// POST /konsultasi/chat/:idSesi/akhiri  -> akhiriSesiKonsultasi()
exports.akhiriSesi = (req, res) => {
  const sesi = sesiMilik(req);
  if (!sesi) return res.status(404).render('error', { pesan: 'Sesi konsultasi tidak ditemukan' });
  const peran = req.session.user.peran;

  if (!Sesi.akhiri(sesi.idSesi)) {
    req.flash('error', 'Sesi ini tidak sedang berjalan.');
    return res.redirect(`/konsultasi/chat/${sesi.idSesi}`);
  }
  const io = req.app.get('io');
  if (io) io.of('/konsultasi').to(`sesi_${sesi.idSesi}`).emit('sesi_selesai', { idSesi: sesi.idSesi, oleh: peran });

  req.flash('sukses', 'Sesi konsultasi telah diakhiri.');
  res.redirect(peran === 'masyarakat' ? '/konsultasi/saya' : '/konsultasi/pengajuan');
};