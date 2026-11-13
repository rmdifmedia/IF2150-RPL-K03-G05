const router = require('express').Router();

const { wajibLogin, wajibPeran } = require('../middleware/auth');
const c = require('../controllers/PencarianMitraController');
const kasus = require('../controllers/KasusController');

router.use(wajibLogin, wajibPeran('masyarakat'));
router.get('/', kasus.tampilForm);
router.post('/', kasus.simpan);
router.get('/mitra', c.tampil);

module.exports = router;