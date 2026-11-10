const db = require('./db/database');

function tambahKolomJikaBelumAda(tabel, kolom, definisi) {
  const daftarKolom = db.prepare(`PRAGMA table_info(${tabel})`).all();
  const sudahAda = daftarKolom.some((c) => c.name === kolom);

  if (!sudahAda) {
    db.exec(`ALTER TABLE ${tabel} ADD COLUMN ${kolom} ${definisi};`);
    console.log(`[OK] Kolom ${tabel}.${kolom} ditambahkan.`);
  } else {
    console.log(`[SKIP] Kolom ${tabel}.${kolom} sudah ada.`);
  }
}

tambahKolomJikaBelumAda('MitraPengacara', 'catatanVerifikasi', 'TEXT');
tambahKolomJikaBelumAda('DokumenLegalitas', 'jenisDokumen', "TEXT NOT NULL DEFAULT 'lainnya'");
tambahKolomJikaBelumAda('DokumenLegalitas', 'waktuUnggah', 'TEXT');
tambahKolomJikaBelumAda('Laporan', 'catatanAdmin', 'TEXT');
tambahKolomJikaBelumAda('Laporan', 'idAdminPeninjau', 'INTEGER REFERENCES Admin(idAdmin)');