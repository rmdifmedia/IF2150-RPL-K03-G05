const Laporan = require('../models/Laporan');

// menampilkan halaman form lapor akun atau lapor ulasan
exports.tampilFormLaporan = (req, res) => {
  const { peranTerlapor, idTerlapor, idUlasan } = req.query;

  // Laporan ulasan (mitra melaporkan ulasan masyarakat)
  if (idUlasan) {
    const ulasan = Laporan.cariUlasanById(Number(idUlasan));
    if (!ulasan) {
      req.flash('error', 'Ulasan tidak ditemukan');
      return res.redirect('back');
    }

    return res.render('laporan/form', {
      mode: 'ulasan',
      ulasan,
      target: {
        id: ulasan.idMasyarakat,
        nama: ulasan.namaMasyarakat,
        peran: 'masyarakat'
      }
    });
  }

  // Laporan akun (Masyarakat dan Mitra bisa melaporkan akun lain))
  const target = Laporan.cariTargetAkun(peranTerlapor, Number(idTerlapor));
  if (!target) {
    req.flash('error', 'Akun yang ingin dilaporkan tidak ditemukan');
    return res.redirect('back');
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

  // kalo checkbox dipilih lebih dari 1, express.urlencoded berubah menjadi array (string[])
  if (Array.isArray(jenisPelanggaran)) {
    jenisPelanggaran = jenisPelanggaran.join(', ');
  }

  if (!jenisPelanggaran || !deskripsi || !deskripsi.trim()) {
    req.flash('error', 'Kategori pelanggaran dan deskripsi wajib diisi');
    return res.redirect('back');
  }

  const parsedIdUlasan = idUlasan ? Number(idUlasan) : null;
  let parsedIdTerlapor = Number(idTerlapor);

  // validasi dan ambil data terlapor jika melaporkan ulasan
  if (parsedIdUlasan) {
    const ulasan = Laporan.cariUlasanById(parsedIdUlasan);
    if (!ulasan) {
      req.flash('error', 'Ulasan tidak ditemukan');
      return res.redirect('back');
    }
    parsedIdTerlapor = ulasan.idMasyarakat;
    peranTerlapor = 'masyarakat';
  } else {
    const target = Laporan.cariTargetAkun(peranTerlapor, parsedIdTerlapor);
    if (!target) {
      req.flash('error', 'Akun terlapor tidak ditemukan');
      return res.redirect('back');
    }
  }

  if (parsedIdTerlapor === idPelapor && peranTerlapor === peranPelapor) {
    req.flash('error', 'Tidak dapat melaporkan akun sendiri');
    return res.redirect('back');
  }

  Laporan.buatLaporan({
    idPelapor,
    peranPelapor,
    idTerlapor: parsedIdTerlapor,
    peranTerlapor,
    idUlasan: parsedIdUlasan,
    jenisPelanggaran,
    deskripsi: deskripsi.trim()
  });

  req.flash('sukses', 'Laporan pelanggaran berhasil dikirim dan menunggu tinjauan Admin');
  res.redirect('/' + peranPelapor);
};