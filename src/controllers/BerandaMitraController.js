const Dashboard = require('../models/DashboardMitra');

const tanggal = (t) =>
  new Date(t + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const rupiah = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n || 0);

exports.tampil = (req, res) => {
  const idMitra = req.session.user.id;
  res.render('mitra/beranda', {
    ringkasan: Dashboard.ringkasan(idMitra),
    permintaan: Dashboard.permintaanTerbaru(idMitra),
    sesi: Dashboard.sesiBerikutnya(idMitra),
    tanggal, rupiah,
  });
};