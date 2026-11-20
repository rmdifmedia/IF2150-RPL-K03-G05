<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## LawHub
### <p align="center">
<img alt="Logo_LawHub" src="./assets/Logo_LawHub.png" width="70%">
</p>

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K03 |
| Kelompok | G05  |

| NIM | Nama |
|---|---|
| 13525057 | Raya Medina Farrelin |
| 13525003 | Cherinette Corsane Khassyah Purceria |
| 13525108 | Khasya Nurul Amini |
| 13525150 | Livy Chandra |
| 13525138 | Cathrine Angel Siburian |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Tuliskan uraian ringkas mengenai isi dokumen, tujuan pembuatan dokumen HIUPL ini, dan siapa saja target pembacanya.

## 1.2 Lingkup Masalah
Tuliskan lingkup masalah, yaitu membangun perangkat lunak *[nama perangkat lunak]*. Jelaskan dengan singkat dan jelas deskripsi aplikasi serta keterkaitannya dengan perangkat lunak atau sistem lain (jika ada). Bagian ini maksimal berisi satu paragraf, dapat diambil dari SKPL/DPPL.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |
| *...* | *...* | *...* |

## 1.5 Referensi
Cantumkan daftar buku, panduan, atau dokumentasi lain yang dirujuk dalam pembuatan dokumen dan pengembangan P/L, **minimal dokumen SKPL, APL, DPPL, dan Implementasi (Tugas 9)**. Tambahkan dokumentasi *framework*/*library*/*testing tool* atau referensi lain apabila digunakan.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Bagian ini diisi dengan *System Overview*, dalam bentuk gambar dan narasi yang memberikan gambaran tentang aplikasi dan konteksnya. **Batasan dan keterkaitan** antara sistem yang dibangun dengan sistem lain di luarnya harus jelas. Deskripsi umum sistem perlu dilengkapi dengan pemodelan kasus yang dihadapi, seperti *use case diagram*. Berikan narasi yang jelas untuk setiap gambar yang ditampilkan.

Bagian ini dapat menyalin atau meringkas dari dokumen SKPL atau DPPL.

<p align="center">
<img alt="System Overview / Use Case Diagram" src="./assets/contoh-uc-diagram.webp" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram [Nama P/L]</i>
</p>

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
| ... | *...* | *...* |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C02* | *Pesanan* | *Mendalam* | *Memuat `hitungTotal()` dan transisi status pembayaran* | *C02-UT01 s.d. C02-UT08* |
| *C03* | *Keranjang* | *Sedang* | *Delegasi sederhana ke Produk dan Pesanan* | *C03-UT01 s.d. C03-UT03, INT-TC02* |
| *C01* | *Pelanggan* | *Tidak perlu* | *Hanya menyimpan data akun, tanpa logika* | *-* |
| *[CXX]* | *[Nama kelas]* | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |
| *...* | *...* | *...* | *...* | *...* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: *[tuliskan perintah, mis. `pytest src/tests/`]*.

Lokasi file test: *[path, mis. `src/tests/`]*.

### 4.2.1 Kelas [Nama Kelas 1]

**ID Kelas:** *[C02]*  
**Nama Kelas:** *[Pesanan]*  
**Tingkat:** *[Mendalam]*

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`hitungTotal(): Decimal`* | *Normal* | *Pesanan berisi 2 item: 10.000 x 2 dan 5.000 x 1* | *Total = 25.000* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT02* | *`hitungTotal(): Decimal`* | *Batas* | *Pesanan berisi tepat 1 item dengan jumlah 1* | *Total = harga item tersebut* | *[...]* | *Pass/Fail* |
| *C02-UT03* | *`hitungTotal(): Decimal`* | *Negatif* | *Pesanan tanpa item* | *Total = 0 atau melempar kesalahan sesuai rancangan* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.2 Kelas [Nama Kelas 2]

*[Ulangi pola 4.2.1 untuk setiap kelas bertingkat Mendalam atau Sedang.]*

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.
 
Cara menjalankan pengujian integrasi: `npm run test:integrasi` (dari folder `src/`).

Lokasi file test: `src/tests/integrasi/`.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| I-01 | RegistrasiController | Masyarakat, MitraPengacara, DokumenLegalitas (Model) | Controller - Model | INT-TC01, INT-TC02, INT-TC03, INT-TC04 |
| I-02 | AuthController | Akun (Model; tabel Masyarakat, MitraPengacara, Admin) | Controller - Model | INT-TC05, INT-TC06, INT-TC07, INT-TC51 |
| I-03 | VerifikasiMitraController | verifikasiMitra (Model) | Controller - Model | INT-TC10, INT-TC11 |
| I-04 | ProfilMitraController | MitraPengacara, JadwalKetersediaan, DokumenLegalitas (Model) | Controller - Model | INT-TC12 s.d. INT-TC17 |
| I-05 | Handler SearchLaw (`routes/searchLaw.js`) | Tabel Peraturan | Controller - Model | INT-TC18, INT-TC19 |
| I-06 | KasusController, PencarianMitraController | Kasus, MitraPengacara (Model) | Controller - Model | INT-TC20, INT-TC21, INT-TC22 |
| I-07 | PenjadwalanKonsultasiController | SesiKonsultasi (Model) | Controller - Model | INT-TC23, INT-TC24 |
| I-08 | SesiKonsultasiController | SesiKonsultasi (Model) | Controller - Model | INT-TC25, INT-TC26, INT-TC27 |
| I-09 | UlasanController | Ulasan, MitraPengacara (Model) | Controller - Model | INT-TC35, INT-TC36, INT-TC37 |
| I-10 | LaporanController | Laporan, Ulasan, Masyarakat, MitraPengacara (Model) | Controller - Model | INT-TC43, INT-TC44, INT-TC52, INT-TC53 |
| I-11 | ModerasiAkunController | Laporan (Model; termasuk status akun terlapor) | Controller - Model | INT-TC45, INT-TC46, INT-TC47 |
| I-12 | RiwayatController | Riwayat (Model) | Controller - Model | INT-TC38, INT-TC39 |
| I-13 | LiveChatController | LiveChat (Model) | Controller - Model | INT-TC49, INT-TC50 |
| I-14 | PembayaranController | Pembayaran (Model) | Controller - Model | INT-TC31, INT-TC33 |
| I-15 | PencairanController | PencairanDana (Model) | Controller - Model | INT-TC40, INT-TC41 |
| I-16 | Seluruh Model | Basis data SQLite (`better-sqlite3`) | Aplikasi - Basis data | INT-TC34, INT-TC42 |
| I-17 | PembayaranController | PaymentGateway dummy (`services/PaymentGateway.js`) | Aplikasi - Sistem eksternal | INT-TC32, INT-TC33 |
| I-18 | PencairanController | PaymentGateway dummy (`services/PaymentGateway.js`) | Aplikasi - Sistem eksternal | INT-TC40 |
| I-19 | Klien Socket.IO (browser) | `socket/konsultasi.js` → SesiKonsultasi, PesanChat | Klien - Server *real-time* (tambahan, tidak ada di DPPL) | INT-TC28, INT-TC29, INT-TC30 |
| I-20 | Klien Socket.IO (browser) | `socket/livechat.js` → LiveChat, PesanChat | Klien - Server *real-time* (tambahan, tidak ada di DPPL) | INT-TC48, INT-TC50 |
| I-21 | Middleware unggah (multer) | Folder `src/uploads/` | Aplikasi - *File system* (tambahan, tidak ada di DPPL) | INT-TC03, INT-TC04, INT-TC16, INT-TC17 |
| I-22 | `middleware/auth.js` | Basis data (status akun dan status verifikasi) | Middleware - Basis data (tambahan, tidak ada di DPPL) | INT-TC08, INT-TC09 |
| I-23 | StatusRegistrasiController (realisasi StatusVerifikasiMitraView → VerifikasiMitraController pada DPPL) | MitraPengacara, DokumenLegalitas (Model) | Controller - Model (tambahan, nama controller berbeda dari DPPL) | INT-TC54, INT-TC55 |
| I-24 | BerandaMitraController (realisasi BerandaView) | DashboardMitra (Model) | Controller - Model (tambahan, tidak ada di DPPL) | INT-TC56, INT-TC57 |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | I-01 | Normal: registrasi masyarakat | `POST /registrasi-masyarakat` dengan nama, username `uji_int`, no. HP `81234567890`, email baru, sandi `rahasia123`, lalu baca tabel Masyarakat | Redirect ke `/login-masyarakat`; baris baru tersimpan, no. HP `+6281234567890`, sandi berupa hash bcrypt | Redirect 302 ke `/login-masyarakat`; baris tersimpan dengan no. HP `+6281234567890`; sandi berawalan `$2` (hash bcrypt), bukan teks asli | Pass |
| INT-TC02 | I-01 | Gagal: email sudah terdaftar | `POST /registrasi-masyarakat` memakai email `sisi@lawhub.test` | Status 400, pesan "Email sudah terdaftar", jumlah baris Masyarakat tetap | Status 400, pesan "Email sudah terdaftar" tampil, jumlah baris tidak bertambah | Pass |
| INT-TC03 | I-01, I-21 | Normal: registrasi mitra dengan 4 dokumen wajib | `POST /registrasi-mitra` (multipart) dengan data akun dan berkas PDF Ijazah, KTA, SIPA, BAS | Redirect ke `/login`; akun berstatus `menunggu`; 4 baris DokumenLegalitas; berkas fisik ada di `uploads/` | Redirect 302 ke `/login`; status `menunggu`; 4 baris dokumen (bas, ijazah, kta, sipa); keempat berkas ditemukan di `uploads/` | Pass |
| INT-TC04 | I-01, I-21 | Gagal: dokumen BAS tidak diunggah | `POST /registrasi-mitra` hanya dengan Ijazah, KTA, SIPA | Status 400, pesan "Dokumen BAS wajib diunggah", akun tidak dibuat, berkas yang sempat terunggah dihapus | Status 400, pesan tampil, akun tidak ada di basis data, tidak ada berkas baru yang tertinggal di `uploads/` | Pass |
| INT-TC05 | I-02 | Normal: login masyarakat | `POST /login-masyarakat` dengan `sisi@lawhub.test` / `sisi947`, lalu `GET /masyarakat` | Redirect ke `/masyarakat`; beranda dapat dibuka (200) | Redirect 302 ke `/masyarakat`; `GET /masyarakat` berstatus 200 | Pass |
| INT-TC06 | I-02 | Gagal: kata sandi salah | `POST /login-masyarakat` dengan sandi `salah-sandi` | Kembali ke halaman login dengan pesan "Email atau kata sandi salah"; tidak ada sesi login | Redirect ke `/login-masyarakat`, pesan tampil; `GET /masyarakat` diarahkan ke `/login` | Pass |
| INT-TC07 | I-02 | Gagal: akun mitra login di halaman masyarakat | `POST /login-masyarakat` dengan akun mitra `ami@lawhub.test` | Ditolak dengan pesan "Email terdaftar pada peran lain..." | Redirect ke `/login-masyarakat`, pesan tampil, tidak masuk | Pass |
| INT-TC08 | I-22 | Gagal: akun diblokir saat masih login | Login sebagai `rina`, lalu ubah `statusAkun` menjadi `diblokir` di basis data, lalu `GET /masyarakat` | Akses ditolak (403) dengan pesan "Akun Anda diblokir..." | Status 403, pesan "Akun Anda diblokir karena melanggar kebijakan sistem" | Pass |
| INT-TC09 | I-22 | Gagal: mitra belum terverifikasi membuka fitur konsultasi | Login mitra hasil INT-TC03 (status `menunggu`), lalu `GET /konsultasi/pengajuan` | Diarahkan ke `/mitra/status-verifikasi` | Login diarahkan ke `/mitra/status-verifikasi`; akses pengajuan juga diarahkan ke `/mitra/status-verifikasi` | Pass |
| INT-TC10 | I-03 | Gagal: admin menolak tanpa catatan | `POST /admin/verifikasi/:idMitra` dengan `keputusan=tolak`, `catatan` kosong (mitra fixture berstatus `menunggu`) | Ditolak sistem; status mitra tetap `menunggu` | Redirect kembali ke detail mitra; status tetap `menunggu` | Pass |
| INT-TC11 | I-03 | Normal: admin memverifikasi mitra | `POST /admin/verifikasi/:idMitra` dengan `keputusan=verifikasi` | Status mitra `terverifikasi`; validitas dokumen mitra menjadi 1 | Redirect ke `/admin/verifikasi`; status `terverifikasi`; seluruh dokumen mitra bervaliditas 1 | Pass |
| INT-TC12 | I-04 | Normal: mitra mengubah profil | `POST /mitra/profil/edit` (login `ami`) dengan nama firma baru, deskripsi, tag `pidana` | Data tersimpan pada tabel MitraPengacara | Redirect ke `/mitra/profil`; namaFirma, deskripsi, dan tagKeahlian di basis data sesuai masukan | Pass |
| INT-TC13 | I-04 | Gagal: deskripsi profil kosong | `POST /mitra/profil/edit` dengan deskripsi berisi spasi | Ditolak; data profil lama tidak berubah | Redirect ke `/mitra/profil/edit`; namaFirma dan tag tetap nilai lama | Pass |
| INT-TC14 | I-04 | Normal: menambah slot jadwal | `POST /mitra/jadwal` tanggal H+40, 08:00-10:00 | Satu baris baru pada JadwalKetersediaan | Satu baris tersimpan dengan waktu 08:00-10:00 | Pass |
| INT-TC15 | I-04 | Gagal: slot bertumpuk | `POST /mitra/jadwal` tanggal yang sama, 09:00-11:00 | Ditolak dengan pesan "Jam tersebut bertumpuk dengan slot lain."; tidak ada baris baru | Tetap 1 baris pada tanggal itu; pesan tampil di halaman profil | Pass |
| INT-TC16 | I-04, I-21 | Normal: unggah dokumen legalitas | `POST /mitra/dokumen` (multipart) dengan berkas PDF pada kolom SIPA | Baris DokumenLegalitas tersimpan (validitas 0), berkas ada di `uploads/`, status mitra kembali `menunggu` | Redirect ke `/mitra/profil`; baris SIPA tersimpan dengan validitas 0; berkas ada; status mitra `menunggu` | Pass |
| INT-TC17 | I-04, I-21 | Gagal: format dokumen tidak didukung | `POST /mitra/dokumen` dengan berkas `.txt` (text/plain) pada kolom KTP | Ditolak dengan pesan "Format dokumen tidak didukung."; tidak ada baris baru; berkas dihapus | Jumlah baris DokumenLegalitas tetap; tidak ada berkas tertinggal; pesan tampil | Pass |
| INT-TC18 | I-05 | Normal: pencarian peraturan | `GET /searchlaw?q=Pekerja Rumah Tangga` | Halaman memuat judul, nomor, dan tahun peraturan yang ada di tabel Peraturan | Status 200; judul dan "Nomor 2 Tahun 2026" tampil sesuai baris di basis data | Pass |
| INT-TC19 | I-05 | Gagal: kata kunci tidak cocok | `GET /searchlaw?q=zzqqxxkatakuncitidakada` | Pesan "Belum ada peraturan yang cocok dengan pencarianmu." tanpa kartu hasil | Status 200; pesan kosong tampil; tidak ada kartu hasil | Pass |
| INT-TC20 | I-06 | Normal: simpan kasus lalu cari mitra | `POST /halolaw` (login `sisi`) dengan deskripsi kasus dan tag `pidana`, lalu buka daftar mitra | Kasus tersimpan dengan kategori `pidana`; daftar memuat mitra bertag pidana dan tidak memuat mitra tanpa tag pidana | Kasus tersimpan; redirect ke `/halolaw/mitra?kasus=<id>`; Budi (pidana) tampil, Citra (perdata, administrasi) tidak tampil | Pass |
| INT-TC21 | I-06 | Gagal: deskripsi kasus terlalu pendek | `POST /halolaw` dengan deskripsi `pendek` | Status 400, pesan "Deskripsi kasus minimal 10 karakter."; kasus tidak tersimpan | Status 400, pesan tampil, jumlah baris Kasus tetap | Pass |
| INT-TC22 | I-06 | Gagal: tidak ada mitra yang sesuai | `GET /halolaw/mitra?q=namayangtidakada&terapkan=1` | Pesan "Tidak ada mitra pengacara yang sesuai." | Status 200, pesan tampil | Pass |
| INT-TC23 | I-07 | Normal: memilih jadwal kosong | Cek slot H+3 mitra Budi lewat `GET /konsultasi/jadwal/:idMitra/slot`, lalu `POST /konsultasi/jadwal/:idMitra` jam 14:00 | Sesi baru berstatus `menunggu tanggapan mitra`; slot 14:00 tidak lagi ditawarkan | Redirect ke `/konsultasi/saya`; sesi tersimpan dengan status tersebut; slot 14:00 hilang dari daftar slot | Pass |
| INT-TC24 | I-07 | Gagal: slot sudah dipesan orang lain | Akun `rina` memesan slot Budi yang sama (H+3, 14:00) | Ditolak; tidak terjadi dobel booking | Redirect kembali ke halaman jadwal; tetap hanya 1 sesi pada slot tersebut | Pass |
| INT-TC25 | I-08 | Gagal: menolak tanpa catatan | `POST /konsultasi/konfirmasi/:idSesi` (login `budi`) dengan `aksi=tolak`, catatan kosong | Ditolak; status sesi tetap `menunggu tanggapan mitra` | Redirect kembali ke halaman konfirmasi; status tidak berubah | Pass |
| INT-TC26 | I-08 | Normal: mitra menerima permintaan | `POST /konsultasi/konfirmasi/:idSesi` dengan `aksi=terima` | Status sesi `terjadwal` | Redirect ke `/konsultasi/pengajuan`; status `terjadwal` | Pass |
| INT-TC27 | I-08 | Gagal: menanggapi ulang permintaan | `POST /konsultasi/konfirmasi/:idSesi` dengan `aksi=tolak` pada sesi yang sudah `terjadwal` | Ditolak; status tetap `terjadwal` | Status tetap `terjadwal` | Pass |
| INT-TC28 | I-19 | Normal: chat konsultasi *real-time* | Fixture sesi `terjadwal` + `lunas` pada jam sekarang; masyarakat dan mitra terhubung ke namespace `/konsultasi`, `gabung`, lalu masyarakat `kirim_pesan` | Mitra menerima `pesan_baru` berisi teks asli; pesan tersimpan terenkripsi (`enc:v1:`); status sesi `berlangsung` dan waktu mulai tercatat | Mitra menerima teks asli; isi PesanChat berawalan `enc:v1:` dan tidak memuat teks asli; status `berlangsung`, `waktuMulai` terisi | Pass |
| INT-TC29 | I-19 | Gagal: sesi belum lunas | Fixture sesi `terjadwal` dengan `statusPembayaran = belum bayar`; masyarakat `gabung` lalu `kirim_pesan` | `pesan_error` "Pembayaran sesi konsultasi belum lunas..."; tidak ada pesan tersimpan | `pesan_error` diterima; jumlah PesanChat sesi tersebut 0 | Pass |
| INT-TC30 | I-19 | Gagal: koneksi tanpa login | Sambung ke `/konsultasi` tanpa cookie sesi | Koneksi ditolak "Harus login..." | `connect_error` dengan pesan "Harus login sebagai masyarakat atau mitra pengacara" | Pass |
| INT-TC31 | I-14 | Gagal: data kartu tidak valid | `POST /transaksi/pembayaran/:idSesi` dengan nomor kartu `1234` | Status 400 "Nomor kartu harus 16 digit"; tidak ada transaksi tercatat (gateway tidak dipanggil) | Status 400, pesan tampil, jumlah baris Pembayaran untuk sesi 0 | Pass |
| INT-TC32 | I-17 | Gagal: gateway menolak kartu | `POST /transaksi/pembayaran/:idSesi` dengan kartu `0000111122223333` | Status 402 "Pembayaran gagal: Kartu ditolak oleh bank penerbit"; transaksi tercatat `gagal`; sesi tidak lunas; saldo mitra tetap | Status 402, pesan tampil; baris Pembayaran berstatus `gagal`; sesi tidak lunas; saldo tidak berubah | Pass |
| INT-TC33 | I-14, I-17 | Normal: gateway menyetujui pembayaran | `POST /transaksi/pembayaran/:idSesi` dengan kartu `4111111111111111`, kadaluwarsa `12/29`, CVC `123` | Redirect ke `/konsultasi/saya`; transaksi `berhasil`; sesi `lunas`; saldo mitra +Rp70.000 | Server membalas **500 (Terjadi kesalahan pada server)**. Tidak ada baris Pembayaran, sesi tidak lunas, saldo tidak bertambah | **Fail.** Penyebab: pada `models/Pembayaran.js` fungsi `simpanHasil()` terdapat tanda `+` di awal baris query `UPDATE SesiKonsultasi ...` (masuk lewat commit `b9e63af`, PR #51). Tanda `+` mengubah teks query menjadi `NaN`, sehingga `db.prepare()` melempar `TypeError` dan transaksi dibatalkan. Akibatnya tidak ada pembayaran yang bisa berhasil, sehingga alur chat (UC12), ulasan (UC13), dan riwayat (UC18) juga tidak dapat dicapai secara normal. Usulan: hapus kedua tanda `+` tersebut. Pengujian ulang dengan perbaikan sementara memberikan hasil Pass |
| INT-TC34 | I-16 | Gagal: satu query di dalam transaksi gagal | Jalankan pembayaran seperti INT-TC33 (query kedua di dalam `db.transaction` gagal), lalu periksa tabel Pembayaran, SesiKonsultasi, dan saldo mitra | Data tetap konsisten: tidak ada perubahan sebagian (seluruh perubahan dibatalkan) | Baris Pembayaran yang sempat di-INSERT ikut dibatalkan; sesi tidak lunas; saldo tidak berubah | Pass |
| INT-TC35 | I-09 | Normal: kirim ulasan | Fixture sesi `selesai` dan `lunas`; `POST /transaksi/ulasan/:idSesi` skor 5 dan teks ulasan | Ulasan tersimpan; rating mitra = rata-rata skor ulasannya | Redirect ke `/transaksi/riwayat`; baris Ulasan tersimpan; rating mitra sama dengan rata-rata skor | Pass |
| INT-TC36 | I-09 | Gagal: rating kosong | `POST /transaksi/ulasan/:idSesi` dengan skor kosong | Status 400 "Rating wajib diisi (1-5 bintang)"; ulasan tidak tersimpan | Status 400, pesan tampil, tidak ada baris Ulasan | Pass |
| INT-TC37 | I-09 | Gagal: sesi belum selesai | `POST /transaksi/ulasan/:idSesi` pada sesi `terjadwal` | Ditolak; ulasan tidak tersimpan | Redirect ke `/transaksi/riwayat`; tidak ada baris Ulasan | Pass |
| INT-TC38 | I-12 | Normal: membuka detail riwayat konsultasi | Fixture sesi `lunas`; kirim pesan lewat socket, akhiri sesi, lalu `GET /transaksi/riwayat` dan `GET /transaksi/riwayat/:idSesi` | Sesi muncul di daftar riwayat; detail menampilkan isi chat yang dapat dibaca | Sesi muncul di daftar dan halaman detail terbuka (200), tetapi isi pesan tampil sebagai teks terenkripsi `enc:v1:...`, bukan teks asli | **Fail.** Penyebab: `models/Riwayat.js` fungsi `pesanSesi()` mengambil `PesanChat` langsung dari basis data tanpa memanggil `dekripsi()`, padahal pesan disimpan terenkripsi oleh `SesiKonsultasi.simpanPesan()`. Usulan: petakan hasil query dengan `dekripsi()` dari `models/SesiKonsultasi.js`, atau pakai `SesiKonsultasi.ambilPesan()`. Pengujian ulang dengan perbaikan sementara memberikan hasil Pass |
| INT-TC39 | I-12 | Gagal: membuka riwayat milik orang lain | Login `rina`, `GET /transaksi/riwayat/:idSesi` milik `sisi` | Status 404 "Riwayat tidak ditemukan" | Status 404, pesan tampil | Pass |
| INT-TC40 | I-15, I-18 | Normal: pencairan dana | `POST /transaksi/keuangan/cairkan` (login `ami`) nominal 100000 | Gateway menyetujui; PencairanDana tercatat `berhasil` ke rekening terdaftar; saldo berkurang 100.000 | Baris PencairanDana `berhasil` dengan rekening `BCA\|1234567890\|Ami Pengacara`; saldo berkurang tepat 100.000 | Pass |
| INT-TC41 | I-15 | Gagal: nominal melebihi saldo | `POST /transaksi/keuangan/cairkan` nominal = saldo + 1 | Ditolak "Saldo tidak mencukupi"; tidak ada pencairan tercatat; saldo tetap | Jumlah baris PencairanDana tetap; saldo tidak berubah; pesan tampil | Pass |
| INT-TC42 | I-16 | Normal: persistensi data | Matikan lalu nyalakan ulang server dengan basis data yang sama, lalu login dan buka `/transaksi/keuangan` | Data Ulasan dan PencairanDana tetap ada; aplikasi tetap dapat membaca data | Jumlah baris tidak berubah setelah restart; login berhasil dan halaman keuangan berstatus 200 | Pass |
| INT-TC43 | I-10 | Normal: melaporkan akun | `POST /laporan/buat` (login `sisi`) terhadap mitra Budi, kategori "Bahasa kasar", deskripsi | Laporan tersimpan berstatus `menunggu` | Redirect ke `/masyarakat`; baris Laporan tersimpan dengan peran dan status yang benar | Pass |
| INT-TC44 | I-10 | Gagal: deskripsi laporan kosong | `POST /laporan/buat` dengan deskripsi berisi spasi | Ditolak; laporan tidak tersimpan | Jumlah baris Laporan tetap | Pass |
| INT-TC45 | I-11 | Normal: admin memblokir akun terlapor | `POST /admin/laporan/:idLaporan/blokir` dengan catatan, lalu Budi mencoba login | Laporan `disetujui` beserta catatan; akun Budi `diblokir`; login Budi ditolak | Laporan `disetujui`, catatan tersimpan; statusAkun `diblokir`; login ditolak dengan pesan "Akun Anda diblokir" | Pass |
| INT-TC46 | I-11 | Gagal: memproses ulang laporan | `POST /admin/laporan/:idLaporan/tolak` pada laporan yang sudah disetujui | Ditolak "Laporan ini sudah pernah ditinjau sebelumnya."; status tetap | Status tetap `disetujui`; pesan tampil | Pass |
| INT-TC47 | I-11 | Normal: admin menolak laporan | Buat laporan terhadap Citra, lalu `POST /admin/laporan/:idLaporan/tolak` | Laporan `ditolak`; akun Citra tetap `aktif` | Status laporan `ditolak`; akun Citra `aktif` | Pass |
| INT-TC48 | I-20 | Normal: live chat masyarakat dan admin | Masyarakat dan admin terhubung ke Socket.IO; masyarakat `kirim_pesan`; admin `gabung_chat` lalu membalas | Sesi LiveChat dibuat (`menunggu`); admin menerima `admin:antrean_update`; balasan admin sampai ke masyarakat; status `berlangsung` dengan idAdmin terisi; 2 pesan tersimpan | Semua event diterima; LiveChat dibuat lalu berubah `berlangsung`, idAdmin terisi; 2 baris PesanChat | Pass |
| INT-TC49 | I-13 | Normal: admin menyelesaikan live chat | `POST /admin/livechat/:idChat/selesai` | Status `selesai`, waktu selesai tercatat | Redirect ke `/admin/livechat`; status `selesai`; `waktuChatSelesai` terisi | Pass |
| INT-TC50 | I-13, I-20 | Gagal: tidak ada admin standby | Admin menekan tombol standby (`POST /admin/livechat/standby`) sehingga tidak standby, lalu akun `tono` mengirim pesan live chat | Status admin tersimpan tidak standby (0); masyarakat menerima "Belum ada Admin yang standby saat ini."; sesi live chat tidak dibuat | statusStandby menjadi 0; `pesan_error` diterima; tidak ada baris LiveChat untuk `tono` | Pass |
| INT-TC51 | I-02 | Normal: login admin | `POST /login` dengan `admin@lawhub.test` / `admin123`, lalu `GET /admin/verifikasi` | Redirect ke `/admin`; halaman admin dapat dibuka | Redirect 302 ke `/admin`; `GET /admin/verifikasi` berstatus 200 | Pass |
| INT-TC52 | I-10 | Normal: mitra melaporkan ulasan (UC16) | Fixture ulasan dari `sisi` untuk mitra `ami`; `POST /laporan/buat` (login `ami`) dengan `idUlasan`, kategori, dan deskripsi | Laporan tersimpan dengan idUlasan, peran terlapor `masyarakat`, idTerlapor penulis ulasan, status `menunggu` | Redirect ke `/mitra`; baris Laporan tersimpan sesuai harapan | Pass |
| INT-TC53 | I-10 | Gagal: melaporkan ulasan milik mitra lain | `POST /laporan/buat` (login `ami`) dengan idUlasan milik mitra `dimas` | Ditolak "Ulasan tidak ditemukan atau Anda tidak memiliki akses"; laporan tidak tersimpan | Tidak ada baris Laporan untuk ulasan tersebut; pesan tampil | Pass |
| INT-TC54 | I-23 | Normal: cek status verifikasi mitra | `GET /status-verifikasi?username=ami` saat status mitra di basis data `menunggu` | Halaman status menampilkan langkah "Admin sedang memeriksa dokumenmu" dan "Hasil verifikasi belum tersedia." | Status 200; kedua teks tampil sesuai status di basis data | Pass |
| INT-TC55 | I-23 | Gagal: username mitra tidak terdaftar | `GET /status-verifikasi?username=tidak_ada` | Redirect ke `/login` dengan pesan "Username mitra tidak ditemukan." | Redirect 302 ke `/login`; pesan tampil | Pass |
| INT-TC56 | I-24 | Normal: dashboard mitra | Hitung jumlah sesi `menunggu` dan saldo mitra `ami` di basis data, lalu `GET /mitra` | Sapaan nama mitra; jumlah permintaan menunggu dan saldo sama dengan basis data | Status 200; "Halo, Ami Pengacara!", jumlah permintaan menunggu, dan saldo sesuai basis data | Pass |
| INT-TC57 | I-24 | Gagal: akun masyarakat membuka dashboard mitra | `GET /mitra` dengan sesi login `sisi` | Akses ditolak (403) "Akses ditolak" | Status 403, pesan tampil | Pass |
 
Hasil: 57 test case integrasi dijalankan pada 24 antarmuka, 55 Pass dan 2 Fail (INT-TC33 dan INT-TC38). 
<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01* | *Normal* | *1. Buka halaman login.<br>2. Masukkan kredensial.<br>3. Klik tombol "Login".* | *User: rpl@gmail.com<br>Pass: 123456* | *Pengguna diarahkan ke Halaman Dashboard.* | *Pengguna diarahkan ke Halaman Dashboard sesuai hasil yang diharapkan.* | *Pass* |
| *UC01-TC02* | *KF01* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.2 Use Case [Nama Use Case 2]

*[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]*

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| *UC01-TC01* | *[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]* |
| *UC01-TC02* | *[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]* |
| *KNF01-TC01* | *[Sisipkan bukti pengukuran parameter KNF01-TC01]* |
| *...* | *...* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |