const { siapkanDbUnit, tanggalWib } = require('./helpers/dbUnit');

let U;
let Ulasan;
let Riwayat;
let SesiKonsultasi;
let idSisi;
let idCitra;

beforeAll(() => {
  U = siapkanDbUnit();
  Ulasan = require('../../models/Ulasan');
  Riwayat = require('../../models/Riwayat');
  SesiKonsultasi = require('../../models/SesiKonsultasi');
  idSisi = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  idCitra = U.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'citra'").get().idMitra;
});

afterAll(() => {
  U.bersihkan();
});

describe('C47 Ulasan (Mendalam)', () => {
  const buatSesiSelesai = () =>
    U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, statusKonsul, waktuSelesai, waktuPengajuan)
       VALUES (?, ?, ?, '09:00', 'selesai', 'lunas', 'selesai', ?, ?)`
    ).run(idSisi, idCitra, tanggalWib(-1), new Date().toISOString(), new Date().toISOString()).lastInsertRowid;

  test('C47-UT01 Normal: simpan menyimpan ulasan dan memperbarui rata-rata rating mitra', () => {
    const idSesi = buatSesiSelesai();
    Ulasan.simpan({
      idSesi,
      idMasyarakat: idSisi,
      idMitra: idCitra,
      skor: 5,
      teks: 'Penjelasan sangat jelas dan membantu.',
    });

    expect(U.db.prepare('SELECT skorRating FROM Ulasan WHERE idSesi = ?').get(idSesi).skorRating).toBe(5);
    expect(U.db.prepare('SELECT rating FROM MitraPengacara WHERE idMitra = ?').get(idCitra).rating).toBe(5);
  });

  test('C47-UT02 Batas: simpan dengan batas bawah rating 1 menghitung ulang rata-rata rating', () => {
    const idSesi = buatSesiSelesai();
    Ulasan.simpan({
      idSesi,
      idMasyarakat: idSisi,
      idMitra: idCitra,
      skor: 1,
      teks: 'Kurang sesuai harapan.',
    });

    expect(U.db.prepare('SELECT rating FROM MitraPengacara WHERE idMitra = ?').get(idCitra).rating).toBe(3);
  });

  test('C47-UT03 Negatif: simpan dengan skor di luar rentang 1..5 ditolak', () => {
    const idSesi = buatSesiSelesai();
    expect(() =>
      Ulasan.simpan({
        idSesi,
        idMasyarakat: idSisi,
        idMitra: idCitra,
        skor: 6,
        teks: 'Skor tidak valid',
      })
    ).toThrow();
  });
});

describe('C36 Riwayat (Sedang)', () => {
  // Dilaporkan FAIL apa adanya (selaras dengan INT-TC38): models/Riwayat.js pesanSesi() belum memanggil dekripsi()
  test('C36-UT01 Normal: pesanSesi mengembalikan isi chat terdekripsi (bukan enc:v1:...)', () => {
    const idSesi = U.db.prepare(
      `INSERT INTO SesiKonsultasi (idMasyarakat, idMitra, tanggalJadwal, waktuJadwal, statusSesi, statusPembayaran, waktuPengajuan)
       VALUES (?, ?, ?, '10:00', 'selesai', 'lunas', ?)`
    ).run(idSisi, idCitra, tanggalWib(-2), new Date().toISOString()).lastInsertRowid;

    const cipher = SesiKonsultasi.enkripsi('Pesan untuk riwayat konsultasi');
    U.db.prepare(
      `INSERT INTO PesanChat (idSesi, peranPengirim, idPengirim, isiPesan, waktuKirim)
       VALUES (?, 'masyarakat', ?, ?, ?)`
    ).run(idSesi, idSisi, cipher, new Date().toISOString());

    const pesan = Riwayat.pesanSesi(idSesi);
    expect(pesan).toHaveLength(1);
    expect(pesan[0].isiPesan).toBe('Pesan untuk riwayat konsultasi');
  });

  test('C36-UT02 Negatif: untukMasyarakat mengembalikan array kosong bagi pengguna tanpa riwayat', () => {
    const idTono = U.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'tono'").get().idMasyarakat;
    expect(Riwayat.untukMasyarakat(idTono)).toEqual([]);
  });
});
