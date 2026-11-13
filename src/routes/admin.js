const router = require('express').Router();
const { wajibLogin, wajibAdmin } = require('../middleware/auth');
const VerifikasiMitraController = require('../controllers/VerifikasiMitraController');
const ModerasiAkunController = require('../controllers/ModerasiAkunController');
const LiveChatController = require('../controllers/LiveChatController');

router.use(wajibLogin, wajibAdmin);

router.get('/', (req, res) => res.redirect('/admin/verifikasi'));

router.get('/verifikasi', VerifikasiMitraController.tampilDaftarMitra);
router.get('/verifikasi/dokumen/:idDokumen', VerifikasiMitraController.lihatDokumenById);
router.get('/verifikasi/:idMitra/dokumen/:jenis', VerifikasiMitraController.lihatDokumenByJenis);
router.get('/verifikasi/:idMitra', VerifikasiMitraController.tampilDetailMitra);
router.post('/verifikasi/:idMitra', VerifikasiMitraController.prosesVerifikasi);

router.get('/laporan', ModerasiAkunController.prosesTinjauan);
router.post('/laporan/:idLaporan/blokir', ModerasiAkunController.prosesBlokirAkun);
router.post('/laporan/:idLaporan/tolak', ModerasiAkunController.tolakLaporan);

router.get('/livechat', LiveChatController.tampilChatAdmin);
router.post('/livechat/standby', LiveChatController.toggleStandbyAdmin);
router.post('/livechat/:idChat/selesai', LiveChatController.selesaiChatAdmin);

module.exports = router;