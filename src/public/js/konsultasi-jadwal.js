// UI-08 Pemilihan Jadwal Konsultasi: kalender + daftar slot (UC10)
(function () {
  var app = document.getElementById('jadwalApp');
  if (!app) return;

  var idMitra = app.dataset.idMitra;
  var hariIni = app.dataset.hariIni;               // YYYY-MM-DD (WIB)
  var NAMA_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  var selBulan = document.getElementById('kalBulan');
  var selTahun = document.getElementById('kalTahun');
  var gridEl = document.getElementById('kalTanggal');
  var slotEl = document.getElementById('daftarSlot');
  var infoEl = document.getElementById('infoTanggal');
  var dialog = document.getElementById('dialogKonfirmasi');

  var state = {
    tahun: Number(hariIni.slice(0, 4)),
    bulan: Number(hariIni.slice(5, 7)),
    tanggal: null,
    tersedia: [],
  };

  var pad = function (n) { return String(n).padStart(2, '0'); };
  var iso = function (t, b, d) { return t + '-' + pad(b) + '-' + pad(d); };

  // ---- isi dropdown bulan & tahun ----
  NAMA_BULAN.forEach(function (n, i) { selBulan.add(new Option(n, i + 1)); });
  for (var y = state.tahun; y <= state.tahun + 2; y++) selTahun.add(new Option(y, y));

  function fetchJson(url) {
    return fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(function (r) { return r.json(); });
  }

  // ---- kalender ----
  function gambarKalender() {
    selBulan.value = state.bulan;
    selTahun.value = state.tahun;
    gridEl.innerHTML = '';

    var hariPertama = new Date(state.tahun, state.bulan - 1, 1).getDay();     // 0 = Minggu
    var jumlahHari = new Date(state.tahun, state.bulan, 0).getDate();
    var jumlahHariLalu = new Date(state.tahun, state.bulan - 1, 0).getDate();
    var sel = 0;

    function tambah(teks, opsi) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kal-hari-btn' + (opsi.kelas ? ' ' + opsi.kelas : '');
      b.textContent = teks;
      b.disabled = !!opsi.mati;
      if (opsi.tgl) {
        b.dataset.tanggal = opsi.tgl;
        b.setAttribute('aria-pressed', opsi.tgl === state.tanggal ? 'true' : 'false');
        b.addEventListener('click', function () { pilihTanggal(opsi.tgl); });
      }
      gridEl.appendChild(b);
      sel++;
    }

    for (var i = hariPertama - 1; i >= 0; i--) tambah(jumlahHariLalu - i, { mati: true, kelas: 'luar' });
    for (var d = 1; d <= jumlahHari; d++) {
      var t = iso(state.tahun, state.bulan, d);
      var ada = state.tersedia.indexOf(t) !== -1;
      tambah(d, {
        mati: !ada, tgl: ada ? t : null,
        kelas: (t === state.tanggal ? 'dipilih' : '') + (ada ? '' : ' penuh'),
      });
    }
    for (var n = 1; sel % 7 !== 0; n++) tambah(n, { mati: true, kelas: 'luar' });
  }

  // ---- slot waktu ----
  function pesanKosong(teks, tautan) {
    slotEl.innerHTML = '';
    var p = document.createElement('div');
    p.className = 'kotak slot-kosong';
    p.textContent = teks;
    if (tautan) {
      var a = document.createElement('a');
      a.href = '/halolaw/mitra';
      a.textContent = ' Pilih mitra lain';
      p.appendChild(a);
    }
    slotEl.appendChild(p);
  }

  function gambarSlot(slot) {
    slotEl.innerHTML = '';
    slot.forEach(function (s) {
      var row = document.createElement('div');
      row.className = 'slot-baris';
      var label = document.createElement('span');
      label.textContent = s.label;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tombol tombol-slot';
      btn.textContent = 'Pilih';
      btn.addEventListener('click', function () { bukaKonfirmasi(s); });
      row.appendChild(label);
      row.appendChild(btn);
      slotEl.appendChild(row);
    });
  }

  function pilihTanggal(tgl) {
    state.tanggal = tgl;
    gambarKalender();
    infoEl.textContent = tgl;
    slotEl.textContent = 'Memuat...';
    fetchJson('/konsultasi/jadwal/' + idMitra + '/slot?tanggal=' + tgl).then(function (r) {
      if (!r.success || !r.slot.length) return pesanKosong('Tidak ada jadwal tersedia pada tanggal ini.');
      gambarSlot(r.slot);
    }).catch(function () { pesanKosong('Gagal memuat jadwal. Muat ulang halaman.'); });
  }

  function bukaKonfirmasi(s) {
    document.getElementById('inputTanggal').value = state.tanggal;
    document.getElementById('inputWaktu').value = s.waktu;
    document.getElementById('ringkasJadwal').textContent = state.tanggal + ', ' + s.label + ' WIB';
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  }
  document.getElementById('batalKonfirmasi').addEventListener('click', function () { dialog.close(); });

  // ---- muat bulan ----
  function muatBulan(pilihOtomatis) {
    gridEl.textContent = 'Memuat...';
    fetchJson('/konsultasi/jadwal/' + idMitra + '/kalender?tahun=' + state.tahun + '&bulan=' + state.bulan)
      .then(function (r) {
        state.tersedia = r.success ? r.tersedia : [];
        if (pilihOtomatis !== false) state.tanggal = state.tersedia[0] || null;
        gambarKalender();
        if (state.tanggal) return pilihTanggal(state.tanggal);
        infoEl.textContent = '';
        // UC10 alt 1: semua jadwal penuh / tidak sesuai
        pesanKosong('Tidak ada jadwal tersedia pada bulan ini. Coba bulan lain atau', true);
      });
  }

  function geser(delta) {
    state.bulan += delta;
    if (state.bulan < 1) { state.bulan = 12; state.tahun--; }
    if (state.bulan > 12) { state.bulan = 1; state.tahun++; }
    if (state.tahun < Number(hariIni.slice(0, 4))) { state.tahun = Number(hariIni.slice(0, 4)); state.bulan = Number(hariIni.slice(5, 7)); }
    muatBulan();
  }
  document.getElementById('kalPrev').addEventListener('click', function () { geser(-1); });
  document.getElementById('kalNext').addEventListener('click', function () { geser(1); });
  selBulan.addEventListener('change', function () { state.bulan = Number(selBulan.value); muatBulan(); });
  selTahun.addEventListener('change', function () { state.tahun = Number(selTahun.value); muatBulan(); });

  muatBulan();
})();
