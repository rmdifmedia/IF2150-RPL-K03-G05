const Laporan = require('../models/Laporan');

// menampilkan halaman form lapor akun atau lapor ulasan
exports.tampilFormLaporan = (req, res) => {
  const idPelapor = req.session.user.id;
  const peranPelapor = req.session.user.peran;
  const { peranTerlapor, idTerlapor, idUlasan } = req.query;

  // Laporan ulasan (mitra melaporkan ulasan masyarakat)
  if (idUlasan) {
    if (peranPelapor !== 'mitra') {
      req.flash('error', 'Hanya mitra pengacara yang dapat melaporkan ulasan');
      return res.redirect('/' + peranPelapor);
    }

    const ulasan = Laporan.cariUlasanById(Number(idUlasan));
    if (!ulasan || !ulasan.idMasyarakat || ulasan.idMitra !== idPelapor) {
      req.flash('error', 'Ulasan tidak ditemukan atau bukan milik profil Anda');
      return res.redirect('/' + peranPelapor);
    }

    return res.render('laporan/form', {
      mode: 'ulasan',
      ulasan,
      target: {
        id: ulasan.idMasyarakat,
        nama: ulasan.namaMasyarakat || 'Pengguna Masyarakat',
        peran: 'masyarakat'
      }
    });
  }

  // Laporan akun (Masyarakat dan Mitra bisa melaporkan akun lain)
  const peranTargetSah = peranPelapor === 'masyarakat' ? 'mitra' : 'masyarakat';
  const targetId = Number(idTerlapor);

  if (peranTerlapor !== peranTargetSah || !targetId) {
    req.flash('error', `Akun ${peranPelapor} hanya dapat melaporkan akun ${peranTargetSah}`);
    return res.redirect('/' + peranPelapor);
  }

  const target = Laporan.cariTargetAkun(peranTerlapor, targetId);
  if (!target) {
    req.flash('error', 'Akun yang ingin dilaporkan tidak ditemukan');
    return res.redirect('/' + peranPelapor);
  }

  res.render('laporan/form', {
    mode: 'akun',
    ulasan: null,
    target: { ...target, peran: peranTerlapor }
  });
};

// submit form laporan
exports.prosesBuatLaporan = (req, res) => {
  const idPelapor = req.session.user.id;
  const peranPelapor = req.session.user.peran;
  let { idTerlapor, peranTerlapor, idUlasan, jenisPelanggaran, deskripsi } = req.body;

  if (Array.isArray(jenisPelanggaran)) {
    jenisPelanggaran = jenisPelanggaran.join(', ');
  }

  const ulasanId = idUlasan ? Number(idUlasan) : null;
  const redirectFormUrl = ulasanId
    ? `/laporan/buat?idUlasan=${ulasanId}`
    : `/laporan/buat?peranTerlapor=${encodeURIComponent(peranTerlapor || '')}&idTerlapor=${encodeURIComponent(idTerlapor || '')}`;

  if (!jenisPelanggaran || !deskripsi || !deskripsi.trim()) {
    req.flash('error', 'Kategori pelanggaran dan deskripsi wajib diisi');
    return res.redirect(redirectFormUrl);
  }

  let targetId = Number(idTerlapor);

  if (ulasanId) {
    const ulasan = Laporan.cariUlasanById(ulasanId);
    if (peranPelapor !== 'mitra' || !ulasan || !ulasan.idMasyarakat || ulasan.idMitra !== idPelapor) {
      req.flash('error', 'Ulasan tidak ditemukan atau Anda tidak memiliki akses');
      return res.redirect('/' + peranPelapor);
    }
    targetId = ulasan.idMasyarakat;
    peranTerlapor = 'masyarakat';
  } else {
    const peranTargetSah = peranPelapor === 'masyarakat' ? 'mitra' : 'masyarakat';
    if (peranTerlapor !== peranTargetSah || !targetId) {
      req.flash('error', `Target akun terlapor harus berupa ${peranTargetSah}`);
      return res.redirect('/' + peranPelapor);
    }

    const target = Laporan.cariTargetAkun(peranTerlapor, targetId);
    if (!target) {
      req.flash('error', 'Akun terlapor tidak ditemukan');
      return res.redirect('/' + peranPelapor);
    }
  }

  Laporan.buatLaporan({
    idPelapor,
    peranPelapor,
    idTerlapor: targetId,
    peranTerlapor,
    idUlasan: ulasanId,
    jenisPelanggaran,
    deskripsi: deskripsi.trim()
  });

  req.flash('sukses', 'Laporan pelanggaran berhasil dikirim dan menunggu tinjauan Admin');
  res.redirect('/' + peranPelapor);
};