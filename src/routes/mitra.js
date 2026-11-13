const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const beranda = require('../controllers/BerandaMitraController');

router.use(wajibLogin, wajibPeran('mitra'));
router.get('/', beranda.tampil);

module.exports = router;