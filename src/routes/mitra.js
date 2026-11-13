const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const beranda = require('../controllers/BerandaMitraController');
const ProfilMitraController = require('../controllers/ProfilMitraController');
const { unggahDokumen } = require('../middleware/upload');
const status = require('../controllers/StatusRegistrasiController');

router.use(wajibLogin, wajibPeran('mitra'));
router.get('/', beranda.tampil);
router.get('/status-verifikasi', status.tampilMitra);
router.get('/profil', ProfilMitraController.lihatProfil);
router.get('/profil/edit', ProfilMitraController.formEditProfil);
router.post('/profil/edit', ProfilMitraController.simpanProfil);
router.post('/jadwal', ProfilMitraController.tambahSlot);
router.post('/jadwal/:idJadwal/ubah', ProfilMitraController.ubahSlot);
router.post('/jadwal/:idJadwal/hapus', ProfilMitraController.hapusSlot);
router.get('/dokumen', ProfilMitraController.formEditDokumen);
router.post('/dokumen', (req, res, next) => {
  unggahDokumen(req, res, (err) => {
    if (err) {
      req.flash('error', err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran dokumen melebihi batas.' : 'Gagal mengunggah dokumen.');
      return res.redirect('/mitra/dokumen');
    }
    next();
  });
}, ProfilMitraController.simpanDokumen);

module.exports = router;