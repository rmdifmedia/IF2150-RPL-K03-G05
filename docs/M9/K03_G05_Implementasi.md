<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## LawHub
### <p align="center">
<img alt="Logo_LawHub" src="../M7/assets/Logo_LawHub.png" width="50%">
</p>

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K03 |
| Kelompok | G05 |

| NIM | Nama |
|---|---|
| 13525003 | Cherinette Corsane Khassyah Purceria |
| 13525057 | Raya Medina Farrelin |
| 13525108 | Khasya Nurul Amini |
| 13525138 | Cathrine Angel Siburian |
| 13525150 | Livy Chandra |

---

# BAGIAN A: Ketentuan Implementasi

## A.1 Deskripsi Tugas

Pada tugas ini, kalian mengimplementasikan perangkat lunak yang telah dirancang pada tugas-tugas sebelumnya (SKPL, APL, DPPL) menjadi aplikasi yang **dapat dijalankan**. Platform bebas (web, desktop, atau mobile) selama aplikasi dapat dijalankan ulang oleh asisten mengikuti petunjuk kalian.

Ketentuan umum:
- Setiap anggota bertanggung jawab atas **minimal satu fitur atau modul** dan harus terlihat jelas di riwayat commit/PR.
- Implementasi harus **mengacu pada DPPL**. Jika ada yang berubah (kelas, layar, basis data, dsb.), catat di Bagian B.1. Perubahan itu wajar, tetapi harus tercatat dan beralasan.
- Implementasi **tidak harus berupa kelas** (misalnya fungsi, komponen, *route/handler*, *stored procedure*, atau skrip). Namun, setiap kelas perancangan pada DPPL **wajib dapat ditelusuri** ke implementasinya, dan penelusuran ini dicatat di Bagian B.5.
- Seluruh use case pada SKPL **diprioritaskan** untuk diimplementasikan. Status tiap use case akan dilaporkan pada HIUPL (Tugas 10).
- Seluruh mahasiswa **wajib** mengikuti asistensi akbar.

## A.2 Platform, Bahasa, dan Teknologi

Kalian **bebas** memilih bahasa, framework, library, dan basis data, dengan syarat:

1. **Dapat dijalankan ulang** oleh asisten pada mesin biasa dengan mengikuti README. Versi bahasa/runtime dan seluruh dependensi harus tertulis jelas.
2. **Dependensi dikelola lewat file standar**, misalnya `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, dan sejenisnya. Jangan meng-commit folder hasil instalasi (`node_modules/`, `venv/`, `build/`, dll.).
3. **Jika memakai layanan eksternal** (basis data cloud, API pihak ketiga, auth, dll.), sediakan cara menjalankan tanpa akun pribadi kalian, atau sediakan data/akun uji pada README. Basis data **sangat disarankan** dapat dijalankan lokal (SQLite, atau Docker Compose untuk PostgreSQL/MySQL/MongoDB).
4. **Arsitektur sesuai DPPL.** Pola arsitektur yang kalian pilih di APL/DPPL (MVC, layered, client-server, dll.) harus terlihat pada struktur kode.

Ketentuan tambahan per platform:

| Platform | Ketentuan |
| :--- | :--- |
| **Web** | Berjalan lokal lewat satu-dua perintah yang terdokumentasi. Boleh juga di-*deploy*; jika ya, cantumkan URL, tetapi **tetap wajib bisa dijalankan lokal** (URL deploy bisa mati). |
| **Desktop** | Berjalan dari source lewat perintah yang terdokumentasi. Build/installer opsional. |
| **Mobile** | Berjalan di emulator/simulator atau perangkat. Sertakan langkah menjalankan, dan **sangat disarankan** melampirkan APK/build di Release. |

## A.3 Keamanan Repository

Repo fork kelompok bersifat **public**, sehingga:

- **Dilarang** meng-commit password, API key, token, `.env` asli, sertifikat/private key, atau data pribadi. Hal ini dapat mengurangi nilai.
- Sediakan `.env.example` berisi nama variabel tanpa nilai rahasia, dan masukkan `.env` ke `.gitignore`.
- Jika sudah terlanjur ter-commit, **cabut/ganti** kredensial tersebut. Menghapus commit saja tidak cukup.
- Data uji/seed harus berupa data fiktif.

## A.4 Struktur Folder

Seluruh kode ditempatkan di `src/` pada repo fork. Jangan mengubah folder milestone lama.

```
src/                              # SELURUH kode implementasi
	README.md                     # dokumentasi utama aplikasi (lihat A.5)
	.env.example                  # jika memakai environment variable
	<struktur kode kalian>        # bebas, mengikuti pola arsitektur DPPL
	tests/                        # test case (jika ada)
docs/
	M9/
		KXX_GYY_Implementasi.md   # laporan ini (Bagian B)
		KXX_GYY_Form-Asistensi.md
```

Catatan:
- `README.md` aplikasi diletakkan di **`src/README.md`**, bukan di root repo.
- Jika kerangka kerja kalian mewajibkan struktur tertentu (misalnya Maven `src/main/java`, Flutter `lib/`, monorepo `frontend/` dan `backend/`), letakkan semuanya **di dalam `src/`**.
- Nama file dan folder pada `docs/M9/` mengikuti aturan penamaan milestone sebelumnya (`KXX_GYY_...`).

## A.5 Isi Minimal `src/README.md`

README harus cukup bagi orang yang belum pernah melihat proyek kalian untuk menjalankan aplikasi dari nol. Minimal berisi:

1. **Deskripsi singkat** aplikasi.
2. **Teknologi yang digunakan** beserta versi (bahasa, framework, basis data).
3. **Prasyarat dan instalasi** (software yang harus ada, perintah instalasi dependensi).
4. **Konfigurasi** (environment variable, setup basis data, migrasi/seed) dan langkah demi langkah menjalankannya.
5. **Cara menjalankan aplikasi** (dan cara menjalankan test, jika ada).
6. **Akun/data uji** untuk mencoba tiap peran pengguna (jika ada login).
7. **Daftar modul/fitur yang diimplementasi** beserta pembagian anggota.
8. **Daftar tabel/koleksi basis data** beserta atributnya (atau tautan ke skema/ERD).

## A.6 Best Practices

Kalian dianjurkan menerapkan praktik berikut. Bukti penerapannya dirangkum pada Bagian B.2.

### 1. Branching
Sesuai aturan umum di README repository, `main` fork kelompok dijaga agar tetap bisa menerima sync dari asisten. Pada tugas ini **sangat disarankan** memakai branch per fitur dengan format `<tipe>/<nama-fitur>` (contoh: `feat/login-page`, `fix/null-cart`), lalu digabungkan ke `main` melalui Pull Request. Skema Gitflow penuh (dengan `develop`) boleh dipakai, tetapi tidak diwajibkan.

### 2. Semantic Commit
Gunakan format `<tipe>(<scope>): <deskripsi>`, misalnya `feat(auth): tambah validasi email`.

| Tipe | Kegunaan |
| :--- | :--- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Mengubah dokumentasi |
| `style` | Perubahan format/spasi, tanpa mengubah logika |
| `refactor` | Perubahan kode yang tidak menambah fitur atau memperbaiki bug |
| `test` | Menambah/memperbaiki pengujian |
| `chore` | Tugas rutin (build, dependensi, konfigurasi) |

### 3. Track Tasks
Gunakan **GitHub Issues** (dan opsional GitHub Projects) untuk membagi tugas dan melacak progres.
- Pecah fitur besar menjadi issue yang lebih kecil dan tetapkan penanggung jawabnya.
- Hubungkan PR dengan issue (`Closes #12`) dan tutup issue ketika selesai.

### 4. Pull Request dan Code Review
- Setiap PR berisi penjelasan deskriptif tentang apa yang dikerjakan, beserta bukti (tangkapan layar/rekaman/hasil test).
- Setiap PR di-*review* minimal **1 anggota lain**, dengan komentar konstruktif atau approval.

### 5. Pengujian dan Optimasi Performa
- Tulis pengujian untuk logika inti (unit test dan/atau pengujian alur utama). Cakupan penuh tidak diwajibkan, tetapi pengujian pada logika utama dinilai.
- Lakukan **profiling** pada setidaknya satu fitur yang berat (query besar, proses pengolahan data, render list panjang, dsb.), lalu catat temuan dan perbaikannya. Contoh alat:

| Platform | Contoh alat |
| :--- | :--- |
| Web (frontend) | Chrome DevTools (Performance/Network), Lighthouse |
| Web (backend) | Profiler bawaan bahasa, `EXPLAIN` pada query basis data, logging waktu respons |
| Python | `cProfile`, `PyInstrument` |
| Java | VisualVM, JProfiler |
| Mobile | Android Studio Profiler, Flutter DevTools, Xcode Instruments |

### 6. Penggunaan AI
Penggunaan AI **tetap harus dicatat** pada `docs/KXX_GYY_AI-Usage.md` sesuai ketentuan yang sudah berlaku.

## A.7 Pengumpulan

Pengumpulan dinilai dari **tag release**, bukan commit terakhir.

1. Pastikan seluruh pekerjaan sudah di-*commit* dan di-*push* ke `main` fork kelompok.
2. Buat release dengan tag **`v9.0`** (revisi berikutnya `v9.1`, `v9.2`, dst.) dengan target branch `main`.
3. Yang dinilai adalah **tag terakhir yang dibuat sebelum deadline**.

## A.8 Aturan Tanya Jawab

Agar semua kelompok mendapat jawaban yang sama, pertanyaan dibagi menjadi dua jalur:

| Jenis Pertanyaan | Jalur |
| :--- | :--- |
| **Ketentuan tugas**, misalnya teknologi yang diperbolehkan, struktur folder, format pengumpulan, dan penilaian | **Sheets QnA:** *[tautan sheets QnA]* |
| **Kendala teknis kelompok sendiri**, misalnya error, setup, dan penggunaan git | Grup kelompok bersama asisten masing-masing |

Ketentuan:
1. Pertanyaan tentang ketentuan tugas **wajib** diajukan melalui Sheets QnA. Periksa terlebih dahulu apakah pertanyaan serupa sudah dijawab.
2. Jika pertanyaan tentang ketentuan tugas tetap diajukan langsung kepada asisten kelompok, asisten **berhak menolak menjawab** dan meminta kelompok memasukkan pertanyaannya ke Sheets QnA.
3. Jika pertanyaan di Sheets QnA **belum dijawab dalam 24 jam**, kelompok boleh menghubungi asisten kelompok masing-masing. Cantumkan pertanyaan yang sudah diajukan di sheets tersebut.
4. Jawaban pada Sheets QnA berlaku untuk **seluruh kelompok** dan menjadi acuan jika terjadi perbedaan pemahaman.

# BAGIAN B: Laporan Implementasi

Repository: https://github.com/rmdifmedia/IF2150-RPL-K03-G05 (branch `develop`, kode di `src/`, petunjuk menjalankan di `src/README.md`).

Ringkasan teknologi: Node.js + Express 5, EJS, SQLite (`better-sqlite3`), Socket.IO, `bcryptjs`, `express-session`, `express-validator`, `multer`. Arsitektur MVC sesuai DPPL (`models/`, `views/`, `controllers/`, `routes/`, ditambah `middleware/`, `socket/`, `services/`).

## B.1 Perubahan dari DPPL

Tabel B.1. Perubahan dari DPPL

| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Tabel 2.1 - DBMS | PostgreSQL | SQLite lewat `better-sqlite3` (`src/db/lawhub.db`) | Dapat dijalankan lokal tanpa instalasi server basis data, sesuai anjuran A.2 poin 3. |
| 2 | Tabel 2.1 - Frontend | React | EJS (server-side rendering) + CSS + JS biasa | Lebih sederhana untuk MVC pada Express; tidak perlu build frontend terpisah. |
| 3 | C01, C02, C04, C05 (halaman registrasi dan login) | Halaman login terpisah untuk Masyarakat dan Mitra, masing-masing dengan kelas `Page` | Registrasi tetap dua halaman (`registrasi-masyarakat.ejs`, `registrasi-mitra.ejs`). Login memakai `AuthController` yang sama; `/login` untuk Mitra dan Admin, `/login-masyarakat` untuk Masyarakat. Peran dicocokkan dari tabel akun (`Akun.cariByEmail`). | Logika autentikasi identik untuk semua peran, jadi digabung agar tidak duplikat. |
| 4 | C24 RegistrasiMasyarakatController dan C26 RegistrasiMitraController | Dua kelas controller | Satu `RegistrasiController` dengan `prosesMasyarakat()` dan `prosesMitra()` | Alur dan validasi mirip; dipisah per fungsi saja. |
| 5 | C29 SearchLawController | Controller tersendiri | Handler langsung pada `routes/searchLaw.js` (query ke tabel `Peraturan`). Model `DasarHukum` tetap ada. | Logika hanya satu query pencarian sehingga tidak dibuat file controller. |
| 6 | C38 PembayaranController - `bukaSesiChat()` | Controller membuka sesi chat setelah pembayaran lunas | Controller hanya mencatat pembayaran dan menandai `statusPembayaran = 'Lunas'`. Pembukaan chat dijaga di `SesiKonsultasi.izinChat()` / `mulai()` (cek `sudahLunas`). | Pengecekan lunas sebaiknya dekat dengan data sesi supaya berlaku juga untuk socket chat. |
| 7 | C39 PencairanDanaController | `PencairanDanaController` | `PencairanController` (nama dipendekkan), ditambah fitur simpan rekening (`simpanRekening`) | Rekening tujuan harus diisi mitra sebelum bisa mencairkan dana. |
| 8 | PaymentGatewayAdapter (Bab 2.3) | Kelas adapter ke gateway dummy | Modul fungsi `services/PaymentGateway.js` (`prosesPembayaran`, `prosesPencairan`); kartu berawalan `0000` ditolak untuk simulasi gagal | Cukup berupa modul fungsi karena gateway hanya disimulasikan. |
| 9 | C16 LaporanAkunPage / C17 LaporanUlasanPage | Dua halaman laporan | Satu form `laporan/form.ejs`, kategori pelanggaran menyesuaikan peran pelapor | Form hampir sama; perbedaan hanya pada kategori dan kolom `idUlasan`. |
| 10 | C47 Ulasan / Laporan | Satu kelas gabungan pada Tabel 4.1 | Dipecah menjadi `models/Ulasan.js` dan `models/Laporan.js` | Satu model per entitas/tabel. |
| 11 | C42 Admin | Model `Admin` | Tabel `Admin` ada di skema; akses lewat `models/Akun.js` (login) dan `models/LiveChat.js` (status standby). Tidak ada file `Admin.js`. | Operasi Admin lebih banyak berada di controller (verifikasi, moderasi, live chat). |
| 12 | C06 StatusVerifikasiMitraPage | Halaman khusus status verifikasi | Status ditampilkan pada `mitra/EditDokumenLegalitasPage.ejs` dan menjadi syarat akses fitur lewat middleware `wajibMitraTerverifikasi` | Status verifikasi berkaitan langsung dengan dokumen legalitas. |
| 13 | C19 HistoryPage | Satu halaman riwayat | Dua view: `transaksi/riwayat-list.ejs` (daftar) dan `transaksi/riwayat-chat.ejs` (detail sesi dan isi chat) | Daftar dan detail dipisah. |
| 14 | Tabel basis data | Tabel sesuai kelas entitas C40-C51 | Ditambah tabel `PesanChat` (pesan sesi konsultasi dan live chat), `JadwalKetersediaan` (slot waktu mitra), dan `Peraturan` (data peraturan untuk SearchLaw) | Dibutuhkan untuk menyimpan pesan, slot jadwal, dan data pencarian; tidak tergambar pada diagram kelas. |
| 15 | Kolom tambahan pada tabel | - | `MitraPengacara.catatanVerifikasi`, `DokumenLegalitas.jenisDokumen`, `DokumenLegalitas.waktuUnggah`, `Laporan.catatanAdmin`, `Laporan.idAdminPeninjau` (migrasi di `src/modul5.js` dan `schema.sql`) | Menyimpan alasan verifikasi/tolak, jenis dokumen, waktu unggah, dan hasil tinjauan Admin. |
| 16 | Keamanan chat (KNF) | Pesan dienkripsi | Pesan sesi konsultasi dienkripsi AES-256-GCM sebelum disimpan (`SesiKonsultasi.enkripsi/dekripsi`); kunci dari `CHAT_KEY` atau `SESSION_SECRET` | Memenuhi kebutuhan keamanan pesan (KNF10). |
| 17 | Kelas baru (tidak ada di DPPL) | - | `BerandaMitraController` + `DashboardMitra` (beranda/dashboard Mitra), `KasusController` (form kasus HaloLaw), `middleware/auth.js`, `validasi.js`, `upload.js`, `socket/konsultasi.js`, `socket/livechat.js`, `utils/Format.js` | Kebutuhan teknis implementasi (hak akses, validasi, unggah berkas, real-time chat). |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | [Daftar branch](https://github.com/rmdifmedia/IF2150-RPL-K03-G05/branches) dan [graph commit](https://github.com/rmdifmedia/IF2150-RPL-K03-G05/network) | Branch per fitur dengan format `<tipe>/<nama-fitur>`, digabung ke `develop` lewat Pull Request. Contoh: `feat/foundation`, `feat/registrasi-mitra`, `feat/PencarianPasal`, `feat/mitra-profil-jadwal`, `feat/mitra-dokumen-legalitas`, `feat/uc10-Memilih-Mitra-Pengacara`, `feat/uc11-Menanggapi-Sesi-Konsultasi`, `feat/uc12-Melakukan-Sesi-Konsultasi`, `feat/liveChat`, `feat/riwayat-dan-transaksi`, `feat/UC06-VerifikasiMitra`, `feat/UC14-MelaporkanPelanggaranAkun`, `feat/UC17-blokirAkun`, `fix/pulihkan-uc10`. |
| Semantic commit | [Riwayat commit `develop`](https://github.com/rmdifmedia/IF2150-RPL-K03-G05/commits/develop) | Memakai `<tipe>(<scope>): <deskripsi>`, contoh `feat(auth): tambah login, sesi, dan pengecekan peran`, `feat(uc12): implement consultation socket handler`, `fix(laporan): update listKategori based on user pov`, `docs(m9): ganti nama berkas dengan kode kelompok`. Sebagian commit awal belum konsisten formatnya. |
| Track tasks | [Issues](https://github.com/rmdifmedia/IF2150-RPL-K03-G05/issues) / [Projects](https://github.com/rmdifmedia/IF2150-RPL-K03-G05/projects) | Jumlah issue: 23. |
| Pull request dan review | [Daftar PR](https://github.com/rmdifmedia/IF2150-RPL-K03-G05/pulls?q=is%3Apr) | PR yang sudah di-merge antara lain #29 (daftar mitra), #32 dan #47 (UC12 sesi konsultasi), #33 (profil dan jadwal mitra), #37, #43, #49 (SearchLaw), #39 (registrasi mitra), #41 (UC10), #42 (dokumen legalitas), #44 (UC11), #46 (pulihkan UC10), #48 (live chat). |
| Pengujian | `src/tests/` | uji validasi registrasi, `PaymentGateway`, `SesiKonsultasi.slotTersedia`, enkripsi/dekripsi chat |

### B.2.1 Profiling dan Optimasi

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | pencarian SearchLaw (query `LIKE` pada tabel `Peraturan`, `routes/searchLaw.js`) |
| Alat | `EXPLAIN QUERY PLAN` pada SQLite, logging waktu respons, Chrome DevTools Network |
| Temuan (sebelum) |  |
| Perbaikan |  |
| Hasil (sesudah) |  |

## B.3 Kendala dan Catatan Penting

**Cara menjalankan** (lengkap di `src/README.md`):

```bash
cd src
npm install
# buat .env (lihat .env.example): PORT, SESSION_SECRET, DB_PATH
npm run db:init
npm run dev        # http://localhost:3000
```

Opsional: `npm run db:seed-konsultasi` untuk data uji konsultasi. Jika `npm install` gagal pada `better-sqlite3`, pasang build tools sesuai tabel di README.

**Akun uji:**

| Peran | Email | Kata sandi |
| :--- | :--- | :--- |
| Mitra pengacara | `ami@lawhub.test` | `ami657` |
| Masyarakat | `sisi@lawhub.test` | `sisi947` |
| Admin | `admin@lawhub.test` | `admin123` |

Masuk sebagai Mitra/Admin lewat `/login`, sebagai Masyarakat lewat `/login-masyarakat`.

**Known issues dan catatan:**

1. Route HaloLaw (`routes/halolaw.js`, yaitu form kasus dan daftar mitra) dan SearchLaw (`routes/searchLaw.js`) belum didaftarkan di `server.js` pada branch `develop` (hanya `auth`, `masyarakat`, `mitra`, `konsultasi`, `transaksi`, `admin`, `laporan` yang di-`app.use`). Akibatnya tautan `/halolaw/mitra` dari beranda masyarakat dan halaman SearchLaw belum dapat dibuka. 
2. Variabel `DB_PATH` ada di `.env.example` tetapi tidak disebut di langkah `.env` pada README. Variabel opsional `CHAT_KEY` dan `BYPASS_PEMBAYARAN=true` (melewati syarat pembayaran lunas untuk demo chat) dipakai di kode tetapi belum didokumentasikan.
3. Pembayaran dan pencairan dana memakai payment gateway dummy (`services/PaymentGateway.js`): kartu berawalan `0000` ditolak, selain itu berhasil.
4. Mitra yang belum terverifikasi tidak dapat membuka halaman pengajuan/konfirmasi konsultasi (`wajibMitraTerverifikasi`). Verifikasi dilakukan Admin di `/admin/verifikasi`.
5. Sesi yang tidak ditanggapi mitra melewati batas waktu dibatalkan otomatis (`batalkanKedaluwarsa`), dan sesi chat yang tidak aktif ditutup otomatis (`tutupJikaIdle`).
6. Pengujian otomatis belum ada (lihat B.2).
7. Berkas unggahan disimpan di `src/uploads/` (tidak di-commit).
8. Pada pengerjaan UC10 sempat terjadi revert dan pemulihan (PR #46); hasil akhir sudah dipulihkan.

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| 13525003 | Cherinette Corsane Khassyah Purceria | Fondasi aplikasi (Express, struktur folder, skema SQLite dan data uji, sesi dan middleware peran), login (UC02, UC04), profil mitra, jadwal ketersediaan, edit dokumen legalitas (UC05, UC07), README aplikasi | 20%  |
| 13525057 | Raya Medina Farrelin | Landing page, registrasi Masyarakat dan Mitra (UC01, UC03), beranda Masyarakat dan dashboard Mitra, SearchLaw (UC08), form kasus dan daftar Mitra Pengacara HaloLaw (UC09) | 20%  |
| 13525108 | Khasya Nurul Amini | Penjadwalan konsultasi (UC10), tanggapan sesi oleh mitra (UC11), sesi konsultasi via chat real-time dan enkripsi pesan (UC12) | 20%  |
| 13525138 | Cathrine Angel Siburian | Verifikasi pendaftar mitra oleh Admin (UC06), pelaporan pelanggaran dan ulasan (UC14, UC15, UC16), pemblokiran akun (UC17), live chat Masyarakat-Admin (UC19, UC20) | 20%  |
| 13525150 | Livy Chandra | Pembayaran (UC21), ulasan dan rating (UC13), riwayat penanganan (UC18), pencairan dana (UC22), payment gateway dummy | 20%  |

## B.5 Traceability Kelas Perancangan ke Implementasi

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

Semua path relatif terhadap `src/`.

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | RegistrasiMasyarakatPage | View EJS + route | `views/auth/registrasi-masyarakat.ejs`; `routes/auth.js` - `GET/POST /registrasi-masyarakat` | Tombol registrasi menjadi submit form; validasi di `middleware/validasi.js` |
| C02 | LoginMasyarakatPage | View EJS + route | `views/auth/login-masyarakat.ejs`, `public/js/login.js`; `routes/auth.js` - `/login-masyarakat` | `submitVerifikasi()` menjadi `POST /login-masyarakat` |
| C03 | BerandaPage | View EJS | `views/masyarakat/beranda.ejs`, `views/mitra/beranda.ejs`; `routes/masyarakat.js`, `routes/mitra.js` | Beranda per peran |
| C04 | RegistrasiMitraPage | View EJS + route | `views/auth/registrasi-mitra.ejs`; `routes/auth.js` - `GET/POST /registrasi-mitra` | Unggah dokumen lewat `middleware/upload.js` |
| C05 | LoginMitraPage | View EJS + route | `views/auth/login.ejs`; `routes/auth.js` - `/login` | Dipakai juga oleh Admin |
| C06 | StatusVerifikasiMitraPage | View EJS | `views/mitra/EditDokumenLegalitasPage.ejs` | `infoStatus()` menjadi tampilan status verifikasi (lihat B.1 no. 12) |
| C07 | VerifikasiMitraPage | View EJS | `views/admin/verifikasi.ejs`, `views/admin/verifikasi2.ejs` | `ubahStatus()` menjadi form `POST /admin/verifikasi/:idMitra` |
| C08 | EditProfilMitraPage | View EJS | `views/mitra/EditProfilMitraPage.ejs`, `views/mitra/ProfilMitraPage.ejs` | `validasiData()` di sisi controller |
| C09 | EditDokumenLegalitasPage | View EJS | `views/mitra/EditDokumenLegalitasPage.ejs` | `POST /mitra/dokumen` |
| C10 | SearchLawPage | View EJS | `views/searchLaw.ejs`, `public/css/style.css` | `cariPasal()` menjadi form `GET ?q=` |
| C11 | DaftarMitraPengacaraPage | View EJS | `views/halolaw/daftar-mitra.ejs`, `views/halolaw/form-kasus.ejs` | Filter keahlian dan kata kunci menjadi parameter query |
| C12 | PemilihanJadwalKonsultasiPage | View EJS + JS | `views/konsultasi/jadwal.ejs`, `public/js/konsultasi-jadwal.js` | Kalender dan slot diambil lewat `apiKalender` / `apiSlot` |
| C13 | KonfirmasiKonsultasiPage | View EJS | `views/konsultasi/pengajuan.ejs`, `views/konsultasi/konfirmasi.ejs` | `klikKonfirmasi()` menjadi `POST /konsultasi/konfirmasi/:idSesi` |
| C14 | ChatKonsultasiPage | View EJS + JS | `views/konsultasi/chat.ejs`, `public/js/konsultasi-chat.js`, `public/css/konsultasi.css` | `kirimPesan()` lewat Socket.IO |
| C15 | UlasanPage | View EJS | `views/transaksi/ulasan.ejs` | `POST /transaksi/ulasan/:idSesi` |
| C16 | LaporanAkunPage / LaporanUlasanPage | View EJS | `views/laporan/form.ejs`, `public/css/laporan.css` | Digabung (B.1 no. 9) |
| C17 | LaporanUlasanPage | View EJS | `views/laporan/form.ejs` | Idem C16 |
| C18 | TinjauanPage | View EJS | `views/admin/laporan.ejs` | `submitHasil()` / `tolakLaporan()` menjadi `POST /admin/laporan/:idLaporan/blokir` dan `/tolak` |
| C19 | HistoryPage | View EJS | `views/transaksi/riwayat-list.ejs`, `views/transaksi/riwayat-chat.ejs` | Lihat B.1 no. 13 |
| C20 | LiveChatMasyarakatPage | View EJS + JS | `views/livechat/masyarakat.ejs`, `public/js/livechat.js`, `public/css/livechat.css` | `sendMessage()` lewat Socket.IO |
| C21 | LiveChatAdminPage | View EJS + JS | `views/livechat/admin.ejs`, `public/js/livechat.js` | `markAsResolved()` menjadi `POST /admin/livechat/:idChat/selesai` |
| C22 | PembayaranPage | View EJS | `views/transaksi/pembayaran.ejs` | Metode bayar dan nomor kartu dikirim ke `POST /transaksi/pembayaran/:idSesi` |
| C23 | PencairanDanaPage | View EJS | `views/transaksi/pencairan.ejs` | `POST /transaksi/keuangan/cairkan` |
| C24 | RegistrasiMasyarakatController | Fungsi controller | `controllers/RegistrasiController.js` - `prosesMasyarakat` | `buatAkun()`; sandi di-hash dengan `bcryptjs` |
| C25 | AutentikasiController | Fungsi controller | `controllers/AuthController.js` - `prosesLogin`, `logout`; `models/Akun.js` - `cariByEmail`; `middleware/auth.js` | `validasiData()` menjadi pengecekan kredensial dan peran |
| C26 | RegistrasiMitraController | Fungsi controller | `controllers/RegistrasiController.js` - `prosesMitra` | `buatAkunBaru()` + simpan dokumen lewat `DokumenLegalitas` |
| C27 | VerifikasiMitraController | Controller | `controllers/VerifikasiMitraController.js`; `models/verifikasiMitra.js` | Daftar, detail, lihat dokumen, dan `prosesVerifikasi` |
| C28 | ProfilMitraController | Controller | `controllers/ProfilMitraController.js` | Profil, jadwal ketersediaan (tambah/ubah/hapus slot), dan dokumen |
| C29 | SearchLawController | Route handler | `routes/searchLaw.js` - `GET /` | Lihat B.1 no. 5 |
| C30 | PencarianMitraController | Controller | `controllers/PencarianMitraController.js` - `tampil`; `models/MitraPengacara.js` - `cari` | `cariMitraSesuaiKasus()` dan `terapkanFilter()` digabung dalam `tampil` + `cari` |
| C31 | PenjadwalanKonsultasiController | Controller | `controllers/PenjadwalanKonsultasiController.js` - `buatSesiKonsultasi`, `tampilJadwal` | `validasiJadwal()` menjadi `SesiKonsultasi.slotTersedia` |
| C32 | SesiKonsultasiController | Controller + socket | `controllers/SesiKonsultasiController.js` - `prosesKonfirmasi`, `tampilChat`, `akhiriSesi`; `socket/konsultasi.js` | `kelolaPesanChat()` di socket; `validasiStatusPembayaran()` di `SesiKonsultasi.izinChat` |
| C33 | UlasanController | Controller | `controllers/UlasanController.js` - `kirim` | `simpanUlasanBaru()` dan `perbaruiRatingMitra()` dalam transaksi `Ulasan.simpan` |
| C34 | LaporanController | Controller | `controllers/LaporanController.js` - `tampilFormLaporan`, `prosesBuatLaporan` | Validasi peran pelapor dan bukti |
| C35 | ModerasiAkunController | Controller | `controllers/ModerasiAkunController.js` - `prosesTinjauan`, `prosesBlokirAkun`, `tolakLaporan` | `updateStatusLaporan()` dikerjakan di `models/Laporan.js` |
| C36 | RiwayatController | Controller | `controllers/RiwayatController.js` - `daftar`, `detail`; `models/Riwayat.js` | `getRiwayatPengacara/Masyarakat` menjadi `untukMitra` / `untukMasyarakat` |
| C37 | LiveChatController | Controller + socket | `controllers/LiveChatController.js`; `socket/livechat.js` | `assignAdmin()` dan `startChat()` lewat `LiveChat.klaimChatOlehAdmin`, `buatSesiChat` |
| C38 | PembayaranController | Controller | `controllers/PembayaranController.js` - `tampil`, `proses`; `services/PaymentGateway.js` | Lihat B.1 no. 6 dan 8 |
| C39 | PencairanDanaController | Controller | `controllers/PencairanController.js` - `cairkan`, `simpanRekening` | `validasiSaldo()` dan `prosesPencairan()` dalam `cairkan` |
| C40 | Masyarakat | Model + tabel | `models/Masyarakat.js`; tabel `Masyarakat` di `db/schema.sql` | Operasi aktor diwujudkan sebagai route dan controller |
| C41 | MitraPengacara | Model + tabel | `models/MitraPengacara.js`, `models/JadwalKetersediaan.js`, `models/DashboardMitra.js`; tabel `MitraPengacara` | `infoProfil`, `cekKetersediaanJadwal`, `ubahProfil`, `ubahStatusVerifikasi`, `tambahSaldo` di `Pembayaran.simpanHasil` |
| C42 | Admin | Tabel + model parsial | Tabel `Admin`; `models/Akun.js`, `models/LiveChat.js` | Lihat B.1 no. 11 |
| C43 | Kasus | Model + tabel | `models/Kasus.js`; `controllers/KasusController.js` | `buat`, `ubah`, `cariMilik` |
| C44 | DasarHukum | Model + tabel | `models/DasarHukum.js`, `db/dataPasal.js`; tabel `DasarHukum`, `Peraturan` | Pencarian dan `cariById` |
| C45 | DokumenLegalitas | Model + tabel | `models/DokumenLegalitas.js` | `tambahDokumen`, `timpaDokumen`, `cariByMitra` |
| C46 | SesiKonsultasi | Model + tabel | `models/SesiKonsultasi.js` | `buat`, `tanggapi`, `mulai`, `akhiri`, `catatWaktuMulaiSelesai`, `cekStatusPembayaran` |
| C47 | Ulasan / Laporan | Dua model | `models/Ulasan.js`, `models/Laporan.js` | Lihat B.1 no. 10 |
| C48 | Laporan | Model + tabel | `models/Laporan.js` | Pembuatan laporan, detail, dan pembaruan status |
| C49 | Pembayaran | Model + tabel | `models/Pembayaran.js` | `simpanHasil` (transaksi) dan `hitungBiaya` |
| C50 | LiveChat | Model + tabel | `models/LiveChat.js`; tabel `LiveChat`, `PesanChat` | `historyChat` disimpan di `PesanChat` |
| C51 | PencairanDana | Model + tabel | `models/PencairanDana.js` | `ajukan`, `riwayatPencairan`, `profilKeuangan` |
| - | PaymentGatewayAdapter | Modul fungsi | `services/PaymentGateway.js` | Gateway dummy |
