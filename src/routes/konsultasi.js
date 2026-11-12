const router = require('express').Router();
const { wajibLogin, wajibPeran, wajibMitraTerverifikasi } = require('../middleware/auth');
const jadwal = require('../controllers/PenjadwalanKonsultasiController');// ini buat UC10
const sesi = require('../controllers/SesiKonsultasiController');         // ini buatUC11, UC12

router.use(wajibLogin);

// untuk UC10: Memilih Mitra Pengacara & Jadwal (masyarakat)
router.get('/jadwal/:idMitra', wajibPeran('masyarakat'), jadwal.tampilJadwal);
router.get('/jadwal/:idMitra/slot', wajibPeran('masyarakat'), jadwal.apiSlot);
router.get('/jadwal/:idMitra/kalender', wajibPeran('masyarakat'), jadwal.apiKalender);
router.post('/jadwal/:idMitra', wajibPeran('masyarakat'), jadwal.buatSesiKonsultasi);
router.get('/saya', wajibPeran('masyarakat'), sesi.daftarSaya);

// untuk UC11: Menanggapi Sesi Konsultasi (mitra)
router.get('/pengajuan', wajibMitraTerverifikasi, sesi.daftarPengajuan);
router.get('/pengajuan/:idSesi', wajibMitraTerverifikasi, sesi.tampilKonfirmasi);
router.post('/pengajuan/:idSesi', wajibMitraTerverifikasi, sesi.prosesKonfirmasi);

// untuk UC12: Melakukan Sesi Konsultasi / chat (masyarakat & mitra)
router.get('/chat/:idSesi', wajibPeran('masyarakat', 'mitra'), sesi.tampilChat);
router.post('/chat/:idSesi/akhiri', wajibPeran('masyarakat', 'mitra'), sesi.akhiriSesi);

module.exports = router;