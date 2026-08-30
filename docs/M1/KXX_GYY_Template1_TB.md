<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *Nama Perangkat Lunak*

### Untuk: *[Mikha]*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *\[K03\]* |
| Kelompok | *\[G05\]*  |

| NIM | Nama |
|---|---|
| *[13525057]* | *[Raya Medina Farrelin]* |
| *[13525003]* | *[Cherinette Corsane Khassyah Purceria]* |
| *[13525108]* | *[Khasya Nurul Amini]* |
| *[13525150]* | *[Livy Chandra]* |
| *[13525138]* | *[Cathrine Angel Siburian]* |
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
Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor | Deskripsi |
| :--- | :--- |
| *Kasir* | *Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memproses transaksi harian dan melayani pembayaran pelanggan. Karakteristik dari pengguna ini adalah mengutamakan kecepatan dan keakuratan saat bertransaksi.* |
| ... | ... |


## 3.2 Kebutuhan Pengguna Awal
Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format *User Story* (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | *Kasir* |  *Memindai barcode barang* | *Proses pembayaran berjalan cepat dan akurat* |
| US-02 | *[Nama Aktor]* | *[Kebutuhan pengguna]* | *[Tujuan yang dicapai pengguna]* |
| ... | ... | ... | ... |

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
