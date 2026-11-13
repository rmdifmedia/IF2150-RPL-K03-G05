const { body } = require('express-validator');

exports.registrasiMasyarakat = [
    body('nama').trim().notEmpty().withMessage('nama lengkap wajib diisi'),
    body('username').trim().matches(/^[A-Za-z0-9_]{3,20}$/), //regex
    body('noHp').trim().customSanitizer((v) => v.replace(/[\s-]/g, '').replace(/^\+?62/, '')).matches(/^0?\d{8,13}$/)
        .withMessage('Nomor HP tidak valid. Isi 8-13 digit tanpa +62, contoh 81234567890'),
    body('email').trim().isEmail(),
    body('kataSandi').isLength({ min: 6}),
    body('konfirmasi').custom((v, { req }) => v === req.body.kataSandi)
        .withMessage('Konfirmasi kata sandi tidak sama'),
];

exports.registrasiMitra = [
    body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
    body('email').trim().isEmail().withMessage('Format email tidak valid'),
    body('username').trim().matches(/^[A-Za-z0-9_]{3,20}$/)
        .withMessage('Username 3-20 karakter (huruf, angka, atau underscore)'),
    body('kataSandi').isLength({ min: 6 }).withMessage('Kata sandi minimal 6 karakter'),
    body('konfirmasi').custom((v, { req }) => v === req.body.kataSandi)
        .withMessage('Konfirmasi kata sandi tidak sama'),
    body('namaFirma').trim().notEmpty().withMessage(' Nama firma wajib diisi'),
];