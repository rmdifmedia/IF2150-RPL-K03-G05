const Mitra = require('../models/MitraPengacara');

//tags keahlian sementara
const TAG = {
    pidana: 'Hukum Pidana',
    perdata: 'Hukum Perdata',
    administrasi: 'Hukum Administrasi Negara',
};

exports.tampil = (req, res) => {
    const q = (req.query.q || '').trim();

    let tags = req.query.tag || [];
    if (!Array.isArray(tags)) tags = [tags];
    tags = tags.filter(t => Object.hasOwn(TAG, t));

    const ratingMin = Math.min(5, Math.max(0, Number(req.query.rating) || 0));

    res.render('halolaw/daftar-mitra', { daftar: Mitra.cari({ q, tags, ratingMin }), q, tags, ratingMin, TAG, adaFilter: Boolean(q || tags.length || ratingMin),
    });
};