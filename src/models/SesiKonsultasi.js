// C46 SesiKonsultasi (UC10, UC11, UC12)
const db = require('../db/database');

// konstanta
// Slot konsultasi tetap per hari (UI-08). Ubah di sini jika jam praktik berubah.
const SLOT = ['14:00', '15:00', '16:00', '17:00', '18:00'];
const DURASI_MENIT = 60;
const BATAS_RESPON_MENIT = Number(process.env.BATAS_RESPON_MENIT) || 30;     // UC11 alt 2
const BATAS_IDLE_MENIT = Number(process.env.BATAS_IDLE_MENIT) || 15;         // UC12 alt 1
const MENUNGGU = 'menunggu tanggapan mitra';                                 // nilai sesuai SKPL/DPPL
const STATUS_AKTIF = [MENUNGGU, 'terjadwal', 'berlangsung'];                 // slot dianggap terisi
exports.MENUNGGU = MENUNGGU;


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
      WHERE statusSesi = '${MENUNGGU}' AND waktuPengajuan IS NOT NULL AND waktuPengajuan < ?`
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

// slot per jam yang dibuka mitra lewat JadwalKetersediaan (mis. 14:00-17:00 -> 14:00, 15:00, 16:00)
function slotDariJadwal(idMitra, tanggal) {
  const hasil = new Set();
  db.prepare('SELECT waktuMulai, waktuSelesai FROM JadwalKetersediaan WHERE idMitra = ? AND tanggal = ?')
    .all(idMitra, tanggal).forEach(({ waktuMulai, waktuSelesai }) => {
      for (let j = parseInt(waktuMulai, 10); j < parseInt(waktuSelesai, 10); j++) {
        hasil.add(`${String(j).padStart(2, '0')}:00`);
      }
    });
  return [...hasil].sort();
}

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
  return slotDariJadwal(idMitra, tanggal).filter((s) => !terisi.has(s) && !(tanggal === hariIni && s <= jamSkrg));
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
     VALUES (?, ?, ?, ?, ?, '${MENUNGGU}', ?)`
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
  db.prepare(`${SELECT_DETAIL} WHERE s.idMitra = ? ORDER BY (s.statusSesi = '${MENUNGGU}') DESC, s.idSesi DESC`).all(idMitra);

exports.daftarMasyarakat = (idMasyarakat) =>
  db.prepare(`${SELECT_DETAIL} WHERE s.idMasyarakat = ? ORDER BY s.idSesi DESC`).all(idMasyarakat);

// terima / tolak. Hanya sesi berstatus 'menunggu' yang bisa ditanggapi.
exports.tanggapi = (idSesi, idMitra, statusBaru, catatan) =>
  db.prepare(
    `UPDATE SesiKonsultasi SET statusSesi = ?, catatanKonsul = ?
      WHERE idSesi = ? AND idMitra = ? AND statusSesi = '${MENUNGGU}'`
  ).run(statusBaru, catatan || null, idSesi, idMitra).changes > 0;

// sisa waktu respon dalam detik (0 bila lewat)
exports.sisaDetikRespon = (sesi) => {
  if (!sesi.waktuPengajuan) return 0;
  const akhir = new Date(sesi.waktuPengajuan).getTime() + BATAS_RESPON_MENIT * 60000;
  return Math.max(0, Math.floor((akhir - Date.now()) / 1000));
};

// UC12

// C49 cekStatusPembayaran: mengembalikan 'Lunas' atau 'Belum Lunas' (nilai 'berhasil' dari modul pembayaran dianggap lunas)
exports.cekStatusPembayaran = (sesi) =>
  ['lunas', 'berhasil'].includes(String(sesi.statusPembayaran).toLowerCase()) ? 'Lunas' : 'Belum Lunas';
exports.cekStatusLunas = exports.cekStatusPembayaran;              // nama lain di SKPL
exports.sudahLunas = (sesi) => exports.cekStatusPembayaran(sesi) === 'Lunas';

// catatWaktuMulaiSelesai(jenis): 'mulai' | 'selesai'  (Algo-046-5/7)
exports.catatWaktuMulaiSelesai = (idSesi, jenis) => {
  const kolom = jenis === 'mulai' ? 'waktuMulai' : 'waktuSelesai';
  db.prepare(`UPDATE SesiKonsultasi SET ${kolom} = ? WHERE idSesi = ?`).run(sekarangIso(), idSesi);
};

// mulaiSesi(): dipanggil pada PESAN PERTAMA, hanya bila lunas -> statusKonsul & statusSesi = 'berlangsung'
exports.mulai = (idSesi) => {
  const sesi = exports.cariById(idSesi);
  if (!sesi || sesi.statusSesi !== 'terjadwal') return false;
  if (process.env.BYPASS_PEMBAYARAN !== 'true' && !exports.sudahLunas(sesi)) return false;
  exports.catatWaktuMulaiSelesai(idSesi, 'mulai');
  db.prepare(`UPDATE SesiKonsultasi SET statusSesi = 'berlangsung', statusKonsul = 'berlangsung' WHERE idSesi = ?`).run(idSesi);
  return true;
};

// akhiriSesi(): statusKonsul & statusSesi = 'selesai'
exports.akhiri = (idSesi) => {
  const info = db.prepare(
    `UPDATE SesiKonsultasi SET statusSesi = 'selesai', statusKonsul = 'selesai'
      WHERE idSesi = ? AND statusSesi IN ('terjadwal', 'berlangsung')`
  ).run(idSesi);
  if (info.changes > 0) exports.catatWaktuMulaiSelesai(idSesi, 'selesai');
  return info.changes > 0;
};

// ---- KNF10: payload pesan dienkripsi sebelum disimpan (AES-256-GCM, kunci dari CHAT_KEY/SESSION_SECRET) ----
const crypto = require('crypto');
let kunci;
const ambilKunci = () => kunci || (kunci = crypto.scryptSync(process.env.CHAT_KEY || process.env.SESSION_SECRET || 'lawhub-dev', 'lawhub-chat', 32));
const PREFIX = 'enc:v1:';
const enkripsi = (teks) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', ambilKunci(), iv);
  const isi = Buffer.concat([c.update(teks, 'utf8'), c.final()]);
  return PREFIX + [iv, c.getAuthTag(), isi].map((b) => b.toString('base64')).join(':');
};
const dekripsi = (teks) => {
  if (typeof teks !== 'string' || !teks.startsWith(PREFIX)) return teks;       // pesan lama / bukan terenkripsi
  try {
    const [iv, tag, isi] = teks.slice(PREFIX.length).split(':').map((x) => Buffer.from(x, 'base64'));
    const d = crypto.createDecipheriv('aes-256-gcm', ambilKunci(), iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(isi), d.final()]).toString('utf8');
  } catch (e) { return '[pesan tidak dapat dibaca]'; }
};
exports.enkripsi = enkripsi;
exports.dekripsi = dekripsi;

exports.ambilPesan = (idSesi) =>
  db.prepare(
    `SELECT idPesan, peranPengirim, idPengirim, isiPesan, waktuKirim
       FROM PesanChat WHERE idSesi = ? ORDER BY idPesan ASC`
  ).all(idSesi).map((p) => ({ ...p, isiPesan: dekripsi(p.isiPesan) }));

exports.simpanPesan = (idSesi, peran, idPengirim, isi) => {
  const info = db.prepare(
    `INSERT INTO PesanChat (idSesi, peranPengirim, idPengirim, isiPesan) VALUES (?, ?, ?, ?)`
  ).run(idSesi, peran, idPengirim, enkripsi(isi));
  const p = db.prepare('SELECT * FROM PesanChat WHERE idPesan = ?').get(info.lastInsertRowid);
  return { ...p, isiPesan: isi };                                             // ke klien dikirim plaintext lewat socket
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

// UC12 alt 1 (otomatis di server): tutup semua sesi berlangsung yang idle; kembalikan id yang ditutup
exports.tutupIdleSemua = () => {
  const ids = db.prepare("SELECT idSesi FROM SesiKonsultasi WHERE statusSesi = 'berlangsung'").all();
  return ids.map((r) => r.idSesi).filter((id) => exports.tutupJikaIdle(exports.cariById(id)));
};