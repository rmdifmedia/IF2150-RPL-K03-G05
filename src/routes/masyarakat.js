const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');

router.use(wajibLogin, wajibPeran('masyarakat'));
router.get('/', (req, res) => res.render('masyarakat/beranda'));

module.exports = router;