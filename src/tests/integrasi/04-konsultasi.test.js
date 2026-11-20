// Pengujian integrasi: penjadwalan, tanggapan mitra, dan chat konsultasi real-time.
// Antarmuka: I-07 (PenjadwalanKonsultasiController -> SesiKonsultasi),
//            I-08 (SesiKonsultasiController -> SesiKonsultasi),
//            I-19 (klien Socket.IO -> socket/konsultasi.js -> SesiKonsultasi/PesanChat)
const {
  siapkanLingkungan, login, sambungSocket, tungguEvent, jeda, tanggalWib, jamWibSekarang,
} = require('./helpers/lingkungan');

let L;
let sisi;
let rina;
let budi;
const id = {};
const sesi = (idSesi) => L.db.prepare('SELECT * FROM SesiKonsultasi WHERE idSesi = ?').get(idSesi);

beforeAll(async () => {
  L = await siapkanLingkungan();
  sisi = await login(L.url, 'sisi@lawhub.test', 'sisi947', '/login-masyarakat');
  rina = await login(L.url, 'rina@lawhub.test', 'rina123', '/login-masyarakat');
  budi = await login(L.url, 'budi@lawhub.test', 'budi123');
  id.sisi = L.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  id.budi = L.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'budi'").get().idMitra;
});
afterAll(async () => { await L.bersihkan(); });

describe('I-07 PenjadwalanKonsultasiController -> Model SesiKonsultasi', () => {
  const tanggal = tanggalWib(3);

  test('INT-TC23 Normal: memilih slot kosong membuat sesi berstatus menunggu tanggapan mitra', async () => {
    const slotAwal = await sisi.get(`/konsultasi/jadwal/${id.budi}/slot?tanggal=${tanggal}`);
    expect(slotAwal.body.slot.map((s) => s.waktu)).toContain('14:00');

    const res = await sisi.post(`/konsultasi/jadwal/${id.budi}`).send({ tanggal, waktu: '14:00' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/konsultasi/saya');

    const baris = L.db.prepare('SELECT * FROM SesiKonsultasi WHERE idMitra = ? AND tanggalJadwal = ? AND waktuJadwal = ?')
      .get(id.budi, tanggal, '14:00');
    expect(baris.statusSesi).toBe('menunggu tanggapan mitra');
    expect(baris.idMasyarakat).toBe(id.sisi);
    id.sesiBaru = baris.idSesi;

    // slot yang sudah dipesan tidak lagi ditawarkan
    const slotAkhir = await sisi.get(`/konsultasi/jadwal/${id.budi}/slot?tanggal=${tanggal}`);
    expect(slotAkhir.body.slot.map((s) => s.waktu)).not.toContain('14:00');
  });

  test('INT-TC24 Gagal: slot yang sudah dipesan orang lain ditolak (tidak terjadi dobel booking)', async () => {
    const res = await rina.post(`/konsultasi/jadwal/${id.budi}`).send({ tanggal, waktu: '14:00' });
    expect(res.headers.location).toBe(`/konsultasi/jadwal/${id.budi}`);

    const jumlah = L.db.prepare('SELECT COUNT(*) AS n FROM SesiKonsultasi WHERE idMitra = ? AND tanggalJadwal = ? AND waktuJadwal = ?')
      .get(id.budi, tanggal, '14:00').n;
    expect(jumlah).toBe(1);
  });
});

describe('I-08 SesiKonsultasiController -> Model SesiKonsultasi', () => {
  test('INT-TC25 Gagal: penolakan tanpa catatan ditolak sistem, status sesi tidak berubah', async () => {
    const res = await budi.post(`/konsultasi/konfirmasi/${id.sesiBaru}`).send({ aksi: 'tolak', catatan: '' });
    expect(res.headers.location).toBe(`/konsultasi/konfirmasi/${id.sesiBaru}`);
    expect(sesi(id.sesiBaru).statusSesi).toBe('menunggu tanggapan mitra');
  });

  test('INT-TC26 Normal: mitra menerima permintaan, status sesi menjadi terjadwal', async () => {
    const res = await budi.post(`/konsultasi/konfirmasi/${id.sesiBaru}`).send({ aksi: 'terima', catatan: '' });
    expect(res.headers.location).toBe('/konsultasi/pengajuan');
    expect(sesi(id.sesiBaru).statusSesi).toBe('terjadwal');
  });

  test('INT-TC27 Gagal: permintaan yang sudah ditanggapi tidak bisa ditanggapi ulang', async () => {
    await budi.post(`/konsultasi/konfirmasi/${id.sesiBaru}`).send({ aksi: 'tolak', catatan: 'berubah pikiran' });
    expect(sesi(id.sesiBaru).statusSesi).toBe('terjadwal');
  });
});

describe('I-19 Klien Socket.IO -> socket/konsultasi.js -> SesiKonsultasi/PesanChat', () => {
  const buatSesiFixture = (statusPembayaran) => L.db.prepare(
    `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
     VALUES (?, ?, ?, ?, 'terjadwal', ?, ?)`
  ).run(id.sisi, id.budi, tanggalWib(0), jamWibSekarang(), statusPembayaran, new Date().toISOString()).lastInsertRowid;

  test('INT-TC28 Normal: pesan terkirim real-time ke mitra dan tersimpan terenkripsi di basis data', async () => {
    const idSesi = buatSesiFixture('lunas');
    const sockMasy = await sambungSocket(L.url, sisi.cookie, '/konsultasi');
    const sockMitra = await sambungSocket(L.url, budi.cookie, '/konsultasi');
    try {
      sockMasy.emit('gabung', { idSesi });
      sockMitra.emit('gabung', { idSesi });
      await jeda(300);

      const diterima = tungguEvent(sockMitra, 'pesan_baru');
      sockMasy.emit('kirim_pesan', { idSesi, isiPesan: 'Halo, saya ingin konsultasi.' });
      const pesan = await diterima;
      expect(pesan.isiPesan).toBe('Halo, saya ingin konsultasi.');

      const baris = L.db.prepare('SELECT * FROM PesanChat WHERE idSesi = ?').get(idSesi);
      expect(baris.peranPengirim).toBe('masyarakat');
      expect(baris.isiPesan.startsWith('enc:v1:')).toBe(true);           // tersimpan terenkripsi
      expect(baris.isiPesan).not.toContain('Halo, saya ingin konsultasi.');
      expect(sesi(idSesi).statusSesi).toBe('berlangsung');               // waktu mulai tercatat
      expect(sesi(idSesi).waktuMulai).not.toBeNull();
    } finally {
      sockMasy.close();
      sockMitra.close();
    }
  });

  test('INT-TC29 Gagal: sesi yang belum lunas tidak bisa membuka chat dan pesan tidak tersimpan', async () => {
    const idSesi = buatSesiFixture('belum bayar');
    const sock = await sambungSocket(L.url, sisi.cookie, '/konsultasi');
    try {
      const galat = tungguEvent(sock, 'pesan_error');
      sock.emit('gabung', { idSesi });
      expect(await galat).toContain('Pembayaran sesi konsultasi belum lunas');

      const galat2 = tungguEvent(sock, 'pesan_error');
      sock.emit('kirim_pesan', { idSesi, isiPesan: 'coba kirim' });
      await galat2;
      expect(L.db.prepare('SELECT COUNT(*) AS n FROM PesanChat WHERE idSesi = ?').get(idSesi).n).toBe(0);
    } finally {
      sock.close();
    }
  });

  test('INT-TC30 Gagal: koneksi socket tanpa login ditolak', async () => {
    await expect(sambungSocket(L.url, '', '/konsultasi')).rejects.toThrow('Harus login');
  });
});
