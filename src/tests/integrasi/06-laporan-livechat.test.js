// Pengujian integrasi: laporan pelanggaran, moderasi/pemblokiran akun, dan live chat.
// Antarmuka: I-10 (LaporanController -> Laporan), I-11 (ModerasiAkunController -> Laporan),
//            I-13 (LiveChatController -> LiveChat),
//            I-20 (klien Socket.IO -> socket/livechat.js -> LiveChat/PesanChat)
const { siapkanLingkungan, login, sambungSocket, tungguEvent } = require('./helpers/lingkungan');

let L;
let sisi;
let tono;
let admin;
const id = {};
const laporan = (idLaporan) => L.db.prepare('SELECT * FROM Laporan WHERE idLaporan = ?').get(idLaporan);
const statusAkunMitra = (idMitra) => L.db.prepare('SELECT statusAkun FROM MitraPengacara WHERE idMitra = ?').get(idMitra).statusAkun;

beforeAll(async () => {
  L = await siapkanLingkungan();
  sisi = await login(L.url, 'sisi@lawhub.test', 'sisi947', '/login-masyarakat');
  tono = await login(L.url, 'tono@lawhub.test', 'tono123', '/login-masyarakat');
  admin = await login(L.url, 'admin@lawhub.test', 'admin123');
  id.sisi = L.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'sisi'").get().idMasyarakat;
  id.tono = L.db.prepare("SELECT idMasyarakat FROM Masyarakat WHERE username = 'tono'").get().idMasyarakat;
  id.budi = L.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'budi'").get().idMitra;
  id.citra = L.db.prepare("SELECT idMitra FROM MitraPengacara WHERE username = 'citra'").get().idMitra;
});
afterAll(async () => { await L.bersihkan(); });

describe('I-10 LaporanController -> Model Laporan', () => {
  test('INT-TC43 Normal: laporan pelanggaran akun tersimpan berstatus menunggu', async () => {
    const res = await sisi.post('/laporan/buat').send({
      peranTerlapor: 'mitra', idTerlapor: String(id.budi),
      jenisPelanggaran: 'Bahasa kasar', deskripsi: 'Mitra memakai kata-kata kasar saat konsultasi.',
    });
    expect(res.headers.location).toBe('/masyarakat');

    const baris = L.db.prepare('SELECT * FROM Laporan WHERE idPelapor = ? AND idTerlapor = ?').get(id.sisi, id.budi);
    expect(baris).toMatchObject({
      peranPelapor: 'masyarakat', peranTerlapor: 'mitra', jenisPelanggaran: 'Bahasa kasar', statusLaporan: 'menunggu',
    });
    id.laporanBudi = baris.idLaporan;
  });

  test('INT-TC44 Gagal: laporan tanpa deskripsi ditolak dan tidak tersimpan', async () => {
    const sebelum = L.db.prepare('SELECT COUNT(*) AS n FROM Laporan').get().n;
    await sisi.post('/laporan/buat').send({
      peranTerlapor: 'mitra', idTerlapor: String(id.citra), jenisPelanggaran: 'Penipuan', deskripsi: '   ',
    });
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Laporan').get().n).toBe(sebelum);
  });

  // fixture: ulasan dari sisi untuk mitra ami (laporan ulasan, UC16)
  const buatUlasan = (username) => {
    const idM = L.db.prepare('SELECT idMitra FROM MitraPengacara WHERE username = ?').get(username).idMitra;
    return L.db.prepare('INSERT INTO Ulasan (idMasyarakat, idMitra, skorRating, teksUlasan) VALUES (?, ?, 1, ?)')
      .run(id.sisi, idM, 'Ulasan tidak relevan untuk diuji').lastInsertRowid;
  };

  test('INT-TC52 Normal: mitra melaporkan ulasan pada profilnya, laporan tersimpan dengan idUlasan', async () => {
    const idUlasan = buatUlasan('ami');
    const ami = await login(L.url, 'ami@lawhub.test', 'ami657');
    const res = await ami.post('/laporan/buat').send({
      idUlasan: String(idUlasan), jenisPelanggaran: 'Ulasan tidak relevan', deskripsi: 'Ulasan tidak sesuai isi konsultasi.',
    });
    expect(res.headers.location).toBe('/mitra');

    const baris = L.db.prepare('SELECT * FROM Laporan WHERE idUlasan = ?').get(idUlasan);
    expect(baris).toMatchObject({
      peranPelapor: 'mitra', peranTerlapor: 'masyarakat', idTerlapor: id.sisi, statusLaporan: 'menunggu',
    });
  });

  test('INT-TC53 Gagal: mitra tidak dapat melaporkan ulasan milik mitra lain', async () => {
    const idUlasan = buatUlasan('dimas');
    const ami = await login(L.url, 'ami@lawhub.test', 'ami657');
    await ami.post('/laporan/buat').send({
      idUlasan: String(idUlasan), jenisPelanggaran: 'Ulasan tidak relevan', deskripsi: 'Mencoba melaporkan ulasan orang lain.',
    });
    expect(L.db.prepare('SELECT COUNT(*) AS n FROM Laporan WHERE idUlasan = ?').get(idUlasan).n).toBe(0);
    expect((await ami.get('/mitra')).text).toContain('Ulasan tidak ditemukan atau Anda tidak memiliki akses');
  });
});

describe('I-11 ModerasiAkunController -> Model Laporan (pemblokiran akun)', () => {
  test('INT-TC45 Normal: admin menyetujui laporan, akun terlapor diblokir dan tidak bisa login', async () => {
    const res = await admin.post(`/admin/laporan/${id.laporanBudi}/blokir`).send({ catatan: 'Terbukti melanggar.' });
    expect(res.headers.location).toBe('/admin/laporan');

    expect(laporan(id.laporanBudi)).toMatchObject({ statusLaporan: 'disetujui', catatanAdmin: 'Terbukti melanggar.' });
    expect(statusAkunMitra(id.budi)).toBe('diblokir');

    const coba = await login(L.url, 'budi@lawhub.test', 'budi123');
    expect(coba.resLogin.headers.location).toBe('/login');
    expect((await coba.get('/login')).text).toContain('Akun Anda diblokir');
  });

  test('INT-TC46 Gagal: laporan yang sudah ditinjau tidak dapat diproses ulang', async () => {
    await admin.post(`/admin/laporan/${id.laporanBudi}/tolak`).send({ catatan: 'ubah keputusan' });
    expect(laporan(id.laporanBudi).statusLaporan).toBe('disetujui');
    expect((await admin.get('/admin/laporan')).text).toContain('Laporan ini sudah pernah ditinjau sebelumnya.');
  });

  test('INT-TC47 Normal: admin menolak laporan, status ditolak dan akun terlapor tetap aktif', async () => {
    await sisi.post('/laporan/buat').send({
      peranTerlapor: 'mitra', idTerlapor: String(id.citra), jenisPelanggaran: 'Spam', deskripsi: 'Mengirim promosi berulang.',
    });
    const idLaporan = L.db.prepare('SELECT idLaporan FROM Laporan WHERE idTerlapor = ? ORDER BY idLaporan DESC').get(id.citra).idLaporan;

    await admin.post(`/admin/laporan/${idLaporan}/tolak`).send({ catatan: 'Bukti kurang.' });
    expect(laporan(idLaporan).statusLaporan).toBe('ditolak');
    expect(statusAkunMitra(id.citra)).toBe('aktif');
  });
});

describe('I-20 Klien Socket.IO -> socket/livechat.js dan I-13 LiveChatController -> LiveChat', () => {
  test('INT-TC48 Normal: pesan masyarakat membuat sesi live chat, admin menerima dan membalas secara real-time', async () => {
    const sockMasy = await sambungSocket(L.url, sisi.cookie);
    const sockAdmin = await sambungSocket(L.url, admin.cookie);
    try {
      const dibuat = tungguEvent(sockMasy, 'sesi_dibuat');
      const masukAntrean = tungguEvent(sockAdmin, 'admin:antrean_update');
      sockMasy.emit('kirim_pesan', { isiPesan: 'Saya tidak bisa membuka halaman pembayaran.' });

      const { idChat } = await dibuat;
      expect((await masukAntrean).pesanTerakhir).toBe('Saya tidak bisa membuka halaman pembayaran.');
      expect(L.db.prepare('SELECT * FROM LiveChat WHERE idChat = ?').get(idChat))
        .toMatchObject({ idMasyarakat: id.sisi, statusChat: 'menunggu' });
      id.chat = idChat;

      // admin membalas: chat diklaim admin dan status menjadi berlangsung
      sockAdmin.emit('gabung_chat', { idChat });
      const balasan = tungguEvent(sockMasy, 'pesan_baru', (p) => p.peranPengirim === 'admin');
      sockAdmin.emit('kirim_pesan', { idChat, isiPesan: 'Silakan muat ulang halaman, lalu coba lagi.' });
      expect(await balasan).toMatchObject({ peranPengirim: 'admin', isiPesan: 'Silakan muat ulang halaman, lalu coba lagi.' });

      const chat = L.db.prepare('SELECT * FROM LiveChat WHERE idChat = ?').get(idChat);
      expect(chat.statusChat).toBe('berlangsung');
      expect(chat.idAdmin).not.toBeNull();
      expect(L.db.prepare('SELECT COUNT(*) AS n FROM PesanChat WHERE idChat = ?').get(idChat).n).toBe(2);
    } finally {
      sockMasy.close();
      sockAdmin.close();
    }
  });

  test('INT-TC49 Normal: admin menyelesaikan sesi live chat, status tersimpan selesai', async () => {
    const res = await admin.post(`/admin/livechat/${id.chat}/selesai`);
    expect(res.headers.location).toBe('/admin/livechat');
    const chat = L.db.prepare('SELECT * FROM LiveChat WHERE idChat = ?').get(id.chat);
    expect(chat.statusChat).toBe('selesai');
    expect(chat.waktuChatSelesai).not.toBeNull();
  });

  test('INT-TC50 Gagal: saat tidak ada admin standby, pesan ditolak dan sesi live chat tidak dibuat', async () => {
    await admin.post('/admin/livechat/standby');   // ubah status admin menjadi tidak standby
    expect(L.db.prepare("SELECT statusStandby FROM Admin WHERE email = 'admin@lawhub.test'").get().statusStandby).toBe(0);

    const sock = await sambungSocket(L.url, tono.cookie);
    try {
      const galat = tungguEvent(sock, 'pesan_error');
      sock.emit('kirim_pesan', { isiPesan: 'Halo admin?' });
      expect(await galat).toContain('Belum ada Admin yang standby');
      expect(L.db.prepare('SELECT COUNT(*) AS n FROM LiveChat WHERE idMasyarakat = ?').get(id.tono).n).toBe(0);
    } finally {
      sock.close();
    }
  });
});
