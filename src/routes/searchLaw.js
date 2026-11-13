
const router = require('express').Router();
const db = require('../db/database');

// Halaman SearchLaw
router.get('/', (req, res) => {
  const keyword = req.query.q || '';
  let hasil = [];

  if (keyword.trim()) {
    const cari = `%${keyword.trim()}%`;

    hasil = db.prepare(`
      SELECT *
      FROM Peraturan
      WHERE jenisPeraturan LIKE ?
         OR nomor LIKE ?
         OR CAST(tahun AS TEXT) LIKE ?
         OR judul LIKE ?
         OR deskripsi LIKE ?
      ORDER BY tahun DESC
    `).all(cari, cari, cari, cari, cari);
  }

  res.render('searchLaw', {
    keyword,
    hasil
  });
});

module.exports = router;

/*const router = require('express').Router();
const db = require('../db/database');

router.get('/', (req, res) => {
    const keyword = req.query.q || '';
    let hasil = [];


    if (!keyword ||  !keyword.trim()){
        return res.json([]);
    }

    const cari = `%${keyword.trim()}%`;

    const hasil = db.prepare(`
    SELECT *
    FROM Peraturan
    WHERE jenisPeraturan LIKE ?
        or nomor LIKE ?
        OR CAST(tahun AS TEXT) LIKE ?
        OR judul LIKE ?
        OR deskripsi LIKE ?
    ORDER BY tahun DESC
    `).all(cari, cari, cari, cari, cari);

    res.json(hasil);
});

module.exports = router;*/