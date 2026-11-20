// Pengujian integrasi: registrasi, login, dan middleware hak akses.
// Antarmuka: I-01 (RegistrasiController -> Masyarakat/MitraPengacara/DokumenLegalitas),
//            I-02 (AuthController -> Akun), I-21 (multer -> folder uploads/),
//            I-22 (middleware auth -> basis data)
const fs = require('fs');
const path = require('path');
const { siapkanLingkungan, login, FOLDER_UPLOAD, berkasPdf } = require('./helpers/lingkungan');

let L;
beforeAll(async () => { L = await siapkanLingkungan(); });
afterAll(async () => { await L.bersihkan(); });

describe('I-01 RegistrasiController -> Model Masyarakat/MitraPengacara/DokumenLegalitas', () => {
  test('INT-TC01 Normal: registrasi masyarakat tersimpan di basis data dengan sandi ter-hash', async () => {
    const res = await require('supertest')(L.url).post('/registrasi-masyarakat').type('form').send({
      nama: 'Uji Integrasi', username: 'uji_int', noHp: '81234567890',
      email: 'uji.int@lawhub.test', kataSandi: 'rahasia123', konfirmasi: 'rahasia123',
    });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login-masyarakat');

    const baris = L.db.prepare('SELECT * FROM Masyarakat WHERE email = ?').get('uji.int@lawhub.test');
    expect(baris).toBeDefined();
    expect(baris.username).toBe('uji_int');
    expect(baris.nohp).toBe('+6281234567890');
    expect(baris.sandi).not.toBe('rahasia123');      // tidak disimpan sebagai teks biasa
    expect(baris.sandi.startsWith('$2')).toBe(true);  // format hash bcrypt
  });

  test('INT-TC02 Gagal: registrasi dengan email yang sudah terdaftar ditolak dan tidak menambah baris', async () => {
    const sebelum = L.db.prepare('SELECT COUNT(*) AS n FROM Masyarakat').get().n;
    const res = await require('supertest')(L.url).post('/registrasi-masyarakat').type('form').send({
      nama: 'Duplikat', username: 'duplikat01', noHp: '81200000000',
      email: 'sisi@lawhub.test', kataSandi: 'rahasia123', konfirmasi: 'rahasia123',
    });

    expect(res.status).toBe(400);
    expect(res.text).toContain('Email sudah terdaftar');
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Masyarakat').get().n).toBe(sebelum);
  });

  test('INT-TC03 Normal: registrasi mitra menyimpan akun berstatus menunggu, 4 dokumen, dan berkasnya', async () => {
    const req = require('supertest')(L.url).post('/registrasi-mitra')
      .field('nama', 'Mitra Uji Integrasi').field('email', 'mitra.int@lawhub.test')
      .field('username', 'mitra_int').field('kataSandi', 'rahasia123').field('konfirmasi', 'rahasia123')
      .field('namaFirma', 'Firma Uji');
    for (const jenis of ['ijazah', 'kta', 'sipa', 'bas']) {
      const b = berkasPdf(`${jenis}.pdf`);
      req.attach(jenis, b.buffer, b.opsi);
    }
    const res = await req;

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');

    const mitra = L.db.prepare('SELECT * FROM MitraPengacara WHERE email = ?').get('mitra.int@lawhub.test');
    expect(mitra.statusVerifikasi).toBe('menunggu');

    const dokumen = L.db.prepare('SELECT * FROM DokumenLegalitas WHERE idMitra = ?').all(mitra.idMitra);
    expect(dokumen.map((d) => d.jenisDokumen).sort()).toEqual(['bas', 'ijazah', 'kta', 'sipa']);
    // I-21: berkas fisik benar-benar ada di folder uploads/
    for (const d of dokumen) {
      expect(fs.existsSync(path.join(FOLDER_UPLOAD, d.lokasiBerkas))).toBe(true);
    }
  });

  test('INT-TC04 Gagal: registrasi mitra tanpa dokumen BAS ditolak, tidak ada akun, berkas unggahan dihapus', async () => {
    const isiAwal = new Set(fs.readdirSync(FOLDER_UPLOAD));
    const req = require('supertest')(L.url).post('/registrasi-mitra')
      .field('nama', 'Mitra Tanpa BAS').field('email', 'tanpa.bas@lawhub.test')
      .field('username', 'tanpa_bas').field('kataSandi', 'rahasia123').field('konfirmasi', 'rahasia123')
      .field('namaFirma', 'Firma Uji');
    for (const jenis of ['ijazah', 'kta', 'sipa']) {
      const b = berkasPdf(`${jenis}.pdf`);
      req.attach(jenis, b.buffer, b.opsi);
    }
    const res = await req;

    expect(res.status).toBe(400);
    expect(res.text).toContain('Dokumen BAS wajib diunggah');
    expect(L.db.prepare('SELECT 1 FROM MitraPengacara WHERE email = ?').get('tanpa.bas@lawhub.test')).toBeUndefined();

    await new Promise((r) => setTimeout(r, 200)); // penghapusan berkas berjalan asinkron
    const berkasBaru = fs.readdirSync(FOLDER_UPLOAD).filter((n) => !isiAwal.has(n));
    expect(berkasBaru).toEqual([]);
  });
});

describe('I-02 AuthController -> Model Akun', () => {
  test('INT-TC05 Normal: login masyarakat dengan kredensial benar membuat sesi dan membuka beranda', async () => {
    const klien = await login(L.url, 'sisi@lawhub.test', 'sisi947', '/login-masyarakat');
    expect(klien.resLogin.status).toBe(302);
    expect(klien.resLogin.headers.location).toBe('/masyarakat');

    const beranda = await klien.get('/masyarakat');
    expect(beranda.status).toBe(200);
  });

  test('INT-TC06 Gagal: login dengan kata sandi salah tidak membuat sesi', async () => {
    const klien = await login(L.url, 'sisi@lawhub.test', 'salah-sandi', '/login-masyarakat');
    expect(klien.resLogin.headers.location).toBe('/login-masyarakat');

    // pesan flash hanya muncul sekali, jadi halaman login dicek lebih dulu
    const halamanLogin = await klien.get('/login-masyarakat');
    expect(halamanLogin.text).toContain('Email atau kata sandi salah');

    const beranda = await klien.get('/masyarakat');
    expect(beranda.status).toBe(302);
    expect(beranda.headers.location).toBe('/login');
  });

  test('INT-TC07 Gagal: akun mitra login di halaman masyarakat ditolak karena peran tidak sesuai', async () => {
    const klien = await login(L.url, 'ami@lawhub.test', 'ami657', '/login-masyarakat');
    expect(klien.resLogin.headers.location).toBe('/login-masyarakat');

    const halamanLogin = await klien.get('/login-masyarakat');
    expect(halamanLogin.text).toContain('Email terdaftar pada peran lain');
  });

  test('INT-TC51 Normal: login admin (tabel Admin) membuka halaman admin', async () => {
    const klien = await login(L.url, 'admin@lawhub.test', 'admin123');
    expect(klien.resLogin.headers.location).toBe('/admin');

    const halaman = await klien.get('/admin/verifikasi');
    expect(halaman.status).toBe(200);
  });
});

describe('I-22 Middleware auth -> basis data (status akun)', () => {
  test('INT-TC08 Gagal: akun yang diblokir saat masih login langsung kehilangan akses', async () => {
    const klien = await login(L.url, 'rina@lawhub.test', 'rina123', '/login-masyarakat');
    expect((await klien.get('/masyarakat')).status).toBe(200);

    L.db.prepare("UPDATE Masyarakat SET statusAkun = 'diblokir' WHERE email = ?").run('rina@lawhub.test');

    const res = await klien.get('/masyarakat');
    expect(res.status).toBe(403);
    expect(res.text).toContain('Akun Anda diblokir');
  });

  test('INT-TC09 Gagal: mitra yang belum terverifikasi tidak bisa membuka halaman pengajuan konsultasi', async () => {
    const klien = await login(L.url, 'mitra.int@lawhub.test', 'rahasia123');
    expect(klien.resLogin.headers.location).toBe('/mitra/status-verifikasi');

    const res = await klien.get('/konsultasi/pengajuan');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/mitra/status-verifikasi');
  });
});
