const db = require('../db/database');

function isApiOrAjax(req) {
  return (
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json')) ||
    req.originalUrl.startsWith('/api')
  );
}

function cekStatusAkunAktif(user) {
  const userId = user.id;
  if (!userId) return true;

  if (user.peran === 'masyarakat') {
    const row = db
      .prepare('SELECT statusAkun FROM Masyarakat WHERE idMasyarakat = ?')
      .get(userId);
    return !row || row.statusAkun !== 'diblokir';
  }

  if (user.peran === 'mitra') {
    const row = db
      .prepare('SELECT statusAkun FROM MitraPengacara WHERE idMitra = ?')
      .get(userId);
    return !row || row.statusAkun !== 'diblokir';
  }

  return true;
}

exports.wajibLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    if (isApiOrAjax(req)) {
      return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu' });
    }
    req.flash('error', 'Silakan login terlebih dahulu');
    return res.redirect('/login');
  }

  if (!cekStatusAkunAktif(req.session.user)) {
    return req.session.destroy(() => {
      res.locals.user = null;
      if (isApiOrAjax(req)) {
        return res.status(403).json({
          success: false,
          message: 'Akun Anda diblokir karena melanggar kebijakan sistem'
        });
      }
      return res.status(403).render('error', {
        pesan: 'Akun Anda diblokir karena melanggar kebijakan sistem'
      });
    });
  }

  next();
};

exports.wajibPeran = (...peran) => (req, res, next) => {
  if (!req.session || !req.session.user || !peran.includes(req.session.user.peran)) {
    if (isApiOrAjax(req)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }
    return res.status(403).render('error', { pesan: 'Akses ditolak' });
  }
  next();
};

exports.wajibAdmin = exports.wajibPeran('admin');

exports.wajibMitraTerverifikasi = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.peran !== 'mitra') {
    if (isApiOrAjax(req)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }
    return res.status(403).render('error', { pesan: 'Akses ditolak' });
  }

  const mitra = db
    .prepare('SELECT statusVerifikasi FROM MitraPengacara WHERE idMitra = ?')
    .get(req.session.user.id);

  if (!mitra || mitra.statusVerifikasi !== 'terverifikasi') {
    if (isApiOrAjax(req)) {
      return res.status(403).json({
        success: false,
        message: 'Akun mitra belum terverifikasi'
      });
    }
    return res.redirect('/mitra/status-verifikasi');
  }

  next();
};