const express = require('express');
const router = express.Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const LaporanController = require('../controllers/LaporanController');

router.use(wajibLogin, wajibPeran('masyarakat', 'mitra'));

router.get('/buat', LaporanController.tampilFormLaporan);
router.post('/buat', LaporanController.prosesBuatLaporan);

module.exports = router;