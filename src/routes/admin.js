const router = require('express').Router();
const { wajibLogin, wajibPeran } = require('../middleware/auth');
const LiveChatController = require('../controllers/LiveChatController');

router.use(wajibLogin, wajibPeran('admin'));
router.get('/', (req, res) => res.send('Dashboard admin (placeholder)'));

router.get('/livechat', LiveChatController.tampilChatAdmin);
router.post('/livechat/standby', LiveChatController.toggleStandbyAdmin);
router.post('/livechat/:idChat/selesai', LiveChatController.selesaiChatAdmin);

module.exports = router;