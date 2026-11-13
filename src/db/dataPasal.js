const NAMA_JENIS = {
  UU: 'Undang-Undang',
  PP: 'Peraturan Pemerintah',
  Permenkeu: 'Peraturan Menteri Keuangan',
  Permenkumham: 'Peraturan Menteri Hukum dan Hak Asasi Manusia',
};

// [jenis, nomor, tahun, judul, slug (kosong = otomatis untuk UU), status (kosong = 'Berlaku')]
const daftar = [
  // ---- Undang-Undang ----
  ['UU', '1', 2026, 'Penyesuaian Pidana'],
  ['UU', '2', 2026, 'Pelindungan Pekerja Rumah Tangga'],
  ['UU', '3', 2026, 'Pelindungan Saksi dan Korban'],
  ['UU', '4', 2026, 'Perubahan atas Undang-Undang Nomor 4 Tahun 2023 tentang Pengembangan dan Penguatan Sektor Keuangan'],
  ['UU', '5', 2026, 'Perubahan Ketiga atas Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia'],
  ['UU', '2', 2025, 'Perubahan Keempat atas Undang-Undang Nomor 4 Tahun 2009 tentang Pertambangan Mineral dan Batubara'],
  ['UU', '5', 2025, 'Kota Gorontalo Provinsi Gorontalo'],
  ['UU', '6', 2025, 'Kabupaten Buton di Provinsi Sulawesi Tenggara'],
  ['UU', '7', 2025, 'Kabupaten Kolaka di Provinsi Sulawesi Tenggara'],
  ['UU', '8', 2025, 'Kabupaten Konawe di Provinsi Sulawesi Tenggara'],
  ['UU', '9', 2025, 'Kabupaten Muna di Provinsi Sulawesi Tenggara'],
  ['UU', '12', 2025, 'Kabupaten Minahasa di Provinsi Sulawesi Utara'],
  ['UU', '18', 2025, 'Perubahan Ketiga atas Undang-Undang Nomor 10 Tahun 2009 tentang Kepariwisataan'],
  ['UU', '20', 2025, 'Kitab Undang-Undang Hukum Acara Pidana'],

  // ---- Peraturan Pemerintah ----
  ['PP', '58', 2023, 'Tarif Pemotongan Pajak Penghasilan Pasal 21 atas Penghasilan sehubungan dengan Pekerjaan, Jasa, atau Kegiatan Wajib Pajak Orang Pribadi', 'pp-no-58-tahun-2023'],

  // ---- Peraturan Menteri Keuangan ----
  ['Permenkeu', '6', 2026, 'Pajak Penghasilan Pasal 21 atas Penghasilan yang Diterima dan/atau Diperoleh Peserta Pemagangan Lulusan Perguruan Tinggi yang Ditanggung Pemerintah Tahun Anggaran 2026', 'permenkeu-no-6--tahun-2026'],
  ['Permenkeu', '10', 2025, 'Pajak Penghasilan Pasal 21 atas Penghasilan Tertentu yang Ditanggung Pemerintah dalam Rangka Stimulus Ekonomi Tahun Anggaran 2025', 'permenkeu-no-10--tahun-2025'],
  ['Permenkeu', '51', 2025, 'Pemungutan Pajak Penghasilan Pasal 22 sehubungan dengan Pembayaran atas Penyerahan Barang dan Kegiatan di Bidang Impor atau Kegiatan Usaha di Bidang Lain', 'permenkeu-no-51--tahun-2025'],
  ['Permenkeu', '72', 2025, 'Perubahan atas Peraturan Menteri Keuangan Nomor 10 Tahun 2025 tentang Pajak Penghasilan Pasal 21 atas Penghasilan Tertentu yang Ditanggung Pemerintah dalam Rangka Stimulus Ekonomi Tahun Anggaran 2025', 'permenkeu-no-72--tahun-2025'],
  ['Permenkeu', '105', 2025, 'Pajak Penghasilan Pasal 21 atas Penghasilan Tertentu yang Ditanggung Pemerintah dalam Rangka Stimulus Ekonomi Tahun Anggaran 2026', 'permenkeu-no-105--tahun-2025'],
  ['Permenkeu', '41/PMK.010/2022', 2022, 'Perubahan Kedua atas Peraturan Menteri Keuangan Nomor 34/PMK.010/2017 tentang Pemungutan Pajak Penghasilan Pasal 22 sehubungan dengan Pembayaran atas Penyerahan Barang dan Kegiatan di Bidang Impor atau Kegiatan Usaha di Bidang Lain', 'permenkeu-no-41-pmk-010-2022-tahun-2022'],

  // ---- Peraturan Menteri Hukum dan HAM ----
  ['Permenkumham', '13', 2023, 'Tata Cara Permohonan Surat Keterangan Keimigrasian bagi Anak dalam Pasal 3A Ayat (1) Peraturan Pemerintah Nomor 21 Tahun 2022 tentang Perubahan atas Peraturan Pemerintah Nomor 2 Tahun 2007 tentang Tata Cara Memperoleh, Kehilangan, Pembatalan, dan Memperoleh Kembali Kewarganegaraan Indonesia', 'permenkumham-no-13-tahun-2023'],
];

module.exports = daftar.map(([jenis, nomor, tahun, judul, slug, status]) => ({
  jenisPeraturan: jenis,
  nomor,
  tahun,
  judul,
  deskripsi: `${NAMA_JENIS[jenis]} Nomor ${nomor} Tahun ${tahun} tentang ${judul}.`,
  status: status || 'Berlaku',
  linkPDF: `https://peraturan.go.id/id/${slug || `${jenis.toLowerCase()}-no-${nomor}-tahun-${tahun}`}`,
}));