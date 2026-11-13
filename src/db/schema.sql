CREATE TABLE IF NOT EXISTS Masyarakat (          -- C40
  idMasyarakat INTEGER PRIMARY KEY AUTOINCREMENT,
  nama         TEXT NOT NULL,
  username     TEXT NOT NULL UNIQUE,
  nohp         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  sandi        TEXT NOT NULL,                  
  statusAkun   TEXT NOT NULL DEFAULT 'aktif' CHECK (statusAkun IN ('aktif', 'diblokir'))
);

CREATE TABLE IF NOT EXISTS MitraPengacara (      -- C41
  idMitra           INTEGER PRIMARY KEY AUTOINCREMENT,
  nama              TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,  
  username          TEXT NOT NULL UNIQUE,  
  namaFirma         TEXT,
  deskripsi         TEXT,   
  sandiMitra        TEXT NOT NULL,              
  validitas         INTEGER NOT NULL DEFAULT 0 CHECK (validitas IN (0, 1)),
  statusVerifikasi  TEXT NOT NULL DEFAULT 'menunggu'
                    CHECK (statusVerifikasi IN ('menunggu', 'terverifikasi', 'ditolak')),  
  tagKeahlian       TEXT,
  spesialisasi      TEXT,
  statusKetersediaan TEXT NOT NULL DEFAULT 'tersedia'
                    CHECK (statusKetersediaan IN ('tersedia', 'tidak tersedia')),
  rating            REAL NOT NULL DEFAULT 0,
  saldo             REAL NOT NULL DEFAULT 0,
  rekeningPencairan TEXT,
  statusAkun        TEXT NOT NULL DEFAULT 'aktif' CHECK (statusAkun IN ('aktif', 'diblokir'))  
);

CREATE TABLE IF NOT EXISTS Admin (               -- C42
  idAdmin       INTEGER PRIMARY KEY AUTOINCREMENT,
  nama          TEXT NOT NULL,                 
  email         TEXT NOT NULL UNIQUE,          
  sandi         TEXT NOT NULL,                 
  statusStandby INTEGER NOT NULL DEFAULT 1 CHECK (statusStandby IN (0, 1))  
);

CREATE TABLE IF NOT EXISTS Kasus (               -- C43
  idKasus        INTEGER PRIMARY KEY AUTOINCREMENT,
  idMasyarakat   INTEGER NOT NULL REFERENCES Masyarakat(idMasyarakat),
  judulKasus     TEXT NOT NULL,
  kategoriMasalah TEXT NOT NULL,
  deskripsi      TEXT,
  statusKasus    TEXT NOT NULL DEFAULT 'diajukan'
);

CREATE TABLE IF NOT EXISTS DasarHukum (          -- C44
  idPasal       INTEGER PRIMARY KEY AUTOINCREMENT,
  namaPeraturan TEXT NOT NULL,                
  nomorPasal    TEXT NOT NULL,                 
  isiPasal      TEXT NOT NULL                
);

CREATE TABLE IF NOT EXISTS DokumenLegalitas (    -- C45
  idDokumen    INTEGER PRIMARY KEY AUTOINCREMENT,
  idMitra      INTEGER NOT NULL REFERENCES MitraPengacara(idMitra),
  validitas    INTEGER NOT NULL DEFAULT 0 CHECK (validitas IN (0, 1)),
  jenisDokumen TEXT NOT NULL, -- ijazah, KTA, SIPA, dsb
  namaBerkas   TEXT,                        
  lokasiBerkas TEXT,
  waktuUnggah  TEXT DEFAULT (datetime('now'))                            
);

CREATE TABLE IF NOT EXISTS SesiKonsultasi (      -- C46
  idSesi           INTEGER PRIMARY KEY AUTOINCREMENT,
  idMasyarakat     INTEGER NOT NULL REFERENCES Masyarakat(idMasyarakat),
  idMitra          INTEGER NOT NULL REFERENCES MitraPengacara(idMitra),
  idKasus          INTEGER REFERENCES Kasus(idKasus),      
  tanggalJadwal    TEXT NOT NULL,                -- format YYYY-MM-DD
  waktuJadwal      TEXT NOT NULL,                -- format HH:MM
  statusSesi       TEXT NOT NULL DEFAULT 'menunggu',
  statusKonsul     TEXT,
  catatanKonsul    TEXT,
  statusPembayaran TEXT NOT NULL DEFAULT 'belum bayar',
  waktuMulai       TEXT,
  waktuSelesai     TEXT
);

CREATE TABLE IF NOT EXISTS Ulasan (              -- C47
  idUlasan     INTEGER PRIMARY KEY AUTOINCREMENT,
  idSesi       INTEGER REFERENCES SesiKonsultasi(idSesi),      
  idMasyarakat INTEGER REFERENCES Masyarakat(idMasyarakat),   
  idMitra      INTEGER NOT NULL REFERENCES MitraPengacara(idMitra),
  skorRating   INTEGER NOT NULL CHECK (skorRating BETWEEN 1 AND 5),
  teksUlasan   TEXT,
  foto         TEXT,
  tanggalUlasan TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE IF NOT EXISTS Laporan (             -- C48
  idLaporan        INTEGER PRIMARY KEY AUTOINCREMENT,
  idPelapor        INTEGER NOT NULL,
  peranPelapor     TEXT NOT NULL CHECK (peranPelapor IN ('masyarakat', 'mitra')),  
  idTerlapor       INTEGER NOT NULL,
  peranTerlapor    TEXT NOT NULL CHECK (peranTerlapor IN ('masyarakat', 'mitra')), 
  idUlasan         INTEGER REFERENCES Ulasan(idUlasan),                         
  jenisPelanggaran TEXT NOT NULL,
  deskripsi        TEXT,
  tanggalLaporan   TEXT NOT NULL DEFAULT (date('now')),
  statusLaporan    TEXT NOT NULL DEFAULT 'menunggu'
);

CREATE TABLE IF NOT EXISTS Pembayaran (          -- C49
  idPembayaran     INTEGER PRIMARY KEY AUTOINCREMENT,
  idSesi           INTEGER NOT NULL REFERENCES SesiKonsultasi(idSesi),        
  nominal          REAL NOT NULL,
  statusPembayaran TEXT NOT NULL DEFAULT 'menunggu',
  metodeBayar      TEXT,
  waktuTransaksi   TEXT NOT NULL DEFAULT (datetime('now'))                
);

CREATE TABLE IF NOT EXISTS LiveChat (            -- C50
  idChat           INTEGER PRIMARY KEY AUTOINCREMENT,
  idMasyarakat     INTEGER NOT NULL REFERENCES Masyarakat(idMasyarakat),      
  idAdmin          INTEGER REFERENCES Admin(idAdmin),                
  waktuChatMulai   TEXT NOT NULL DEFAULT (datetime('now')),
  waktuChatSelesai TEXT,
  statusChat       TEXT NOT NULL DEFAULT 'menunggu'
);                                            

CREATE TABLE IF NOT EXISTS PencairanDana (       -- C51
  idPencairan      INTEGER PRIMARY KEY AUTOINCREMENT,
  idMitra          INTEGER NOT NULL REFERENCES MitraPengacara(idMitra),
  totalPencairan   REAL NOT NULL,
  tanggalPengajuan TEXT NOT NULL DEFAULT (date('now')),
  statusPencairan  TEXT NOT NULL DEFAULT 'diproses',
  rekeningTujuan   TEXT NOT NULL
);

-- TABEL CHAT
CREATE TABLE IF NOT EXISTS PesanChat (
  idPesan      INTEGER PRIMARY KEY AUTOINCREMENT,
  idSesi       INTEGER REFERENCES SesiKonsultasi(idSesi),
  idChat       INTEGER REFERENCES LiveChat(idChat),
  peranPengirim TEXT NOT NULL CHECK (peranPengirim IN ('masyarakat', 'mitra', 'admin')),
  idPengirim   INTEGER NOT NULL,
  isiPesan     TEXT NOT NULL,
  waktuKirim   TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK ((idSesi IS NOT NULL) + (idChat IS NOT NULL) = 1)
);

CREATE TABLE IF NOT EXISTS JadwalKetersediaan (   -- [+] tabel bantu implementasi
  idJadwal     INTEGER PRIMARY KEY AUTOINCREMENT,
  idMitra      INTEGER NOT NULL REFERENCES MitraPengacara(idMitra),
  tanggal      TEXT NOT NULL,                   -- YYYY-MM-DD
  waktuMulai   TEXT NOT NULL,                   -- HH:MM
  waktuSelesai TEXT NOT NULL,                   -- HH:MM
  UNIQUE (idMitra, tanggal, waktuMulai)
);

CREATE INDEX IF NOT EXISTS idx_pesan_sesi ON PesanChat(idSesi, idPesan);
CREATE INDEX IF NOT EXISTS idx_pesan_chat ON PesanChat(idChat, idPesan);
CREATE INDEX IF NOT EXISTS idx_sesi_mitra ON SesiKonsultasi(idMitra);
CREATE INDEX IF NOT EXISTS idx_sesi_masyarakat ON SesiKonsultasi(idMasyarakat);