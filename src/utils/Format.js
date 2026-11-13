exports.rupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

exports.tanggal = (s) => {
  if (!s) return '-';
  const d = new Date(String(s).replace(' ', 'T'));
  if (isNaN(d)) return s;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};