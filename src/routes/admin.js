const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const LiveChatController = require('../controllers/LiveChatController');
const ModerasiAkunController = require('../controllers/ModerasiAkunController');

router.use(wajibLogin, wajibPeran('admin'));

router.get('/', (req, res) => res.redirect('/admin/laporan'));

router.get('/laporan', ModerasiAkunController.prosesTinjauan);
router.post('/laporan/:idLaporan/blokir', ModerasiAkunController.prosesBlokirAkun);
router.post('/laporan/:idLaporan/tolak', ModerasiAkunController.tolakLaporan);

router.get('/livechat', LiveChatController.tampilChatAdmin);
router.post('/livechat/standby', LiveChatController.toggleStandbyAdmin);
router.post('/livechat/:idChat/selesai', LiveChatController.selesaiChatAdmin);

module.exports = router;