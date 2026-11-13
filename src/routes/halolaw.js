const router = require('express').Router();

const { wajibLogin, wajibPeran } = require('../middleware/auth');
const c = require('../controllers/PencarianMitraController');

router.use(wajibLogin, wajibPeran('masyarakat'));
router.get('/mitra', c.tampil);

module.exports = router;