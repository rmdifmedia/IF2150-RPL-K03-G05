const { siapkanDbUnit, tanggalWib } = require('./helpers/dbUnit');

let U;
let MitraPengacara;
let verifikasiMitra;
let Kasus;
let DasarHukum;
let DokumenLegalitas;
let idSisi;
let idDimas;

beforeAll(() => {
  U = siapkanDbUnit();
  MitraPengacara = require('../../models/MitraPengacara');
  verifikasiMitra = require('../../models/verifikasiMitra');
  Kasus = require('../../models/Kasus');
  DasarHukum = require('../../models/DasarHukum');
  DokumenLegalitas = require('../../models/DokumenLegalitas');
  idSisi = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  idDimas = U.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'dimas'").get().idMitra;
});

afterAll(() => {
  U.bersihkan();
});

describe('C41 MitraPengacara & verifikasiMitra (Mendalam)', () => {
  test('C41-UT01 Normal: cari menyaring mitra terverifikasi berdasarkan tags keahlian dan kata kunci', () => {
    const budi = U.db.prepare("SELECT idMitra, tagKeahlian FROM MitraPengacara WHERE username = 'budi'").get();
    const tagPertama = budi.tagKeahlian.split(',')[0].trim();

    const hasil = MitraPengacara.cari({ tags: [tagPertama], q: 'Budi', ratingMin: 0 });
    expect(Array.isArray(hasil)).toBe(true);
    expect(hasil.some((m) => m.idMitra === budi.idMitra)).toBe(true);

    expect(MitraPengacara.IsUsnAda('budi')).toBe(true);
    expect(MitraPengacara.infoProfil(budi.idMitra).username).toBe('budi');
    expect(MitraPengacara.cekKetersediaanJadwal(budi.idMitra, tanggalWib(10), '10:00')).toBe(true);
  });

  test('C41-UT02 Batas: cari tanpa filter mengembalikan seluruh mitra terverifikasi aktif', () => {
    const hasil = MitraPengacara.cari({});
    expect(hasil.length).toBeGreaterThan(0);
  });

  test('C41-UT03 Negatif: cari dengan kata kunci tidak cocok mengembalikan array kosong', () => {
    expect(MitraPengacara.cari({ q: 'zzqqxxmitratidakada' })).toEqual([]);
  });

  test('C41-UT04 Normal: ambilDaftarMitra, ambilDetailMitra, dan prosesKeputusanVerifikasi mengelola verifikasi mitra', () => {
    U.db.prepare("UPDATE MitraPengacara SET statusVerifikasi = 'menunggu' WHERE idMitra = ?").run(idDimas);
    const ins = U.db.prepare(
      "INSERT INTO DokumenLegalitas (idMitra, jenisDokumen, namaBerkas, lokasiBerkas, validitas) VALUES (?, 'kta', 'kta.pdf', 'kta-uji.pdf', 0)"
    ).run(idDimas);

    const daftar = verifikasiMitra.ambilDaftarMitra({ q: 'Dimas', status: 'semua', urutan: 'terbaru' });
    expect(daftar.some((m) => m.idMitra === idDimas)).toBe(true);
    expect(verifikasiMitra.ambilDaftarMitra({ status: 'terverifikasi', urutan: 'terlama' }).length).toBeGreaterThan(0);

    const detail = verifikasiMitra.ambilDetailMitra(idDimas);
    expect(detail).toBeDefined();
    expect(verifikasiMitra.ambilDetailMitra(999999)).toBeNull();
    expect(verifikasiMitra.ambilDokumenById(ins.lastInsertRowid)).toBeDefined();
    expect(verifikasiMitra.ambilBerkasDariMitra(idDimas, 'kta')).toBeDefined();
    expect(verifikasiMitra.ambilBerkasDariMitra(idDimas, 'tidak_valid')).toBeNull();

    verifikasiMitra.prosesKeputusanVerifikasi(idDimas, 'tolak', 'Perlu perbaikan berkas');
    expect(MitraPengacara.statusRegistrasiByUsername('dimas').statusVerifikasi).toBe('ditolak');

    verifikasiMitra.prosesKeputusanVerifikasi(idDimas, 'verifikasi', 'Dokumen lengkap');
    expect(MitraPengacara.statusRegistrasiById(idDimas).statusVerifikasi).toBe('terverifikasi');
    const dok = U.db.prepare('SELECT validitas FROM DokumenLegalitas WHERE idMitra = ?').all(idDimas);
    expect(dok.every((d) => d.validitas === 1)).toBe(true);

    MitraPengacara.ubahProfil(idDimas, {
      namaFirma: 'Firma Dimas & Rekan',
      deskripsi: 'Spesialis hukum bisnis.',
      tagKeahlian: 'Hukum Bisnis',
    });
    expect(MitraPengacara.ubahStatusVerifikasi(idDimas, 'terverifikasi')).toBe(true);
  });

  test('C41-UT05 Negatif: prosesKeputusanVerifikasi untuk idMitra tidak ada melempar MITRA_TIDAK_DITEMUKAN', () => {
    expect(() => verifikasiMitra.prosesKeputusanVerifikasi(999999, 'verifikasi', '')).toThrow('MITRA_TIDAK_DITEMUKAN');
  });
});

describe('Kelas Model Tingkat Sedang (C43, C44, C45)', () => {
  let idKasusBaru;

  test('C43-UT01 Normal: Kasus.buat menyimpan deskripsi kasus baru dan mengembalikan idKasus', () => {
    idKasusBaru = Kasus.buat({
      idMasyarakat: idSisi,
      judulKasus: 'Sengketa Sewa Rumah',
      kategoriMasalah: 'perdata',
      deskripsi: 'Permasalahan wanprestasi perjanjian sewa menyewa rumah.',
    });
    const baris = Kasus.cariMilik(idKasusBaru, idSisi);
    expect(baris).toBeDefined();
    expect(baris.kategoriMasalah).toBe('perdata');
  });

  test('C43-UT02 Negatif: Kasus.cariMilik menolak akses terhadap kasus milik pengguna lain', () => {
    const idTono = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'tono'").get().idMasyarakat;
    expect(Kasus.cariMilik(idKasusBaru, idTono)).toBeUndefined();
  });

  test('C44-UT01 Normal: DasarHukum.cariById mengembalikan data dasar hukum terdaftar', () => {
    const contoh = U.db.prepare('SELECT idPasal FROM DasarHukum LIMIT 1').get();
    if (contoh) {
      expect(DasarHukum.cariById(contoh.idPasal)).toBeDefined();
    } else {
      expect(DasarHukum.cariById(999999)).toBeUndefined();
    }
  });

  test('C45-UT01 Normal: DokumenLegalitas.cariByMitra mengembalikan dokumen milik mitra', () => {
    const daftar = DokumenLegalitas.cariByMitra(idDimas);
    expect(Array.isArray(daftar)).toBe(true);
    expect(daftar.length).toBeGreaterThan(0);
  });
});
