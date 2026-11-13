const router = require('express').Router();
module.exports = router;

const { wajibLogin, wajibPeran } = require('../middleware/auth');
const pembayaran = require('../controllers/PembayaranController');
const ulasan = require('../controllers/UlasanController');
const riwayat = require('../controllers/RiwayatController');
const pencairan = require('../controllers/PencairanController');

router.use(wajibLogin);

// Pembayaran & ulasan (Masyarakat)
router.get('/pembayaran/:idSesi', wajibPeran('masyarakat'), pembayaran.tampil);
router.post('/pembayaran/:idSesi', wajibPeran('masyarakat'), pembayaran.proses);
router.get('/ulasan/:idSesi', wajibPeran('masyarakat'), ulasan.tampil);
router.post('/ulasan/:idSesi', wajibPeran('masyarakat'), ulasan.kirim);

// Riwayat (Masyarakat & Mitra)
router.get('/riwayat', wajibPeran('masyarakat', 'mitra'), riwayat.daftar);
router.get('/riwayat/:idSesi', wajibPeran('masyarakat', 'mitra'), riwayat.detail);

// Keuangan & pencairan dana (Mitra)
router.get('/keuangan', wajibPeran('mitra'), pencairan.tampil);
router.post('/keuangan/rekening', wajibPeran('mitra'), pencairan.simpanRekening);
router.post('/keuangan/cairkan', wajibPeran('mitra'), pencairan.cairkan);

module.exports = router;