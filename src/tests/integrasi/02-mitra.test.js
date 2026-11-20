// Pengujian integrasi: verifikasi mitra oleh admin, profil, jadwal, dan dokumen legalitas mitra.
// Antarmuka: I-03 (VerifikasiMitraController -> verifikasiMitra),
//            I-04 (ProfilMitraController -> MitraPengacara/JadwalKetersediaan/DokumenLegalitas),
//            I-21 (multer -> folder uploads/)
const fs = require('fs');
const path = require('path');
const { siapkanLingkungan, login, tanggalWib, FOLDER_UPLOAD, berkasPdf, berkasTeks } = require('./helpers/lingkungan');

let L;
let admin;
let ami;
const idMitra = (username) => L.db.prepare('SELECT idMitra FROM MitraPengacara WHERE username = ?').get(username).idMitra;
const mitra = (username) => L.db.prepare('SELECT * FROM MitraPengacara WHERE username = ?').get(username);

beforeAll(async () => {
  L = await siapkanLingkungan();
  admin = await login(L.url, 'admin@lawhub.test', 'admin123');
  ami = await login(L.url, 'ami@lawhub.test', 'ami657');

  // fixture: mitra "dimas" dibuat berstatus menunggu dengan satu dokumen belum tervalidasi
  const id = idMitra('dimas');
  L.db.prepare("UPDATE MitraPengacara SET statusVerifikasi = 'menunggu' WHERE idMitra = ?").run(id);
  L.db.prepare("INSERT INTO DokumenLegalitas (idMitra, jenisDokumen, namaBerkas, lokasiBerkas, validitas) VALUES (?, 'kta', 'kta.pdf', 'tidak-ada.pdf', 0)").run(id);
});
afterAll(async () => { await L.bersihkan(); });

describe('I-03 VerifikasiMitraController -> Model verifikasiMitra', () => {
  test('INT-TC10 Gagal: penolakan tanpa catatan ditolak sistem, status mitra tidak berubah', async () => {
    const res = await admin.post(`/admin/verifikasi/${idMitra('dimas')}`).send({ keputusan: 'tolak', catatan: '' });
    expect(res.status).toBe(302);
    expect(mitra('dimas').statusVerifikasi).toBe('menunggu');
  });

  test('INT-TC11 Normal: admin memverifikasi mitra, status akun dan validitas dokumen diperbarui', async () => {
    const id = idMitra('dimas');
    const res = await admin.post(`/admin/verifikasi/${id}`).send({ keputusan: 'verifikasi', catatan: '' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/admin/verifikasi');

    expect(mitra('dimas').statusVerifikasi).toBe('terverifikasi');
    const dok = L.db.prepare('SELECT validitas FROM DokumenLegalitas WHERE idMitra = ?').all(id);
    expect(dok.every((d) => d.validitas === 1)).toBe(true);
  });
});

describe('I-04 ProfilMitraController -> Model MitraPengacara/JadwalKetersediaan/DokumenLegalitas', () => {
  test('INT-TC12 Normal: mitra mengubah profil, data tersimpan di tabel MitraPengacara', async () => {
    const res = await ami.post('/mitra/profil/edit').send({
      namaFirma: 'Firma Ami Baru', deskripsi: 'Spesialis sengketa pidana umum.', tagKeahlian: 'pidana',
    });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/mitra/profil');

    const baris = mitra('ami');
    expect(baris.namaFirma).toBe('Firma Ami Baru');
    expect(baris.deskripsi).toBe('Spesialis sengketa pidana umum.');
    expect(baris.tagKeahlian).toBe('pidana');
  });

  test('INT-TC13 Gagal: profil dengan deskripsi kosong ditolak, data lama tidak berubah', async () => {
    const res = await ami.post('/mitra/profil/edit').send({ namaFirma: 'Harus Tidak Tersimpan', deskripsi: '   ', tagKeahlian: 'perdata' });
    expect(res.headers.location).toBe('/mitra/profil/edit');

    const baris = mitra('ami');
    expect(baris.namaFirma).toBe('Firma Ami Baru');
    expect(baris.tagKeahlian).toBe('pidana');
  });

  test('INT-TC14 Normal: mitra menambah slot jadwal, baris baru tersimpan di JadwalKetersediaan', async () => {
    const tanggal = tanggalWib(40);
    const res = await ami.post('/mitra/jadwal').send({ tanggal, waktuMulai: '08:00', waktuSelesai: '10:00' });
    expect(res.status).toBe(302);

    const slot = L.db.prepare('SELECT * FROM JadwalKetersediaan WHERE idMitra = ? AND tanggal = ?').all(idMitra('ami'), tanggal);
    expect(slot).toHaveLength(1);
    expect(slot[0]).toMatchObject({ waktuMulai: '08:00', waktuSelesai: '10:00' });
  });

  test('INT-TC15 Gagal: slot yang bertumpuk dengan slot lain ditolak, tidak ada baris baru', async () => {
    const tanggal = tanggalWib(40);
    await ami.post('/mitra/jadwal').send({ tanggal, waktuMulai: '09:00', waktuSelesai: '11:00' });

    const slot = L.db.prepare('SELECT * FROM JadwalKetersediaan WHERE idMitra = ? AND tanggal = ?').all(idMitra('ami'), tanggal);
    expect(slot).toHaveLength(1);
    const halaman = await ami.get(`/mitra/profil?tanggal=${tanggal}`);
    expect(halaman.text).toContain('Jam tersebut bertumpuk dengan slot lain.');
  });

  test('INT-TC16 Normal: unggah dokumen legalitas tersimpan (basis data dan berkas) dan status kembali menunggu', async () => {
    const b = berkasPdf('sipa-baru.pdf');
    const res = await ami.postBerkas('/mitra/dokumen').attach('sipa', b.buffer, b.opsi);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/mitra/profil');

    const dok = L.db.prepare("SELECT * FROM DokumenLegalitas WHERE idMitra = ? AND jenisDokumen = 'sipa'").get(idMitra('ami'));
    expect(dok).toBeDefined();
    expect(dok.validitas).toBe(0);
    expect(fs.existsSync(path.join(FOLDER_UPLOAD, dok.lokasiBerkas))).toBe(true);   // I-21
    expect(mitra('ami').statusVerifikasi).toBe('menunggu');                          // ditinjau ulang admin
  });

  test('INT-TC17 Gagal: unggah dokumen berformat .txt ditolak, tidak tersimpan, berkas dihapus', async () => {
    const isiAwal = new Set(fs.readdirSync(FOLDER_UPLOAD));
    const sebelum = L.db.prepare('SELECT COUNT(*) AS n FROM DokumenLegalitas').get().n;

    const b = berkasTeks('ktp.txt');
    const res = await ami.postBerkas('/mitra/dokumen').attach('ktp', b.buffer, b.opsi);
    expect(res.headers.location).toBe('/mitra/dokumen');

    expect(L.db.prepare('SELECT COUNT(*) AS n FROM DokumenLegalitas').get().n).toBe(sebelum);
    await new Promise((r) => setTimeout(r, 200));
    expect(fs.readdirSync(FOLDER_UPLOAD).filter((n) => !isiAwal.has(n))).toEqual([]);

    const halaman = await ami.get('/mitra/dokumen');
    expect(halaman.text).toContain('Format dokumen tidak didukung.');
  });
});

describe('I-23 StatusRegistrasiController -> Model MitraPengacara/DokumenLegalitas', () => {
  test('INT-TC54 Normal: cek status verifikasi dengan username menampilkan status dari basis data', async () => {
    // setelah INT-TC16, status ami di basis data adalah "menunggu"
    expect(mitra('ami').statusVerifikasi).toBe('menunggu');
    const res = await require('supertest')(L.url).get('/status-verifikasi').query({ username: 'ami' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Admin sedang memeriksa dokumenmu');
    expect(res.text).toContain('Hasil verifikasi belum tersedia.');
  });

  test('INT-TC55 Gagal: username mitra yang tidak terdaftar ditolak dengan pesan', async () => {
    const res = await require('supertest')(L.url).get('/status-verifikasi').query({ username: 'tidak_ada' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    const cookie = (res.headers['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ');
    const halaman = await require('supertest')(L.url).get('/login').set('Cookie', cookie);
    expect(halaman.text).toContain('Username mitra tidak ditemukan.');
  });
});

describe('I-24 BerandaMitraController -> Model DashboardMitra', () => {
  test('INT-TC56 Normal: dashboard mitra menampilkan ringkasan yang sesuai dengan basis data', async () => {
    const id = idMitra('ami');
    const menunggu = L.db.prepare("SELECT COUNT(*) AS n FROM SesiKonsultasi WHERE idMitra = ? AND LOWER(statusSesi) LIKE 'menunggu%'").get(id).n;
    const saldo = mitra('ami').saldo;
    expect(menunggu).toBeGreaterThan(0);

    const res = await ami.get('/mitra');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Halo, Ami Pengacara!');
    expect(res.text).toContain(`<strong>${menunggu}</strong><span>Permintaan menunggu</span>`);
    expect(res.text).toContain('Rp ' + new Intl.NumberFormat('id-ID').format(saldo));
  });

  test('INT-TC57 Gagal: akun masyarakat tidak dapat membuka dashboard mitra', async () => {
    const sisi = await login(L.url, 'sisi@lawhub.test', 'sisi947', '/login-masyarakat');
    const res = await sisi.get('/mitra');
    expect(res.status).toBe(403);
    expect(res.text).toContain('Akses ditolak');
  });
});
