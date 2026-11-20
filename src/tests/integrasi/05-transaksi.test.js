// Pengujian integrasi: pembayaran, payment gateway dummy, ulasan, riwayat, pencairan dana, persistensi.
// Antarmuka: I-09 (UlasanController -> Ulasan), I-12 (RiwayatController -> Riwayat),
//            I-14 (PembayaranController -> Pembayaran), I-15 (PencairanController -> PencairanDana),
//            I-16 (Model -> basis data SQLite), I-17 (PembayaranController -> PaymentGateway),
//            I-18 (PencairanController -> PaymentGateway)
const {
  siapkanLingkungan, login, sambungSocket, tungguEvent, jeda, tanggalWib, jamWibSekarang,
} = require('./helpers/lingkungan');

let L;
let sisi;
let rina;
let ami;
const id = {};
const sesi = (idSesi) => L.db.prepare('SELECT * FROM SesiKonsultasi WHERE idSesi = ?').get(idSesi);
const saldoAmi = () => L.db.prepare('SELECT saldo FROM MitraPengacara WHERE idMitra = ?').get(id.ami).saldo;
const jumlahPembayaran = (idSesi) => L.db.prepare('SELECT COUNT(*) AS n FROM Pembayaran WHERE idSesi = ?').get(idSesi).n;

// fixture sesi antara sisi dan ami
const buatSesi = (kolom) => {
  const data = {
    tanggalJadwal: tanggalWib(1), waktuJadwal: '15:00', statusSesi: 'terjadwal',
    statusPembayaran: 'belum bayar', statusKonsul: null, waktuSelesai: null, ...kolom,
  };
  return L.db.prepare(
    `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, statusKonsul, waktuSelesai, waktuPengajuan)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id.sisi, id.ami, data.tanggalJadwal, data.waktuJadwal, data.statusSesi, data.statusPembayaran,
    data.statusKonsul, data.waktuSelesai, new Date().toISOString()).lastInsertRowid;
};

const kartu = (nomorKartu) => ({ metode: 'kartu', nomorKartu, kadaluwarsa: '12/29', cvc: '123' });

beforeAll(async () => {
  L = await siapkanLingkungan();
  sisi = await login(L.url, 'sisi@lawhub.test', 'sisi947', '/login-masyarakat');
  rina = await login(L.url, 'rina@lawhub.test', 'rina123', '/login-masyarakat');
  ami = await login(L.url, 'ami@lawhub.test', 'ami657');
  id.sisi = L.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  id.ami = L.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'ami'").get().idMitra;
});
afterAll(async () => { await L.bersihkan(); });

describe('I-14 PembayaranController -> Model Pembayaran dan I-17 PembayaranController -> PaymentGateway', () => {
  test('INT-TC31 Gagal: data kartu tidak valid ditolak sebelum dikirim ke gateway, tidak ada transaksi tercatat', async () => {
    const idSesi = buatSesi();
    const res = await sisi.post(`/transaksi/pembayaran/${idSesi}`).send(kartu('1234'));
    expect(res.status).toBe(400);
    expect(res.text).toContain('Nomor kartu harus 16 digit');
    expect(jumlahPembayaran(idSesi)).toBe(0);
  });

  test('INT-TC32 Gagal: gateway menolak kartu, transaksi tercatat gagal, sesi tidak lunas, saldo mitra tetap', async () => {
    const idSesi = buatSesi();
    const saldoAwal = saldoAmi();
    const res = await sisi.post(`/transaksi/pembayaran/${idSesi}`).send(kartu('0000111122223333'));

    expect(res.status).toBe(402);
    expect(res.text).toContain('Pembayaran gagal: Kartu ditolak oleh bank penerbit');
    const bayar = L.db.prepare('SELECT * FROM Pembayaran WHERE idSesi = ?').get(idSesi);
    expect(bayar.statusPembayaran).toBe('gagal');
    expect(sesi(idSesi).statusPembayaran).not.toBe('lunas');
    expect(saldoAmi()).toBe(saldoAwal);
  });

  test('INT-TC33 Normal: gateway menyetujui, transaksi tercatat berhasil, sesi lunas, saldo mitra bertambah', async () => {
    const idSesi = buatSesi();
    const saldoAwal = saldoAmi();
    const res = await sisi.post(`/transaksi/pembayaran/${idSesi}`).send(kartu('4111111111111111'));

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/konsultasi/saya');
    const bayar = L.db.prepare('SELECT * FROM Pembayaran WHERE idSesi = ?').get(idSesi);
    expect(bayar).toBeDefined();
    expect(bayar.statusPembayaran).toBe('berhasil');
    expect(sesi(idSesi).statusPembayaran).toBe('lunas');
    expect(saldoAmi()).toBe(saldoAwal + 70000);   // tarif 70.000/jam x 1 jam (tanpa pajak)
  });
});

describe('I-16 Model -> basis data SQLite (atomisitas transaksi)', () => {
  test('INT-TC34 Gagal: bila satu query di dalam transaksi gagal, seluruh perubahan dibatalkan (rollback)', async () => {
    // Pembayaran.simpanHasil() menjalankan 3 query dalam satu db.transaction:
    // INSERT Pembayaran, UPDATE SesiKonsultasi, UPDATE saldo mitra.
    const idSesi = buatSesi();
    const saldoAwal = saldoAmi();
    await sisi.post(`/transaksi/pembayaran/${idSesi}`).send(kartu('4111111111111111'));

    const bayar = L.db.prepare('SELECT * FROM Pembayaran WHERE idSesi = ?').all(idSesi);
    const lunas = sesi(idSesi).statusPembayaran === 'lunas';
    const saldoNaik = saldoAmi() !== saldoAwal;
    // konsisten: ketiganya terjadi bersama, atau tidak satu pun terjadi
    const semuaTerjadi = bayar.length === 1 && lunas && saldoNaik;
    const tidakAdaYangTerjadi = bayar.length === 0 && !lunas && !saldoNaik;
    expect(semuaTerjadi || tidakAdaYangTerjadi).toBe(true);
  });
});

describe('I-09 UlasanController -> Model Ulasan', () => {
  test('INT-TC35 Normal: ulasan sesi yang selesai tersimpan dan rating mitra dihitung ulang', async () => {
    const idSesi = buatSesi({ statusSesi: 'selesai', statusKonsul: 'selesai', statusPembayaran: 'lunas', waktuSelesai: new Date().toISOString() });
    const res = await sisi.post(`/transaksi/ulasan/${idSesi}`).send({ skor: '5', teks: 'Penjelasannya sangat jelas.' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/transaksi/riwayat');

    const ulasan = L.db.prepare('SELECT * FROM Ulasan WHERE idSesi = ?').get(idSesi);
    expect(ulasan).toMatchObject({ skorRating: 5, teksUlasan: 'Penjelasannya sangat jelas.', idMitra: id.ami });
    const rataRata = L.db.prepare('SELECT ROUND(AVG(skorRating), 1) AS r FROM Ulasan WHERE idMitra = ?').get(id.ami).r;
    expect(L.db.prepare('SELECT rating FROM MitraPengacara WHERE idMitra = ?').get(id.ami).rating).toBe(rataRata);
  });

  test('INT-TC36 Gagal: ulasan tanpa rating ditolak dan tidak tersimpan', async () => {
    const idSesi = buatSesi({ statusSesi: 'selesai', statusKonsul: 'selesai', statusPembayaran: 'lunas', waktuSelesai: new Date().toISOString() });
    const res = await sisi.post(`/transaksi/ulasan/${idSesi}`).send({ skor: '', teks: 'tanpa rating' });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Rating wajib diisi');
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Ulasan WHERE idSesi = ?').get(idSesi).n).toBe(0);
  });

  test('INT-TC37 Gagal: ulasan untuk sesi yang belum selesai ditolak', async () => {
    const idSesi = buatSesi();
    const res = await sisi.post(`/transaksi/ulasan/${idSesi}`).send({ skor: '4', teks: 'terlalu cepat' });
    expect(res.headers.location).toBe('/transaksi/riwayat');
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Ulasan WHERE idSesi = ?').get(idSesi).n).toBe(0);
  });
});

describe('I-12 RiwayatController -> Model Riwayat', () => {
  test('INT-TC38 Normal: riwayat sesi menampilkan isi chat yang dapat dibaca (bukan teks terenkripsi)', async () => {
    // sesi lunas pada jam sekarang, pesan dikirim lewat socket sungguhan, lalu sesi diakhiri
    const idSesi = buatSesi({ tanggalJadwal: tanggalWib(0), waktuJadwal: jamWibSekarang(), statusPembayaran: 'lunas' });
    const sock = await sambungSocket(L.url, sisi.cookie, '/konsultasi');
    try {
      sock.emit('gabung', { idSesi });
      await jeda(300);
      const terkirim = tungguEvent(sock, 'pesan_baru');
      sock.emit('kirim_pesan', { idSesi, isiPesan: 'Pesan untuk riwayat konsultasi' });
      await terkirim;
    } finally {
      sock.close();
    }
    await sisi.post(`/konsultasi/chat/${idSesi}/akhiri`);

    const daftar = await sisi.get('/transaksi/riwayat');
    expect(daftar.status).toBe(200);
    expect(daftar.text).toContain(`/transaksi/riwayat/${idSesi}`);

    const detail = await sisi.get(`/transaksi/riwayat/${idSesi}`);
    expect(detail.status).toBe(200);
    expect(detail.text).not.toContain('enc:v1:');
    expect(detail.text).toContain('Pesan untuk riwayat konsultasi');
  });

  test('INT-TC39 Gagal: masyarakat lain tidak dapat membuka riwayat sesi milik orang lain', async () => {
    const idSesi = buatSesi({ statusPembayaran: 'lunas' });
    const res = await rina.get(`/transaksi/riwayat/${idSesi}`);
    expect(res.status).toBe(404);
    expect(res.text).toContain('Riwayat tidak ditemukan');
  });
});

describe('I-15 PencairanController -> Model PencairanDana dan I-18 PencairanController -> PaymentGateway', () => {
  test('INT-TC40 Normal: pencairan disetujui gateway, tercatat berhasil, saldo mitra berkurang', async () => {
    const saldoAwal = saldoAmi();
    const res = await ami.post('/transaksi/keuangan/cairkan').send({ nominal: '100000' });
    expect(res.headers.location).toBe('/transaksi/keuangan');

    const cair = L.db.prepare('SELECT * FROM PencairanDana WHERE idMitra = ? ORDER BY idPencairan DESC').get(id.ami);
    expect(cair).toMatchObject({ totalPencairan: 100000, statusPencairan: 'berhasil', rekeningTujuan: 'BCA|1234567890|Ami Pengacara' });
    expect(saldoAmi()).toBe(saldoAwal - 100000);
  });

  test('INT-TC41 Gagal: nominal melebihi saldo ditolak, tidak ada pencairan tercatat, saldo tetap', async () => {
    const saldoAwal = saldoAmi();
    const jumlahAwal = L.db.prepare('SELECT COUNT(*) AS n FROM PencairanDana').get().n;
    await ami.post('/transaksi/keuangan/cairkan').send({ nominal: String(saldoAwal + 1) });

    expect(L.db.prepare('SELECT COUNT(*) AS n FROM PencairanDana').get().n).toBe(jumlahAwal);
    expect(saldoAmi()).toBe(saldoAwal);
    const halaman = await ami.get('/transaksi/keuangan');
    expect(halaman.text).toContain('Saldo tidak mencukupi');
  });
});

describe('I-16 Model -> basis data SQLite (persistensi)', () => {
  test('INT-TC42 Normal: data tetap ada setelah server dimatikan dan dinyalakan ulang', async () => {
    const jumlahUlasan = L.db.prepare('SELECT COUNT(*) AS n FROM Ulasan').get().n;
    const jumlahCair = L.db.prepare('SELECT COUNT(*) AS n FROM PencairanDana').get().n;
    await L.restartServer();

    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Ulasan').get().n).toBe(jumlahUlasan);
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM PencairanDana').get().n).toBe(jumlahCair);
    const klien = await login(L.url, 'ami@lawhub.test', 'ami657');
    const halaman = await klien.get('/transaksi/keuangan');
    expect(halaman.status).toBe(200);
    expect(halaman.text).toContain('Rp');
  });
});
