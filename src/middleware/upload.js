const multer = require('multer');
const path = require('path');
const fs = require('fs');

const FOLDER_UPLOAD = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(FOLDER_UPLOAD, { recursive: true });

// batas dari Algo-009
const FORMAT_DIIZINKAN = ['application/pdf', 'image/jpeg', 'image/png'];
const UKURAN_MAKS = 5 * 1024 * 1024;   // 5 MB

const JENIS_DOKUMEN = [
  { kode: 'ijazah', nama: 'Ijazah', wajib: true },
  { kode: 'kta',    nama: 'KTA',    wajib: true },
  { kode: 'sipa',   nama: 'SIPA',   wajib: true },
  { kode: 'bas',    nama: 'BAS',    wajib: true },
  { kode: 'ktp',    nama: 'KTP',    wajib: false },
  { kode: 'cv',     nama: 'CV',     wajib: false }
];

const storage = multer.diskStorage({
  destination: FOLDER_UPLOAD,
  filename: (req, file, cb) => {
    const ekstensi = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${req.session.user.id}-${file.fieldname}${ekstensi}`);
  }
});

const unggahDokumen = multer({ storage, limits: { fileSize: UKURAN_MAKS } })
  .fields(JENIS_DOKUMEN.map((j) => ({ name: j.kode, maxCount: 1 })));

module.exports = { unggahDokumen, FOLDER_UPLOAD, FORMAT_DIIZINKAN, UKURAN_MAKS, JENIS_DOKUMEN };