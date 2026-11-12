// C46 SesiKonsultasi (UC10, UC11, UC12)
const db = require('../db/database');

// konstanta
// Slot konsultasi tetap per hari (UI-08). Ubah di sini jika jam praktik berubah.
const SLOT = ['14:00', '15:00', '16:00', '17:00', '18:00'];
const DURASI_MENIT = 60;
const BATAS_RESPON_MENIT = Number(process.env.BATAS_RESPON_MENIT) || 30;     // UC11 alt 2
const BATAS_IDLE_MENIT = Number(process.env.BATAS_IDLE_MENIT) || 15;         // UC12 alt 1
const STATUS_AKTIF = ['menunggu', 'terjadwal', 'berlangsung'];               // slot dianggap terisi

// kolom waktuPengajuan tidak ada di schema awal -> tambahkan sekali bila belum ada
const kolom = db.prepare('PRAGMA table_info(SesiKonsultasi)').all().map((k) => k.name);
if (!kolom.includes('waktuPengajuan')) {
  db.exec('ALTER TABLE SesiKonsultasi ADD COLUMN waktuPengajuan TEXT');
}

const sekarangIso = () => new Date().toISOString();

// "sekarang" dalam WIB, format yang sama dengan tanggalJadwal/waktuJadwal
function wibSekarang() {
  const p = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date()); // "2026-11-12 14:05"
  const [tanggal, waktu] = p.split(' ');
  return { tanggal, waktu };
}
exports.wibSekarang = wibSekarang;
exports.SLOT = SLOT;
exports.DURASI_MENIT = DURASI_MENIT;
exports.BATAS_RESPON_MENIT = BATAS_RESPON_MENIT;

const tambahJam = (hhmm) => String(Number(hhmm.slice(0, 2)) + 1).padStart(2, '0') + hhmm.slice(2);
exports.labelSlot = (hhmm) => `${hhmm.replace(':', '.')} - ${tambahJam(hhmm).replace(':', '.')}`;

// ---- housekeeping (dipanggil lazily saat halaman dibuka) ----

// UC11 alt 2: permintaan yang tidak ditanggapi melewati batas -> batal otomatis, slot lepas
exports.batalkanKedaluwarsa = () => {
  const batas = new Date(Date.now() - BATAS_RESPON_MENIT * 60000).toISOString();
  return db.prepare(
    `UPDATE SesiKonsultasi
        SET statusSesi = 'dibatalkan', catatanKonsul = 'Tidak ditanggapi mitra dalam batas waktu'
      WHERE statusSesi = 'menunggu' AND waktuPengajuan IS NOT NULL AND waktuPengajuan < ?`
  ).run(batas).changes;
};

// UC10

exports.cariMitraAktif = (idMitra) =>
  db.prepare(
    `SELECT idMitra, nama, namaFirma, deskripsi, tagKeahlian, rating, statusKetersediaan
       FROM MitraPengacara
      WHERE idMitra = ? AND statusVerifikasi = 'terverifikasi' AND statusAkun = 'aktif'`
  ).get(idMitra);

exports.kasusTerakhir = (idMasyarakat) =>
  db.prepare('SELECT * FROM Kasus WHERE idMasyarakat = ? ORDER BY idKasus DESC LIMIT 1').get(idMasyarakat);

exports.cariKasusMilik = (idKasus, idMasyarakat) =>
  db.prepare('SELECT * FROM Kasus WHERE idKasus = ? AND idMasyarakat = ?').get(idKasus, idMasyarakat);

// slot kosong mitra pada satu tanggal (validasiJadwal)
exports.slotTersedia = (idMitra, tanggal) => {
  const terisi = new Set(
    db.prepare(
      `SELECT waktuJadwal FROM SesiKonsultasi
        WHERE idMitra = ? AND tanggalJadwal = ? AND statusSesi IN (${STATUS_AKTIF.map(() => '?').join(',')})`
    ).all(idMitra, tanggal, ...STATUS_AKTIF).map((r) => r.waktuJadwal)
  );
  const { tanggal: hariIni, waktu: jamSkrg } = wibSekarang();
  if (tanggal < hariIni) return [];
  return SLOT.filter((s) => !terisi.has(s) && !(tanggal === hariIni && s <= jamSkrg));
};

// tanggal (YYYY-MM-DD) dalam satu bulan yang masih punya slot -> untuk menandai kalender
exports.tanggalAdaSlot = (idMitra, tahun, bulan) => {
  const hasil = [];
  const jumlahHari = new Date(tahun, bulan, 0).getDate();
  for (let d = 1; d <= jumlahHari; d++) {
    const t = `${tahun}-${String(bulan).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (exports.slotTersedia(idMitra, t).length) hasil.push(t);
  }
  return hasil;
};

// kunci slot + buat permintaan; atomik agar tidak terjadi dobel booking
const buat = db.transaction(({ idMasyarakat, idMitra, idKasus, tanggal, waktu }) => {
  if (!exports.slotTersedia(idMitra, tanggal).includes(waktu)) return null;
  const info = db.prepare(
    `INSERT INTO SesiKonsultasi
       (idMasyarakat, idMitra, idKasus, tanggalJadwal, waktuJadwal, statusSesi, waktuPengajuan)
     VALUES (?, ?, ?, ?, ?, 'menunggu', ?)`
  ).run(idMasyarakat, idMitra, idKasus || null, tanggal, waktu, sekarangIso());
  return info.lastInsertRowid;
});
exports.buat = buat;

// UC11

const SELECT_DETAIL = `
  SELECT s.*, m.nama AS namaMasyarakat, mt.nama AS namaMitra,
         k.judulKasus, k.kategoriMasalah, k.deskripsi AS deskripsiKasus
    FROM SesiKonsultasi s
    JOIN Masyarakat m ON m.idMasyarakat = s.idMasyarakat
    JOIN MitraPengacara mt ON mt.idMitra = s.idMitra
    LEFT JOIN Kasus k ON k.idKasus = s.idKasus`;

exports.cariById = (idSesi) => db.prepare(`${SELECT_DETAIL} WHERE s.idSesi = ?`).get(idSesi);

exports.daftarPengajuanMitra = (idMitra) =>
  db.prepare(`${SELECT_DETAIL} WHERE s.idMitra = ? ORDER BY (s.statusSesi = 'menunggu') DESC, s.idSesi DESC`).all(idMitra);

exports.daftarMasyarakat = (idMasyarakat) =>
  db.prepare(`${SELECT_DETAIL} WHERE s.idMasyarakat = ? ORDER BY s.idSesi DESC`).all(idMasyarakat);

// terima / tolak. Hanya sesi berstatus 'menunggu' yang bisa ditanggapi.
exports.tanggapi = (idSesi, idMitra, statusBaru, catatan) =>
  db.prepare(
    `UPDATE SesiKonsultasi SET statusSesi = ?, catatanKonsul = ?
      WHERE idSesi = ? AND idMitra = ? AND statusSesi = 'menunggu'`
  ).run(statusBaru, catatan || null, idSesi, idMitra).changes > 0;

// sisa waktu respon dalam detik (0 bila lewat)
exports.sisaDetikRespon = (sesi) => {
  if (!sesi.waktuPengajuan) return 0;
  const akhir = new Date(sesi.waktuPengajuan).getTime() + BATAS_RESPON_MENIT * 60000;
  return Math.max(0, Math.floor((akhir - Date.now()) / 1000));
};

// UC12

exports.sudahLunas = (sesi) => ['lunas', 'berhasil'].includes(String(sesi.statusPembayaran).toLowerCase());

exports.mulai = (idSesi) =>
  db.prepare(
    `UPDATE SesiKonsultasi SET statusSesi = 'berlangsung', waktuMulai = ?
      WHERE idSesi = ? AND statusSesi = 'terjadwal'`
  ).run(sekarangIso(), idSesi);

exports.akhiri = (idSesi) =>
  db.prepare(
    `UPDATE SesiKonsultasi SET statusSesi = 'selesai', waktuSelesai = ?
      WHERE idSesi = ? AND statusSesi IN ('terjadwal', 'berlangsung')`
  ).run(sekarangIso(), idSesi).changes > 0;

exports.ambilPesan = (idSesi) =>
  db.prepare(
    `SELECT idPesan, peranPengirim, idPengirim, isiPesan, waktuKirim
       FROM PesanChat WHERE idSesi = ? ORDER BY idPesan ASC`
  ).all(idSesi);

exports.simpanPesan = (idSesi, peran, idPengirim, isi) => {
  const info = db.prepare(
    `INSERT INTO PesanChat (idSesi, peranPengirim, idPengirim, isiPesan) VALUES (?, ?, ?, ?)`
  ).run(idSesi, peran, idPengirim, isi);
  return db.prepare('SELECT * FROM PesanChat WHERE idPesan = ?').get(info.lastInsertRowid);
};

exports.waktuAktivitasTerakhir = (sesi) => {
  const r = db.prepare("SELECT MAX(waktuKirim) AS t FROM PesanChat WHERE idSesi = ?").get(sesi.idSesi);
  // waktuKirim disimpan UTC oleh datetime('now') tanpa 'Z'
  if (r && r.t) return new Date(r.t.replace(' ', 'T') + 'Z').getTime();
  return sesi.waktuMulai ? new Date(sesi.waktuMulai).getTime() : Date.now();
};

// UC12 alt 1: tutup otomatis jika tidak ada aktivitas melewati batas maksimum
exports.tutupJikaIdle = (sesi) => {
  if (sesi.statusSesi !== 'berlangsung') return false;
  if (Date.now() - exports.waktuAktivitasTerakhir(sesi) < BATAS_IDLE_MENIT * 60000) return false;
  return exports.akhiri(sesi.idSesi);
};

// Aturan "kapan chat boleh dipakai" (dipakai controller dan socket agar konsisten).
// Mengembalikan { ok, pesan }. Aturan: sesi harus terjadwal/berlangsung, pembayaran lunas,
// dan waktu sekarang berada pada jadwal (dibuka 10 menit sebelum mulai, sampai 1 jam setelah selesai).
// Untuk demo/testing: BYPASS_PEMBAYARAN=true dan CEK_JADWAL_CHAT=false di .env
exports.izinChat = (sesi) => {
  if (sesi.statusSesi === 'selesai') return { ok: false, tutup: true, pesan: 'Sesi konsultasi ini sudah selesai.' };
  if (!['terjadwal', 'berlangsung'].includes(sesi.statusSesi)) {
    return { ok: false, pesan: 'Sesi belum dikonfirmasi mitra pengacara atau sudah dibatalkan.' };
  }
  if (process.env.BYPASS_PEMBAYARAN !== 'true' && !exports.sudahLunas(sesi)) {
    return { ok: false, perluBayar: true, pesan: 'Pembayaran sesi konsultasi belum lunas. Chat belum dapat dibuka.' };
  }
  if (process.env.CEK_JADWAL_CHAT !== 'false') {
    const { tanggal, waktu } = wibSekarang();
    const menit = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
    const awal = menit(sesi.waktuJadwal) - 10;
    const akhir = menit(sesi.waktuJadwal) + DURASI_MENIT + 60;
    const belumWaktunya = tanggal < sesi.tanggalJadwal || (tanggal === sesi.tanggalJadwal && menit(waktu) < awal);
    const lewat = tanggal > sesi.tanggalJadwal || (tanggal === sesi.tanggalJadwal && menit(waktu) > akhir);
    if (belumWaktunya) {
      return { ok: false, pesan: `Chat dibuka pada ${sesi.tanggalJadwal} pukul ${sesi.waktuJadwal.replace(':', '.')} WIB.` };
    }
    if (lewat) return { ok: false, pesan: 'Waktu sesi konsultasi sudah terlewat.' };
  }
  return { ok: true };
};