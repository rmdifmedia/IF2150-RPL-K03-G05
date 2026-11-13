// C31 PenjadwalanKonsultasiController (UC10)
const Sesi = require('../models/SesiKonsultasi');

const TAG = {
  pidana: 'Hukum Pidana',
  perdata: 'Hukum Perdata',
  administrasi: 'Hukum Administrasi Negara',
};
const RE_TANGGAL = /^\d{4}-\d{2}-\d{2}$/;
const RE_WAKTU = /^\d{2}:\d{2}$/;

function ambilMitra(req, res) {
  const mitra = Sesi.cariMitraAktif(Number(req.params.idMitra));
  if (!mitra) {
    res.status(404).render('error', { pesan: 'Mitra pengacara tidak ditemukan' });
    return null;
  }
  return mitra;
}

// GET /konsultasi/jadwal/:idMitra  -> UI-08
exports.tampilJadwal = (req, res) => {
  const mitra = ambilMitra(req, res);
  if (!mitra) return;
  Sesi.batalkanKedaluwarsa();

  // kasus yang jadi dasar konsultasi: ?kasus=ID, bila tidak ada pakai kasus terakhir masyarakat
  const idMasyarakat = req.session.user.id;
  const kasus = req.query.kasus
    ? Sesi.cariKasusMilik(Number(req.query.kasus), idMasyarakat)
    : Sesi.kasusTerakhir(idMasyarakat);

  res.render('konsultasi/jadwal', {
    judulHalaman: 'Pemilihan Jadwal', judul: 'HaloLaw', ikonJudul: 'telepon',
    mitra, kasus: kasus || null, TAG,
    hariIni: Sesi.wibSekarang().tanggal,
    labelSlot: Sesi.labelSlot,
  });
};

// GET /konsultasi/jadwal/:idMitra/slot?tanggal=YYYY-MM-DD  (JSON, validasiJadwal)
exports.apiSlot = (req, res) => {
  const mitra = Sesi.cariMitraAktif(Number(req.params.idMitra));
  const tanggal = String(req.query.tanggal || '');
  if (!mitra || !RE_TANGGAL.test(tanggal)) return res.status(400).json({ success: false, message: 'Permintaan tidak valid' });
  Sesi.batalkanKedaluwarsa();
  const slot = Sesi.slotTersedia(mitra.idMitra, tanggal).map((w) => ({ waktu: w, label: Sesi.labelSlot(w) }));
  res.json({ success: true, tanggal, slot });
};

// GET /konsultasi/jadwal/:idMitra/kalender?tahun=2026&bulan=11  (JSON, tanggal yang masih punya slot)
exports.apiKalender = (req, res) => {
  const mitra = Sesi.cariMitraAktif(Number(req.params.idMitra));
  const tahun = Number(req.query.tahun);
  const bulan = Number(req.query.bulan);
  if (!mitra || !(tahun >= 2000 && tahun <= 2100) || !(bulan >= 1 && bulan <= 12)) {
    return res.status(400).json({ success: false, message: 'Permintaan tidak valid' });
  }
  Sesi.batalkanKedaluwarsa();
  res.json({ success: true, tersedia: Sesi.tanggalAdaSlot(mitra.idMitra, tahun, bulan) });
};

// POST /konsultasi/jadwal/:idMitra  -> buatSesiKonsultasi()
exports.buatSesiKonsultasi = (req, res) => {
  const mitra = ambilMitra(req, res);
  if (!mitra) return;
  const { tanggal, waktu } = req.body;
  const kembali = `/konsultasi/jadwal/${mitra.idMitra}`;

  if (!RE_TANGGAL.test(tanggal || '') || !RE_WAKTU.test(waktu || '')) {
    req.flash('error', 'Pilih tanggal dan waktu konsultasi terlebih dahulu.');
    return res.redirect(kembali);
  }

  const idMasyarakat = req.session.user.id;
  const kasus = req.body.idKasus ? Sesi.cariKasusMilik(Number(req.body.idKasus), idMasyarakat) : null;

  const idSesi = Sesi.buat({
    idMasyarakat, idMitra: mitra.idMitra, idKasus: kasus ? kasus.idKasus : null, tanggal, waktu,
  });
  if (!idSesi) {
    req.flash('error', 'Jadwal yang dipilih tidak tersedia. Silakan pilih jadwal lain.');
    return res.redirect(kembali);
  }
  req.flash('sukses', 'Permintaan konsultasi berhasil dikirim. Menunggu tanggapan mitra pengacara.');
  res.redirect('/konsultasi/saya');
};