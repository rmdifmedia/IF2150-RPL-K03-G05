<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## LawHub

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

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
Keadilan merupakan hal yang penting untuk melindungi hak individu, menyelesaikan sengketa, dan memastikan bahwa kelompok rentan tidak terpinggirkan. Oleh karena itu, setiap warga berhak mendapatkan perlakuan yang adil dan merata termasuk dalam bidang hukum. Dalam SDG, tujuan nomor 16 mempromosikan perdamaian dan inklusivitas pada masyarakat. Salah satu hal yang dapat dilakukan adalah menyediakan akses keadilan bagi semua. Hal tersebut bertujuan untuk  membantu orang-orang di mana pun untuk hidup bebas tanpa rasa takut pada kekerasan.

## 1.2 Analisis Kondisi Saat Ini
Sayangnya, literasi hukum masyarakat Indonesia masih relatif rendah. Saat ini, sudah terdapat laman untuk membantu masyarakat di bidang hukum seperti bantuanhukum.bphn.go.id. Laman tersebut dapat membantu masyarakat terhadap akses informasi, layanan bantuan hukum, sistem informasi database bantuan hukum, dan kanal informasi dan konsultasi hukum. Namun, beberapa bagian halaman tersebut tidak bekerja dengan seharusnya sehingga menimbulkan kebingungan bagi pengguna. Hal krusial seperti konsultasi seharusnya dapat dijangkau dengan mudah, tetapi warga yang ingin mendapatkan layanan hukum malah kesusahan untuk mendapatkannya. 

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
Perangkat lunak LawHub merupakan sebuah platform layanan konsultasi hukum digital yang dirancang untuk memberikan akses bantuan hukum yang transparan, cepat, dan dapat diakses oleh berbagai kalangan. Dari sudut pandang pengguna, LawHub membantu pengguna menentukan pasal atau dasar-dasar hukum apa yang sesuai dengan kasus yang dialami pengguna. LawHub memiliki dua fitur utama, yaitu fitur HaloLaw dan fitur SearchLaw. 

Pada fitur HaloLaw, platform kami menerapkan model interaksi on-demand consultation selayaknya platform telekesehatan, HaloDoc, untuk diterapkan ke dalam lingkungan hukum (legal tech). Fitur ini memungkinkan pengguna untuk dapat berkonsultasi dengan mitra praktisi hukum melalui chat dalam platform LawHub dengan lebih efisien dan cepat. Sementara fitur SearchLaw memungkinkan pengguna untuk mencari dasar hukum apa saja yang relevan dengan kasus yang dimilikinya. 

Platform LawHub dikembangkan berbasis web (Web-based Application) untuk menjangkau pengguna dari berbagai kalangan. Pemilihan platform web ini didasari oleh pertimbangan efisiensi dan inklusivitas layanan. Dengan sistem web, pengguna dapat mengakses platform secara langsung melalui berbagai perangkat tanpa hambatan teknis seperti kewajiban mengunduh aplikasi yang memakan kapasitas penyimpanan (storage). 

Inovasi inti sekaligus nilai unik dari LawHub terletak pada dua fitur utamanya yaitu, HaloLaw dan SearchLaw. Kedua fitur dan konsep ini memberikan efisiensi biaya dan waktu bagi pengguna yang memiliki suatu kasus hukum tertentu. Dengan ini pengguna dapat memiliki pemahaman awal atas kasus yang dialaminya sebelum membawa kasus tersebut ke ranah yang lebih serius/dalam. 



## 2.2 Asumsi dan Batasan
Asumsi: Sistem ditujukan kepada masyarakat yang membutuhkan bantuan hukum dan firma hukum yang bersedia menangani kasus masyarakat. Pengguna masyarakat diasumsikan memiliki pemahaman hukum yang terbatas, memiliki akses terhadap perangkat dan internet, serta memberikan informasi kasus secara benar. Kasus diasumsikan dapat dikategorikan berdasarkan kelompok atau jenis permasalahan hukum. Firma hukum yang tergabung diasumsikan memiliki kompetensi dan kewenangan untuk menangani kasus yang dipilih.

Batasan: Sistem hanya berperan sebagai media pengaduan, penyedia informasi, konsultasi awal, dan penghubung antara masyarakat dengan firma hukum. Informasi hukum yang diberikan bukan merupakan pengganti nasihat atau pendampingan hukum secara menyeluruh. Sistem tidak menentukan hasil perkara, menjamin kasus akan ditangani oleh firma hukum, maupun menjamin keberhasilan kasus. Penggunaan sistem juga dibatasi oleh regulasi yang berlaku termasuk ketentuan terkait praktik hukum dan perlindungan data pribadi. Pengguna yang tidak memiliki perangkat atau akses internet tidak dapat menggunakan sistem secara langsung.

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
| Aktor | Deskripsi |
| :--- | :--- |
| Mitra Pengacara | Praktisi hukum yang mendaftar sebagai pengacara HaloLaw untuk menerima dan menanggapi permintaan konsultasi dari klien. Karakteristik dari aktor ini adalah berorientasi profesional dan mengutamakan rating baik dari klien sebagai modal utama mendapatkan kepercayaan di platform.|
| Masyarakat | Pengguna umum yang secara aktif menggunakan fitur SearchLaw untuk mencari dasar hukum dan fitur HaloLaw untuk berkonsultasi langsung dengan pengacara. Aktor ini umumnya awam terhadap istilah hukum sehingga mengutamakan kemudahan bahasa dan kepercayaan terhadap pengacara yang dipilih.|
| Admin | Melayani pengguna melalui live chat, memverifikasi legalitas mitra pengacara, serta menindaklanjuti laporan dan melakukan suspend/ban terhadap mitra ataupun akun pengguna yang melanggar aturan. Karakteristik dari aktor ini adalah berperan sebagai penjaga kualitas dan keamanan platform, bukan pengguna fitur hukum.|



## 3.2 Kebutuhan Pengguna Awal
| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | Masyarakat | Membuat akun baru dengan mengisi data diri | Memiliki akun terdaftar agar dapat mengakses fitur LawHub |
| US-02 | Masyarakat | Log In dengan akun yang sudah terdaftar | Mengakses LawHub kembali tanpa riwayat penggunaan sebelumnya terhapus |
| US-03 | Masyarakat | Mencari pasal atau dasar hukum dengan memasukkan kata kunci kasus yang dialami | Mendapatkan pemahaman secara cepat dan tepat tanpa harus mencari dari berbagai sumber secara manual |
| US-04 | Masyarakat | Mencari pengacara atau konsultan hukum sesuai dengan kebutuhan dan preferensi | Memilih pengacara yang paling sesuai dengan kebutuhan dan anggaran|
| US-05 | Masyarakat | Berkonsultasi dengan konsultan secara live, baik melalui telefon atau chat dalam platform | Mendapat penjelasan lebih lanjut terkait kasus yang sedang dialami |
| US-06 | Masyarakat | Memberikan ulasan, feedback, rating, dan/atau laporan/pelanggaran mengenai konsultan setelah sesi konsultasi  | Membantu klien lain menilai kredibilitas pengacara serta memberi masukan kualitas layanan|
| US-07 | Mitra Pengacara | Mendaftar akun dengan melampirkan dokumen legalitas dan identitas diri atau firma | Memiliki akun yang terverifikasi kelayakannya sebelum melayani masyarakat |
| US-08 | Mitra Pengacara | Menerima dan menanggapi permintaan konsultasi dari klien secara real-time | Dapat memberikan layanan konsultasi secara cepat dan terorganisir |
| US-09 | Mitra Pengacara | Melihat riwayat dan ringkasan seluruh sesi konsultasi yang pernah ditangani | Memudahkan dokumentasi kasus dan tindak lanjut bila klien kembali berkonsultasi |
| US-10 | Admin | Memverifikasi dokumen legalitas atau lisensi praktik mitra pengacara yang baru mendaftar sebelum akun diaktifkan | Memastikan mitra yang akan melayani masyarakat kredibel |
| US-11 | Admin | Melayani pertanyaan dan kendala pengguna melalui live chat dalam platform | Membantu pengguna menyelesaikan masalah teknis maupun non-teknis dengan cepat |
| US-12 | Admin | Meninjau laporan yang diajukan pengguna terhadap akun lain, baik akun masyarakat maupun mitra pengacara | Memastikan akun yang akan dinonaktifkan benar melanggar aturan |
| US-13 | Admin | Melakukan suspend atau ban terhadap akun yang terbukti melanggar ketentuan platform, baik akun masyarakat maupun mitra pengacara | Menjaga ekosistem platform tetap aman dan tepercaya bagi seluruh pengguna |
| US-14 | Sistem | Menyimpan data akun pengguna ke dalam database | Menyimpan data dan riwayat pengguna |
| US-15 | Sistem | Memfilter data yang ada agar sesuai dengan kata kunci yang di input | Menampilkan hasil pencarian yang sudah di filter sesuai dengan kata kunci | 
| US-16 | Sistem | Menyimpan data proses dan hasil konsultasi serta feedback pengguna | Menampilkan riwayat konsultasi pengguna (pada interface mitra) dan feedback |
| US-17 | Sistem | Membuat daftar seluruh akun Mitra terdaftar | Menampilkan seluruh akun mitra yang terdaftar |



## 3.3 Deskripsi Aktivitas
| ID | Aktivitas | Penjelasan | ID User Story |
| :--- | :--- | :--- | :--- |
| A01 | Pembuatan Akun Biasa | Membuat akun pribadi untuk digunakan dalam website | US-01 |
| A02 | Pembuatan Akun Mitra | Membuat akun mitra untuk digunakan dalam website | US-07 |
| A03 | Verifikasi Akun MItra | Admin memverifikasi dokumen legalitas atau lisensi praktik mitra pengacara yang mendaftar | US-10 |
| A04 | Akun Terdaftar | Sistem menyimpan informasi akun ke dalam database | US-14 |
| A05 | Gagal Membuat Akun Mitra | Saat data dan dokumen esensial milik akun calon mitra tidak memenuhi kriteria, akun mitra gagal dibuat | US-10 |
| A06 | Login ke Akun Terdaftar | Masuk ke akun yang sudah dibuat dan diverifikasi | US-02 |
| A07 | Mencari Pasal Sesuai | Pengguna mencari pasal atau dasar hukum dengan memasukkan kata kunci kasus yang dialami | US-03 |
| A08 | Menampilkan Pasal yang Relevan | Sistem memfilter data yang ada agar sesuai dengan kata kunci dan menampilkan hasil pencarian yang sudah di filter | US-15 |
| A09 | Menampilkan Daftar Mitra | Sistem menampilkan daftar seluruh mitra yang terdaftar | US-17 |
| A10 | Mencari Konsultan | Pengguna mencari konsultan yang sesuai dan cocok secara manual berdasarkan deskripsi masing-masing konsultan | US-04 |
| A11 | Konsultasi Diterima | Mitra terpilih menerima konsultasi yang diajukan pengguna | US-08 |
| A12 | Pelaksanaan Konsultasi | Konsultasi dilakukan secara live, baik melalui telepon atau chat dalam platform | US-05 |
| A13 | Feedback Konsultasi | Pengguna memberikan ulasan, feedback, dan/atau rating kepada konsultan setelah sesi konsultasi | US-06 |
| A14 | Pengiriman Laporan | Pengguna atau Mitra melaporkan pelanggaran yang terjadi saat/setelah konsultasi berlangsung | US-06 |
| A15 | Laporan Diproses | Admin meninjau laporan yang diajukan pengguna terhadap akun lain, baik akun masyarakat maupun mitra pengacara | US-12 |
| A16 | Tindak Lanjut Laporan | Admin melakukan suspend atau ban terhadap akun yang terbukti melanggar ketentuan platform, baik akun masyarakat maupun mitra pengacara | US-13 |
| A17 | Menyimpan Riwayat Konsultasi dan Feedback | Sistem menyimpan data proses dan hasil konsultasi serta feedback pengguna | US-16 |
| A18 | Lihat History Konsultasi | Mitra dapat melihat riwayat dan ringkasan seluruh sesi konsultasi yang pernah ditangani | US-09 |
| A19 | Feedback Ditampilkan | Feedback yang diberikan pengguna akan muncul pada profil Mitra sebagai informasi tambahan | US-04 |
| A20 | Live Chat Admin | Pengguna dapat mengkonsultasikan masalah teknis dan/atau non-teknis yang dialami selama menggunakan LawHub | US-11 |

## 3.4 Model Proses Bisnis
<p align="center">
<img alt="Gambar Diagram Pembuatan Akun" src="./assets/diagram/Diagram Pembuatan Akun.jpg" width="70%">
</p>
<p align="center">
<i>Gambar 1. Gambar Diagram Pembuatan Akun</i>
</p>

<p align="center">
<img alt="Gambar Diagram Fitur SearchLaw" src="./assets/diagram/Diagram SearchLaw.jpg" width="70%">
</p>
<p align="center">
<i>Gambar 2. Gambar Diagram Fitur SearchLaw</i>
</p>

<p align="center">
<img alt="Gambar Diagram Fitur HaloLaw" src="./assets/diagram/Diagram HaloLaw.jpg" width="70%">
</p>
<p align="center">
<i>Gambar 3. Gambar Diagram Fitur HaloLaw</i>
</p>

<p align="center">
<img alt="Gambar Diagram Pengiriman Laporan" src="./assets/diagram/Diagram Pengiriman Laporan.jpg" width="70%">
</p>
<p align="center">
<i>Gambar 4. Gambar Diagram Pengiriman Laporan</i>
</p>

<p align="center">
<img alt="Gambar Diagram Live Chat" src="./assets/diagram/Diagram LiveChat.jpg" width="70%">
</p>
<p align="center">
<i>Gambar 5. Gambar Diagram Live Chat</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
- SDG 16: https://www.un.org/sustainabledevelopment/peace-justice/ 
- Website bantuan hukum: https://bantuanhukum.bphn.go.id/
- Aksesibilitas bantuan hukum masyarakat: https://ombudsman.go.id/artikel/r/artikel--aksesibilitas-bantuan-hukum-kepada-masyarakat-tidak-mampu 
