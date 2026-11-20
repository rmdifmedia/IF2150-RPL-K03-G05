const { siapkanDbUnit, tanggalWib } = require('./helpers/dbUnit');

let U;
let SesiKonsultasi;
let idSisi;
let idBudi;

beforeAll(() => {
  U = siapkanDbUnit();
  SesiKonsultasi = require('../../models/SesiKonsultasi');
  idSisi = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  idBudi = U.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'budi'").get().idMitra;
});

afterAll(() => {
  U.bersihkan();
});

describe('C46 SesiKonsultasi (Mendalam)', () => {
  test('C46-UT01 Normal: slotTersedia mengembalikan slot kosong yang belum dipesan', () => {
    const tanggal = tanggalWib(3);
    const slotAwal = SesiKonsultasi.slotTersedia(idBudi, tanggal);
    expect(Array.isArray(slotAwal)).toBe(true);
    expect(slotAwal.length).toBeGreaterThan(0);

    const jamTarget = slotAwal[0];
    U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, ?, 'menunggu tanggapan mitra', 'belum bayar', ?)`
    ).run(idSisi, idBudi, tanggal, jamTarget, new Date().toISOString());

    const slotSisa = SesiKonsultasi.slotTersedia(idBudi, tanggal);
    expect(slotSisa).not.toContain(jamTarget);
  });

  test('C46-UT02 Batas: slotTersedia mengembalikan array kosong saat seluruh slot terisi', () => {
    const tanggal = tanggalWib(15);
    const semuaSlot = SesiKonsultasi.slotTersedia(idBudi, tanggal);
    for (const jam of semuaSlot) {
      U.db.prepare(
        `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
         VALUES (?, ?, ?, ?, 'terjadwal', 'lunas', ?)`
      ).run(idSisi, idBudi, tanggal, jam, new Date().toISOString());
    }
    expect(SesiKonsultasi.slotTersedia(idBudi, tanggal)).toEqual([]);
  });

  test('C46-UT03 Normal: buat dan tanggapi mengubah status sesi menjadi terjadwal', () => {
    const tgl = tanggalWib(20);
    U.db.prepare(
      'INSERT INTO JadwalKetersediaan (idMitra, tanggal, waktuMulai, waktuSelesai) VALUES (?, ?, ?, ?)'
    ).run(idBudi, tgl, '09:00', '12:00');

    const idSesi = SesiKonsultasi.buat({
      idMasyarakat: idSisi,
      idMitra: idBudi,
      tanggal: tgl,
      waktu: '10:00',
    });
    expect(idSesi).toBeTruthy();
    expect(SesiKonsultasi.cariById(idSesi).statusSesi).toBe('menunggu tanggapan mitra');

    SesiKonsultasi.tanggapi(idSesi, idBudi, 'terjadwal', null);
    expect(SesiKonsultasi.cariById(idSesi).statusSesi).toBe('terjadwal');
  });

  test('C46-UT04 Negatif: cekStatusPembayaran dan izinChat menolak sesi yang belum lunas', () => {
    const info = U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, '11:00', 'terjadwal', 'belum bayar', ?)`
    ).run(idSisi, idBudi, tanggalWib(21), new Date().toISOString());

    const sesi = SesiKonsultasi.cariById(info.lastInsertRowid);
    expect(SesiKonsultasi.cekStatusPembayaran(sesi)).toBe('Belum Lunas');
    expect(SesiKonsultasi.izinChat(sesi).ok).toBe(false);
  });

  test('C46-UT05 Normal: enkripsi, dekripsi, simpanPesan, dan ambilPesan menjaga kerahasiaan pesan', () => {
    const teksAsli = 'Konsultasi sengketa perjanjian kerja.';
    const cipher = SesiKonsultasi.enkripsi(teksAsli);
    expect(cipher.startsWith('enc:v1:')).toBe(true);
    expect(cipher).not.toContain(teksAsli);
    expect(SesiKonsultasi.dekripsi(cipher)).toBe(teksAsli);

    const info = U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, '14:00', 'berlangsung', 'lunas', ?)`
    ).run(idSisi, idBudi, tanggalWib(0), new Date().toISOString());
    const idSesi = info.lastInsertRowid;

    SesiKonsultasi.simpanPesan(idSesi, 'masyarakat', idSisi, teksAsli);
    const daftarPesan = SesiKonsultasi.ambilPesan(idSesi);
    expect(daftarPesan).toHaveLength(1);
    expect(daftarPesan[0].isiPesan).toBe(teksAsli);
  });

  test('C46-UT06 Batas: enkripsi dan dekripsi pesan tepat 1 karakter', () => {
    const cipher = SesiKonsultasi.enkripsi('A');
    expect(cipher.startsWith('enc:v1:')).toBe(true);
    expect(SesiKonsultasi.dekripsi(cipher)).toBe('A');
  });

  test('C46-UT07 Negatif: dekripsi menangani ciphertext rusak tanpa menghentikan proses', () => {
    expect(() => SesiKonsultasi.dekripsi('enc:v1:payload-rusak-tidak-valid')).not.toThrow();
  });

  test('C46-UT08 Normal: mulai dan akhiri mencatat waktuMulai dan waktuSelesai', () => {
    const info = U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, '13:00', 'terjadwal', 'lunas', ?)`
    ).run(idSisi, idBudi, tanggalWib(0), new Date().toISOString());
    const idSesi = info.lastInsertRowid;

    expect(SesiKonsultasi.mulai(idSesi)).toBe(true);
    const berjalan = SesiKonsultasi.cariById(idSesi);
    expect(berjalan.statusSesi).toBe('berlangsung');
    expect(berjalan.waktuMulai).not.toBeNull();

    expect(SesiKonsultasi.akhiri(idSesi)).toBe(true);
    const selesai = SesiKonsultasi.cariById(idSesi);
    expect(selesai.statusSesi).toBe('selesai');
    expect(selesai.waktuSelesai).not.toBeNull();
  });
});
