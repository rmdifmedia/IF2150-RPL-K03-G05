const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const LiveChatController = require('../controllers/LiveChatController');

router.use(wajibLogin, wajibPeran('masyarakat'));
router.get('/', (req, res) => res.send('Dashboard masyarakat (placeholder)'));

router.get('/livechat', LiveChatController.tampilChatMasyarakat);
router.post('/livechat/selesai', LiveChatController.selesaiChatMasyarakat);

module.exports = router;