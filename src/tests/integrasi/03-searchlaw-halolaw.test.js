// Pengujian integrasi: SearchLaw dan HaloLaw (form kasus + daftar mitra).
// Antarmuka: I-05 (handler SearchLaw -> tabel Peraturan),
//            I-06 (KasusController/PencarianMitraController -> Kasus/MitraPengacara)
const request = require('supertest');
const { siapkanLingkungan, login } = require('./helpers/lingkungan');

let L;
let sisi;
beforeAll(async () => {
  L = await siapkanLingkungan();
  sisi = await login(L.url, 'sisi@lawhub.test', 'sisi947', '/login-masyarakat');
});
afterAll(async () => { await L.bersihkan(); });

describe('I-05 Handler SearchLaw -> tabel Peraturan', () => {
  test('INT-TC18 Normal: pencarian dengan kata kunci mengembalikan peraturan yang tersimpan di basis data', async () => {
    const target = L.db.prepare("SELECT * FROM Peraturan WHERE judul LIKE '%Pekerja Rumah Tangga%'").get();
    expect(target).toBeDefined();

    const res = await request(L.url).get('/searchlaw').query({ q: 'Pekerja Rumah Tangga' });
    expect(res.status).toBe(200);
    expect(res.text).toContain(target.judul);
    expect(res.text).toContain(`Nomor ${target.nomor} Tahun ${target.tahun}`);
  });

  test('INT-TC19 Gagal: kata kunci yang tidak cocok menampilkan pesan hasil kosong', async () => {
    const res = await request(L.url).get('/searchlaw').query({ q: 'zzqqxxkatakuncitidakada' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Belum ada peraturan yang cocok dengan pencarianmu.');
    expect(res.text).not.toContain('searchlaw-kartu"');
  });
});

describe('I-06 KasusController/PencarianMitraController -> Model Kasus/MitraPengacara', () => {
  let idKasus;

  test('INT-TC20 Normal: kasus tersimpan lalu daftar mitra difilter sesuai tag kasus', async () => {
    const res = await sisi.post('/halolaw').send({
      deskripsi: 'Saya dituduh melakukan pencurian oleh tetangga tanpa bukti.', tag: 'pidana',
    });
    expect(res.status).toBe(302);

    const kasus = L.db.prepare('SELECT * FROM Kasus ORDER BY idKasus DESC LIMIT 1').get();
    idKasus = kasus.idKasus;
    expect(kasus.kategoriMasalah).toBe('pidana');
    expect(res.headers.location).toBe(`/halolaw/mitra?kasus=${idKasus}`);

    const daftar = await sisi.get(`/halolaw/mitra?kasus=${idKasus}`);
    expect(daftar.status).toBe(200);
    expect(daftar.text).toContain('Budi Santoso, S.H.');            // tag pidana
    expect(daftar.text).not.toContain('Citra Lestari, S.H., M.H.');  // tag perdata,administrasi
  });

  test('INT-TC21 Gagal: deskripsi kasus kurang dari 10 karakter ditolak dan tidak tersimpan', async () => {
    const sebelum = L.db.prepare('SELECT COUNT(*) AS n FROM Kasus').get().n;
    const res = await sisi.post('/halolaw').send({ deskripsi: 'pendek', tag: 'pidana' });
    expect(res.status).toBe(400);
    expect(res.text).toContain('Deskripsi kasus minimal 10 karakter.');
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Kasus').get().n).toBe(sebelum);
  });

  test('INT-TC22 Gagal: filter yang tidak dipenuhi mitra mana pun menampilkan pesan kosong', async () => {
    const res = await sisi.get('/halolaw/mitra').query({ q: 'namayangtidakada', terapkan: '1' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Tidak ada mitra pengacara yang sesuai.');
  });
});
