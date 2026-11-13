// PaymentGatewayAdapter (dummy). Gateway pihak ketiga hanya disimulasikan.
// Aturan simulasi: kartu yang diawali "0000" ditolak; selain itu berhasil.

exports.prosesPembayaran = ({ metode, nominal, nomorKartu }) => {
  if (metode === 'kartu' && String(nomorKartu).startsWith('0000')) {
    return { berhasil: false, pesan: 'Kartu ditolak oleh bank penerbit' };
  }
  return { berhasil: true, referensi: 'PAY-' + Date.now() };
};

exports.prosesPencairan = ({ rekening, nominal }) => {
  if (!rekening || nominal <= 0) return { berhasil: false, pesan: 'Rekening tidak valid' };
  return { berhasil: true, referensi: 'PAYOUT-' + Date.now() };
};