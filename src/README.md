# LawHub - Platform Layanan Konsultasi Hukum Digital

## Kelompok K03_G05
| Nama | NIM |
| :--- | :--- |
| 13525003 | Cherinette Corsane Khassyah Purceria |
| 13525057 | Raya Medina Farrelin |
| 13525108 | Khasya Nurul Amini |
| 13525138 | Cathrine Angel Siburian |
| 13525150 | Livy Chandra |

## Deskripsi Program
LawHub merupakan aplikasi layanan konsultasi hukum digital berbasis web yang menghubungkan Masyarakat dengan Mitra Pengacara melalui dua fitur utama, yaitu HaloLaw untuk konsultasi hukum on-demand secara langsung melalui chat, dan SearchLaw untuk pencarian dasar hukum yang relevan dengan kasus yang dihadapi pengguna. Sistem menerima input dari Masyarakat dan Mitra Pengacara melalui antarmuka aplikasi, mengelola proses registrasi, verifikasi akun, penjadwalan sesi konsultasi, pencarian dasar hukum dan mitra pengacara, pelaksanaan sesi konsultasi melalui chat, hingga pengelolaan ulasan dan pelaporan, dengan Admin sebagai pengguna yang memverifikasi dan mengawasi jalannya sistem.

Untuk mendukung proses transaksi, LawHub berinteraksi dengan Payment Gateway pihak ketiga (dummy) untuk memproses otorisasi pembayaran setiap kali Masyarakat menyelesaikan pembayaran sesi konsultasi, serta untuk memproses pencairan dana setiap kali Mitra Pengacara mengajukan pencairan dana hasil konsultasi yang telah ditangani. Sistem mengirimkan permintaan transaksi ke Payment Gateway dan menerima status keberhasilan transaksi sebagai respons, yang selanjutnya digunakan untuk memperbarui status pembayaran atau pencairan dana pada sistem.

---

### Pembagian Anggota
| Anggota | NIM | 
| :--- | :--- | 
| 13525003 | Cherinette Corsane Khassyah Purceria |
| 13525057 | Raya Medina Farrelin |
| 13525108 | Khasya Nurul Amini |
| 13525138 | Cathrine Angel Siburian |
| 13525150 | Livy Chandra |

---

## Teknologi yang Digunakan
| Komponen | Teknologi |
| :--- | :--- |
| Bahasa dan runtime | JavaScript dengan Node.js (v24) |
| Framework web | Express |
| Tampilan | EJS (template HTML) dan CSS |
| Basis data | SQLite (`better-sqlite3`) |

Daftar lengkap pustaka ada di `package.json`.

## Requirements
- Node.js 20 atau lebih baru (disarankan v24), sudah termasuk npm
- Git

Periksa instalasi dengan perintah berikut.

```bash
node --version
npm --version
```

`better-sqlite3` memakai modul native yang biasanya terpasang otomatis lewat `npm install` di semua sistem operasi. Jika proses instalasinya gagal (muncul error `node-gyp` atau `gyp ERR!`), pasang perangkat kompilasi sesuai sistem operasi, lalu jalankan `npm install` lagi:
 
| Sistem operasi | Perangkat yang dibutuhkan |
| :--- | :--- |
| macOS | Jalankan `xcode-select --install` di terminal |
| Windows | Pasang [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) dengan komponen "Desktop development with C++", serta [Python 3](https://www.python.org/downloads/) |

## Instalasi

```bash
git clone https://github.com/rmdifmedia/IF2150-RPL-K03-G05.git
cd IF2150-RPL-K03-G05/src
npm install
```

## Konfigurasi

Semua perintah di bawah dijalankan di terminal, di dalam folder `src/`.

**Langkah 1. Buat berkas `.env`.**
Berkas ini menyimpan pengaturan aplikasi. Buat berkas baru bernama `.env` di folder `src/`, lalu isi dengan:

```
PORT=3000
SESSION_SECRET=ganti-dengan-kata-acak-apa-saja
```

**Langkah 2. Siapkan basis data.**
Jalankan:

```bash
npm run db:init
```

Perintah ini membuat berkas basis data `db/lawhub.db` beserta data awalnya. Cukup dijalankan sekali.


## Struktur direktori

```text
.
├── docs                         # Dokumen Laporan MS 1–9
├── src                          # Kode Implementasi
│   ├── server.js                # Program utama (titik masuk)
│   ├── db
│   │   ├── database.js
│   │   ├── init.js              # Membuat basis data dan data awal
│   │   └── schema.sql           # Skema basis data
│   ├── models                   # Entitas dan query
│   ├── controllers              # Logika aplikasi
│   ├── routes                   # Pemetaan URL
│   ├── middleware               # auth.js, validasi.js, upload.js
│   ├── socket                   # Socket.IO (live chat dan chat konsultasi)
│   ├── views                    # Template EJS per modul, dan partials/
│   ├── public                   # CSS dan aset statis
│   ├── uploads                  # Berkas unggahan (tidak di-commit)
│   ├── package.json
│   └── README.md
```

Kode program diletakkan di dalam `src/`. Berkas utama program adalah `server.js`.

- `docs`: dokumen proyek (SKPL, DPPL, laporan)
- `src/db`: skema dan inisialisasi basis data
- `src/uploads`: berkas dokumen legalitas yang diunggah mitra

## Menjalankan program

Dari folder `src/`, jalankan mode pengembangan :

```bash
npm run dev
```

Buka `http://localhost:3000` di browser. 

## Akun dan data uji

| Peran | Identitas | Kata sandi | Catatan |
| :--- | :--- | :--- | :--- |
| Mitra pengacara | `ami@lawhub.test` | `ami657` | 
| Masyarakat | `sisi@lawhub.test` | `sisi947` | 
| Admin | `admin@lawhub.test` | `admin123` | 


## Basis data

Tabel dan atributnya basis data SQLite:

| Tabel | Atribut |
| :--- | :--- |
| `Masyarakat` | idMasyarakat, nama, username, nohp, email, sandi, statusAkun |
| `MitraPengacara` | idMitra, nama, email, username, namaFirma, deskripsi, sandiMitra, validitas, statusVerifikasi, tagKeahlian, spesialisasi, statusKetersediaan, rating, saldo, rekeningPencairan, statusAkun |
| `Admin` | idAdmin, nama, email, sandi, statusStandby |
| `Kasus` | idKasus, idMasyarakat, judulKasus, kategoriMasalah, deskripsi, statusKasus |
| `DasarHukum` | idPasal, namaPeraturan, nomorPasal, isiPasal |
| `DokumenLegalitas` | idDokumen, idMitra, validitas, jenisDokumen, namaBerkas, lokasiBerkas, waktuUnggah |
| `JadwalKetersediaan` | idJadwal, idMitra, tanggal, waktuMulai, waktuSelesai (unik per idMitra, tanggal, waktuMulai) |
| `SesiKonsultasi` | idSesi, idMasyarakat, idMitra, idKasus, tanggalJadwal, waktuJadwal, statusSesi, statusKonsul, catatanKonsul, statusPembayaran, waktuMulai, waktuSelesai |
| `Ulasan` | idUlasan, idSesi, idMasyarakat, idMitra, skorRating, teksUlasan, foto, tanggalUlasan |
| `Laporan` | idLaporan, idPelapor, peranPelapor, idTerlapor, peranTerlapor, idUlasan, jenisPelanggaran, deskripsi, tanggalLaporan, statusLaporan |
| `Pembayaran` | idPembayaran, idSesi, nominal, statusPembayaran, metodeBayar, waktuTransaksi |
| `LiveChat` | idChat, idMasyarakat, idAdmin, waktuChatMulai, waktuChatSelesai, statusChat |
| `PencairanDana` | idPencairan, idMitra, totalPencairan, tanggalPengajuan, statusPencairan, rekeningTujuan |
| `PesanChat` | idPesan, idSesi, idChat, peranPengirim, idPengirim, isiPesan, waktuKirim |

`JadwalKetersediaan` adalah tabel bantu implementasi yang tidak ada di DPPL, digunakan untuk menyimpan slot waktu yang dibuka mitra.