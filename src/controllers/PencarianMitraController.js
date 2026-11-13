const Mitra = require('../models/MitraPengacara');
const Kasus = require('../models/Kasus');

//tags keahlian sementara
const TAG = {
    pidana: 'Hukum Pidana',
    perdata: 'Hukum Perdata',
    administrasi: 'Hukum Administrasi Negara',
};

exports.tampil = (req, res) => {
    const q = (req.query.q || '').trim();

    const kasus = req.query.kasus
        ? Kasus.cariMilik(Number(req.query.kasus), req.session.user.id)
        : null;

    let tags = req.query.tag || [];
    if (!Array.isArray(tags)) tags = [tags];
    tags = tags.filter(t => Object.hasOwn(TAG, t));

    if (!req.query.terapkan && kasus && !tags.length) {
        tags = kasus.kategoriMasalah.split(',').filter(t => Object.hasOwn(TAG, t));
    }

    const ratingMin = Math.min(5, Math.max(0, Number(req.query.rating) || 0));

    res.render('halolaw/daftar-mitra', { daftar: Mitra.cari({ q, tags, ratingMin }), q, tags, ratingMin, TAG, adaFilter: Boolean(q || tags.length || ratingMin),
    });
};