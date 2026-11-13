const router = require('express').Router();
const c = require('../controllers/AuthController');
const reg = require('../controllers/RegistrasiController');
const v = require('../middleware/validasi');
const multer = require('multer');
const path = require('path');
const status = require('../controllers/StatusRegistrasiController');

const upload = multer({
    dest: path.join(__dirname, '..', 'uploads'),
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) =>
        cb(null, ['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)),
});

const kolomBerkas = upload.fields([
    { name: 'ijazah', maxCount: 1 }, {name: 'kta', maxCount: 1},
    { name: 'sipa', maxCount: 1}, {name : 'bas', maxCount:1}, {name: 'ktp', maxCount:1}, {name: 'cv', maxCount: 1},
]);

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/' + req.session.user.peran);
  res.render('landing');
});

router.get('/registrasi-masyarakat', reg.tampilMasyarakat);
router.post('/registrasi-masyarakat', v.registrasiMasyarakat, reg.prosesMasyarakat)
router.get('/registrasi-mitra', reg.tampilMitra);
router.post('/registrasi-mitra', kolomBerkas, v.registrasiMitra, reg.prosesMitra);
router.get('/login', c.tampilLogin);
router.post('/login', c.prosesLogin);
router.get('/login-masyarakat', c.tampilLoginMasyarakat);
router.post('/login-masyarakat', c.prosesLogin);
router.get('/logout', c.logout);
router.get('/status-verifikasi', status.cekPublik);   // cek publik: /status-verifikasi?username=...


module.exports = router;