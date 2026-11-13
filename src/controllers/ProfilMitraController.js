const MitraPengacara = require('../models/MitraPengacara');
const JadwalKetersediaan = require('../models/JadwalKetersediaan');

const NAMA_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
// Kode tag harus sama dengan yang dipakai filter HaloLaw (PencarianMitraController)
const TAG = {
  pidana: 'Hukum Pidana',
  perdata: 'Hukum Perdata',
  administrasi: 'Hukum Administrasi Negara'
};
const pad = (n) => String(n).padStart(2, '0');
const hariIni = () => new Date().toLocaleDateString('sv-SE');  

// ---------- Kalender ----------
function bangunKalender(tahun, bulan0, tanggalDipilih, tanggalAdaSlot) {
  const jumlahHari = new Date(tahun, bulan0 + 1, 0).getDate();
  const hariPertama = new Date(tahun, bulan0, 1).getDay();  
  const sel = [];
  for (let i = 0; i < hariPertama; i++) sel.push(null);
  for (let h = 1; h <= jumlahHari; h++) {
    const iso = `${tahun}-${pad(bulan0 + 1)}-${pad(h)}`;
    sel.push({ hari: h, iso, dipilih: iso === tanggalDipilih, adaSlot: tanggalAdaSlot.has(iso), pudar: false });
  }
  let berikut = 1;
  while (sel.length % 7 !== 0) sel.push({ hari: berikut++, pudar: true });
  const minggu = [];
  for (let i = 0; i < sel.length; i += 7) minggu.push(sel.slice(i, i + 7));
  return minggu;
}

// ---------- Validasi ----------
// DPPL C08 EditProfilMitraPage.validasiData (Algo-008).
function validasiDataProfil(inputKredensial, tagKeahlian) {
  if (!inputKredensial || !inputKredensial.trim()) {
    return 'Deskripsi profil atau identitas tidak boleh kosong.';
  }
  if (!tagKeahlian) return 'Pilih minimal satu tag keahlian spesialisasi.';
  return null;
}

const rapikanTag = (nilai) =>
  [].concat(nilai || []).filter((t) => Object.hasOwn(TAG, t)).join(',');

function pesanSlotTidakValid(tanggal, mulai, selesai) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal || '') || !mulai || !selesai) return 'Tanggal dan jam wajib diisi.';
  if (mulai >= selesai) return 'Jam selesai harus setelah jam mulai.';
  if (tanggal < hariIni()) return 'Tanggal tidak boleh sudah lewat.';
  return null;
}


exports.lihatProfil = (req, res) => {
  const idMitra = req.session.user.id;
  const profil = MitraPengacara.infoProfil(idMitra);
  if (!profil) return res.redirect('/logout');

  let tanggal = req.query.tanggal;
  if (req.query.tahun && req.query.bulan) {
    tanggal = `${Number(req.query.tahun)}-${pad(Number(req.query.bulan))}-01`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal || '')) tanggal = hariIni();

  const tahun = Number(tanggal.slice(0, 4));
  const bulan0 = Number(tanggal.slice(5, 7)) - 1;
  const adaSlot = new Set(JadwalKetersediaan.tanggalAdaSlot(
    idMitra, `${tahun}-${pad(bulan0 + 1)}-01`, `${tahun}-${pad(bulan0 + 1)}-31`));

  const geser = (n) => {
    const d = new Date(tahun, bulan0 + n, 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
  };
  const t0 = new Date().getFullYear();
  const daftarTahun = [t0, t0 + 1, t0 + 2];
  if (!daftarTahun.includes(tahun)) daftarTahun.unshift(tahun);

  res.render('mitra/ProfilMitraPage', {
    TAG,
    profil,
    tanggal,
    tanggalHariIni: hariIni(),
    bulan: bulan0 + 1,
    tahun,
    namaBulan: NAMA_BULAN,
    daftarTahun,
    minggu: bangunKalender(tahun, bulan0, tanggal, adaSlot),
    tanggalSebelumnya: geser(-1),
    tanggalBerikutnya: geser(1),
    slot: JadwalKetersediaan.daftarByTanggal(idMitra, tanggal),
    idUbah: Number(req.query.ubah) || 0
  });
};

// ---------- Edit profil ----------
exports.formEditProfil = (req, res) => {
  const profil = MitraPengacara.infoProfil(req.session.user.id);
  if (!profil) return res.redirect('/logout');
  res.render('mitra/EditProfilMitraPage', { profil, TAG });
};

exports.simpanProfil = (req, res) => {
  const idMitra = req.session.user.id;
  const tagKeahlian = rapikanTag(req.body.tagKeahlian);
  const pesan = validasiDataProfil(req.body.deskripsi, tagKeahlian);
  if (pesan) {
    req.flash('error', pesan);
    return res.redirect('/mitra/profil/edit');
  }
  MitraPengacara.ubahProfil(idMitra, {
    namaFirma: (req.body.namaFirma || '').trim(),
    deskripsi: req.body.deskripsi.trim(),
    tagKeahlian
  });
  req.flash('sukses', 'Profil berhasil diperbarui.');
  res.redirect('/mitra/profil');
};

// ---------- Slot jadwal ----------
exports.tambahSlot = (req, res) => {
  const idMitra = req.session.user.id;
  const { tanggal, waktuMulai, waktuSelesai } = req.body;
  const kembali = '/mitra/profil?tanggal=' + encodeURIComponent(tanggal || hariIni());

  const pesan = pesanSlotTidakValid(tanggal, waktuMulai, waktuSelesai);
  if (pesan) { req.flash('error', pesan); return res.redirect(kembali); }
  if (JadwalKetersediaan.bentrok(idMitra, tanggal, waktuMulai, waktuSelesai, 0)) {
    req.flash('error', 'Jam tersebut bertumpuk dengan slot lain.');
    return res.redirect(kembali);
  }
  JadwalKetersediaan.tambah(idMitra, tanggal, waktuMulai, waktuSelesai);
  req.flash('sukses', 'Slot waktu ditambahkan.');
  res.redirect(kembali);
};


function ambilSlotBolehDiubah(req) {
  const slot = JadwalKetersediaan.cariById(Number(req.params.idJadwal));
  if (!slot || slot.idMitra !== req.session.user.id) {
    req.flash('error', 'Slot tidak ditemukan.');
    return null;
  }
  if (!MitraPengacara.cekKetersediaanJadwal(slot.idMitra, slot.tanggal, slot.waktuMulai)) {
    req.flash('error', 'Slot sudah dipesan masyarakat dan tidak dapat diubah.');
    return null;
  }
  return slot;
}

exports.ubahSlot = (req, res) => {
  const slot = ambilSlotBolehDiubah(req);
  if (!slot) return res.redirect('/mitra/profil');
  const kembali = '/mitra/profil?tanggal=' + slot.tanggal;
  const { waktuMulai, waktuSelesai } = req.body;

  const pesan = pesanSlotTidakValid(slot.tanggal, waktuMulai, waktuSelesai);
  if (pesan) { req.flash('error', pesan); return res.redirect(kembali); }
  if (JadwalKetersediaan.bentrok(slot.idMitra, slot.tanggal, waktuMulai, waktuSelesai, slot.idJadwal)) {
    req.flash('error', 'Jam tersebut bertumpuk dengan slot lain.');
    return res.redirect(kembali);
  }
  JadwalKetersediaan.ubah(slot.idJadwal, waktuMulai, waktuSelesai);
  req.flash('sukses', 'Slot waktu diperbarui.');
  res.redirect(kembali);
};

exports.hapusSlot = (req, res) => {
  const slot = ambilSlotBolehDiubah(req);
  if (!slot) return res.redirect('/mitra/profil');
  JadwalKetersediaan.hapus(slot.idJadwal);
  req.flash('sukses', 'Slot waktu dihapus.');
  res.redirect('/mitra/profil?tanggal=' + slot.tanggal);
};