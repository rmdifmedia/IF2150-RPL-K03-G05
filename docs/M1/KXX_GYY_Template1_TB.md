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


(Main idea) Membuat perangkat lunak sebagai wadah konsultasi hukum. Konsultasi tersebut dibagi menjadi dua, yaitu konsultasi hukum secara langsung bersama pengacara dan konsultasi melalui search engine.

## 2.2 Asumsi dan Batasan
Definisikan secara tegas asumsi (baik teknis maupun dari sisi pengguna) yang menjadi dasar pengembangan. Tuliskan batasan seperti regulasi/hukum, keterbatasan sumber daya, dan ruang lingkup solusi.

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
| US-06 | Masyarakat | Memberikan ulasan, feedback, dan/atau rating kepada konsultan setelah sesi konsultasi  | Membantu klien lain menilai kredibilitas pengacara serta memberi masukan kualitas layanan|
| US-07 | Mitra Pengacara | Mendaftar akun dengan melampirkan dokumen legalitas dan identitas diri atau firma | Memilii akun yang terverifikasi kelayakannya sebelum melayani masyarakat |
| US-08 | Mitra Pengacara | Menerima dan menanggapi permintaan konsultasi dari klien secara real-time | Dapat memberikan layanan konsultasi secara cepat dan terorganisir |
| US-09 | Mitra Pengacara | Melihat riwayat dan ringkasan seluruh sesi konsultasi yang pernah ditangani | Memudahkan dokumentasi kasus dan tindak lanjut bila klien kembali berkonsultasi |
| US-10 | Admin | Memverifikasi dokumen legalitas atau lisensi praktik mitra pengacara yang baru mendaftar sebelum akun diaktifkan | Memastikan mitra yang akan melayani masyarakat kredibel |
| US-11 | Admin | Melayani pertanyaan dan kendala pengguna melalui live chat dalam platform | Membantu pengguna menyelesaikan masalah teknis maupun non-teknis dengan cepat |
| US-12 | Admin | Meninjau laporan yang diajukan pengguna terhadap akun lain, baik akun masyarakat maupun mitra pengacara | Memastikan akun yang akan dinonaktifkan benar melanggar aturan |
| US-13 | Admin | Melakukan suspend atau ban terhadap akun yang terbukti melanggar ketentuan platform, baik akun masyarakat maupun mitra pengacara | Menjaga ekosistem platform tetap aman dan tepercaya bagi seluruh pengguna |



## 3.3 Model Proses Bisnis
Buatlah *Activity Diagram* atau *Swimlane Diagram* yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/diagram-act-1.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Contoh Activity Diagram</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
- SDG 16: https://www.un.org/sustainabledevelopment/peace-justice/ 
- Website bantuan hukum: https://bantuanhukum.bphn.go.id/
- Aksesibilitas bantuan hukum masyarakat: https://ombudsman.go.id/artikel/r/artikel--aksesibilitas-bantuan-hukum-kepada-masyarakat-tidak-mampu 
