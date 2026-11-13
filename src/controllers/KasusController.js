const Kasus = require('../models/Kasus');

const TAG = {
  pidana: 'Hukum Pidana',
  perdata: 'Hukum Perdata',
  administrasi: 'Hukum Administrasi Negara',
};

function tampilForm(res, status, { kasus, tagTerpilih, error }) {
  res.status(status).render('halolaw/form-kasus', {
    judulHalaman: 'Form Kasus', judul: 'HaloLaw', ikonJudul: 'telepon',
    kasus, tagTerpilih, TAG, error: error || [],
  });
}

// GET /halolaw  (?kasus=ID untuk mengedit)
exports.tampilForm = (req, res) => {
  const kasus = req.query.kasus
    ? Kasus.cariMilik(Number(req.query.kasus), req.session.user.id)
    : null;
  tampilForm(res, 200, {
    kasus,
    tagTerpilih: kasus ? kasus.kategoriMasalah.split(',') : [],
  });
};

// POST /halolaw
exports.simpan = (req, res) => {
  const idMasyarakat = req.session.user.id;
  const deskripsi = (req.body.deskripsi || '').trim();
  const idLama = Number(req.body.idKasus) || null;

  let tags = req.body.tag || [];
  if (!Array.isArray(tags)) tags = [tags];
  tags = tags.filter(t => Object.hasOwn(TAG, t));

  if (deskripsi.length < 10) {
    return tampilForm(res, 400, {
      kasus: { idKasus: idLama, deskripsi }, tagTerpilih: tags,
      error: ['Deskripsi kasus minimal 10 karakter.'],
    });
  }

  const data = {
    judulKasus: deskripsi.split('\n')[0].slice(0, 60),   // form tidak punya kolom judul
    kategoriMasalah: tags.join(',') || 'umum',
    deskripsi: deskripsi.slice(0, 2000),
  };

  let idKasus = idLama;
  if (idLama) {
    if (!Kasus.ubah(idLama, idMasyarakat, data)) {
      return res.status(404).render('error', { pesan: 'Kasus tidak ditemukan' });
    }
  } else {
    idKasus = Kasus.buat({ idMasyarakat, ...data });
  }

  req.flash('sukses', 'Kasus tersimpan. Berikut mitra pengacara yang sesuai.');
  res.redirect(`/halolaw/mitra?kasus=${idKasus}`);
};