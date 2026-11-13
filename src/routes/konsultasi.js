const router = require('express').Router();
<<<<<<< HEAD
const { wajibLogin, wajibPeran, wajibMitraTerverifikasi } = require('../middleware/auth');
const jadwal = require('../controllers/PenjadwalanKonsultasiController');   // UC10
const sesi = require('../controllers/SesiKonsultasiController');             // UC11, UC12

router.use(wajibLogin);

// untuk UC10: Memilih Mitra Pengacara & Jadwal (masyarakat)
router.get('/jadwal/:idMitra', wajibPeran('masyarakat'), jadwal.tampilJadwal);
router.get('/jadwal/:idMitra/slot', wajibPeran('masyarakat'), jadwal.apiSlot);
router.get('/jadwal/:idMitra/kalender', wajibPeran('masyarakat'), jadwal.apiKalender);
router.post('/jadwal/:idMitra', wajibPeran('masyarakat'), jadwal.buatSesiKonsultasi);
router.get('/saya', wajibPeran('masyarakat'), sesi.daftarSaya);

// untuk UC11: Menanggapi Sesi Konsultasi (mitra)
router.get('/pengajuan', wajibPeran('mitra'), wajibMitraTerverifikasi, sesi.daftarPengajuan);
router.get('/konfirmasi/:idSesi', wajibPeran('mitra'), wajibMitraTerverifikasi, sesi.tampilKonfirmasi);
router.post('/konfirmasi/:idSesi', wajibPeran('mitra'), wajibMitraTerverifikasi, sesi.prosesKonfirmasi);
router.get('/pengajuan/:idSesi', (req, res) => res.redirect(`/konsultasi/konfirmasi/${req.params.idSesi}`)); // URL lama

// untuk UC12: Melakukan Sesi Konsultasi / chat (masyarakat & mitra)
router.get('/chat/:idSesi', wajibPeran('masyarakat', 'mitra'), sesi.tampilChat);
router.post('/chat/:idSesi/akhiri', wajibPeran('masyarakat', 'mitra'), sesi.akhiriSesi);

=======
>>>>>>> parent of fd51505 (feat(uc10): add consultation scheduling routes)
module.exports = router;
