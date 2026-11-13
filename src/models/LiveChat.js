const db = require('../db/database');

exports.cariAdminById = (idAdmin) => {
  return db
    .prepare('SELECT idAdmin, nama, email, statusStandby FROM Admin WHERE idAdmin = ?')
    .get(idAdmin);
};

exports.cekAdaAdminStandby = () => {
  const row = db
    .prepare('SELECT COUNT(*) AS total FROM Admin WHERE statusStandby = 1')
    .get();
  return row.total > 0;
};

exports.ubahStatusStandby = (idAdmin, statusBaru) => {
  return db
    .prepare('UPDATE Admin SET statusStandby = ? WHERE idAdmin = ?')
    .run(statusBaru ? 1 : 0, idAdmin);
};

exports.cariChatAktifMasyarakat = (idMasyarakat) => {
  return db
    .prepare(`
      SELECT lc.*, a.nama AS namaAdmin
      FROM LiveChat lc
      LEFT JOIN Admin a ON lc.idAdmin = a.idAdmin
      WHERE lc.idMasyarakat = ? AND lc.statusChat IN ('menunggu', 'berlangsung')
      ORDER BY lc.idChat DESC
      LIMIT 1
    `)
    .get(idMasyarakat);
};

exports.cariChatById = (idChat) => {
  return db
    .prepare(`
      SELECT lc.*, m.nama AS namaMasyarakat, a.nama AS namaAdmin
      FROM LiveChat lc
      JOIN Masyarakat m ON lc.idMasyarakat = m.idMasyarakat
      LEFT JOIN Admin a ON lc.idAdmin = a.idAdmin
      WHERE lc.idChat = ?
    `)
    .get(idChat);
};

exports.buatSesiChat = (idMasyarakat) => {
  const info = db
    .prepare(`
      INSERT INTO LiveChat (idMasyarakat, statusChat)
      VALUES (?, 'menunggu')
    `)
    .run(idMasyarakat);

  return exports.cariChatById(info.lastInsertRowid);
};

exports.ambilDaftarAntreanAdmin = () => {
  return db
    .prepare(`
      SELECT lc.idChat, lc.idMasyarakat, lc.idAdmin, lc.waktuChatMulai, lc.statusChat,
             m.nama AS namaMasyarakat,
             a.nama AS namaAdmin,
             (
               SELECT isiPesan
               FROM PesanChat p
               WHERE p.idChat = lc.idChat
               ORDER BY p.idPesan DESC
               LIMIT 1
             ) AS pesanTerakhir
      FROM LiveChat lc
      JOIN Masyarakat m ON lc.idMasyarakat = m.idMasyarakat
      LEFT JOIN Admin a ON lc.idAdmin = a.idAdmin
      WHERE lc.statusChat IN ('menunggu', 'berlangsung')
      ORDER BY
        CASE WHEN lc.statusChat = 'menunggu' THEN 0 ELSE 1 END,
        lc.idChat DESC
    `)
    .all();
};

exports.klaimChatOlehAdmin = (idChat, idAdmin) => {
  return db
    .prepare(`
      UPDATE LiveChat
      SET idAdmin = COALESCE(idAdmin, ?),
          statusChat = 'berlangsung'
      WHERE idChat = ? AND statusChat != 'selesai'
    `)
    .run(idAdmin, idChat);
};

exports.selesaikanChat = (idChat) => {
  return db
    .prepare(`
      UPDATE LiveChat
      SET statusChat = 'selesai',
          waktuChatSelesai = datetime('now')
      WHERE idChat = ? AND statusChat != 'selesai'
    `)
    .run(idChat);
};

exports.ambilPesanByChat = (idChat) => {
  return db
    .prepare(`
      SELECT idPesan, idChat, peranPengirim, idPengirim, isiPesan, waktuKirim
      FROM PesanChat
      WHERE idChat = ?
      ORDER BY idPesan ASC
    `)
    .all(idChat);
};

exports.tambahPesan = ({ idChat, peranPengirim, idPengirim, isiPesan }) => {
  const info = db
    .prepare(`
      INSERT INTO PesanChat (idSesi, idChat, peranPengirim, idPengirim, isiPesan)
      VALUES (NULL, ?, ?, ?, ?)
    `)
    .run(idChat, peranPengirim, idPengirim, isiPesan);

  return db
    .prepare(`
      SELECT idPesan, idChat, peranPengirim, idPengirim, isiPesan, waktuKirim
      FROM PesanChat
      WHERE idPesan = ?
    `)
    .get(info.lastInsertRowid);
};
