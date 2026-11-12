// UI-10 / UI-11 Chat Konsultasi (UC12), Socket.IO namespace /konsultasi
(function () {
  var app = document.getElementById('konsulApp');
  if (!app) return;

  var idSesi = Number(app.dataset.idSesi);
  var peran = app.dataset.peran;
  var aktif = app.dataset.aktif === '1';
  var pesanEl = document.getElementById('konsulPesan');
  var form = document.getElementById('formPesan');
  var input = document.getElementById('isiPesan');
  var statusEl = document.getElementById('statusSesi');
  var errEl = document.getElementById('socketError');

  function ke_bawah() { pesanEl.scrollTop = pesanEl.scrollHeight; }
  ke_bawah();

  function tampilError(t) { errEl.textContent = t; errEl.style.display = 'block'; }

  function tambah(p) {
    if (p.idPesan && pesanEl.querySelector('[data-id-pesan="' + p.idPesan + '"]')) return;
    var row = document.createElement('div');
    row.className = 'pesan-baris ' + (p.peranPengirim === peran ? 'is-self' : 'is-other');
    if (p.idPesan) row.dataset.idPesan = p.idPesan;
    var b = document.createElement('div');
    b.className = 'pesan-bubble sender-' + p.peranPengirim;
    b.textContent = p.isiPesan;               // textContent -> aman dari XSS
    row.appendChild(b);
    pesanEl.appendChild(row);
    ke_bawah();
  }

  function tutupChat(teks) {
    input.disabled = true;
    form.querySelector('button').disabled = true;
    statusEl.textContent = teks;
    var f = document.getElementById('formAkhiri');
    if (f) f.remove();
  }

  if (!aktif) return;                            // chat belum boleh dibuka / sudah selesai

  var socket = io('/konsultasi');
  var lawan = peran === 'masyarakat' ? 'mitra' : 'masyarakat';

  socket.on('connect', function () { errEl.style.display = 'none'; socket.emit('gabung', { idSesi: idSesi }); });
  socket.on('connect_error', function (e) { tampilError(e.message || 'Gagal terhubung'); });
  socket.on('disconnect', function () { statusEl.textContent = 'Koneksi terputus. Mencoba menghubungkan kembali...'; });
  socket.on('pesan_error', tampilError);
  socket.on('pesan_baru', tambah);

  // UC12 alt 1: tampilkan status tertunda bila pihak lain tidak terhubung
  socket.on('presence', function (d) {
    statusEl.textContent = d.peran.indexOf(lawan) !== -1
      ? 'Terhubung'
      : 'Sesi tertunda: menunggu ' + (lawan === 'mitra' ? 'mitra pengacara' : 'klien') + ' terhubung kembali';
  });

  socket.on('sesi_selesai', function (d) {
    var oleh = d.oleh === 'sistem' ? 'tidak ada aktivitas' : (d.oleh === peran ? 'Anda' : 'pihak lain');
    tutupChat('Sesi telah diakhiri (' + oleh + ').');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var isi = input.value.trim();
    if (!isi) return;
    socket.emit('kirim_pesan', { idSesi: idSesi, isiPesan: isi });
    input.value = '';
  });

  var formAkhiri = document.getElementById('formAkhiri');
  if (formAkhiri) formAkhiri.addEventListener('submit', function (e) {
    if (!confirm('Akhiri sesi konsultasi ini?')) e.preventDefault();
  });
})();
