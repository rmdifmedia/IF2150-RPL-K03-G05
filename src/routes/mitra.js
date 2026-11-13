const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const ProfilMitraController = require('../controllers/ProfilMitraController');

router.use(wajibLogin, wajibPeran('mitra'));
router.get('/', (req, res) => res.send('Dashboard mitra (placeholder)'));

router.get('/profil', ProfilMitraController.lihatProfil);
router.get('/profil/edit', ProfilMitraController.formEditProfil);
router.post('/profil/edit', ProfilMitraController.simpanProfil);
router.post('/jadwal', ProfilMitraController.tambahSlot);
router.post('/jadwal/:idJadwal/ubah', ProfilMitraController.ubahSlot);
router.post('/jadwal/:idJadwal/hapus', ProfilMitraController.hapusSlot);

module.exports = router;