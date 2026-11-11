(function () {
  var appEl = document.getElementById('chatApp');
  if (!appEl || typeof io !== 'function') return;

  var peranUser = appEl.dataset.peran;
  var currentChatId = appEl.dataset.chatId ? Number(appEl.dataset.chatId) : null;

  var messagesEl = document.getElementById('chatMessages');
  var formEl = document.getElementById('chatForm');
  var inputEl = document.getElementById('isiPesan');
  var submitBtn = formEl ? formEl.querySelector('button[type="submit"]') : null;
  var pillEl = formEl ? formEl.querySelector('.chat-input-pill') : null;
  var errorEl = document.getElementById('socketError');
  var statusEl = document.getElementById('statusLabel');
  var antreanSelectEl = document.getElementById('antreanSelect');
  var toastEl = document.getElementById('newQueueToast');

  function scrollKeBawah() {
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function tampilError(teks) {
    if (!errorEl) return;
    errorEl.textContent = teks;
    errorEl.style.display = 'block';
  }

  function sembunyikanError() {
    if (!errorEl) return;
    errorEl.style.display = 'none';
  }

  function tambahGelembung(msg) {
    if (!messagesEl) return;
    if (msg.idPesan && messagesEl.querySelector('[data-id-pesan="' + msg.idPesan + '"]')) {
      return;
    }

    var isSelf = msg.peranPengirim === peranUser;
    var row = document.createElement('div');
    row.className = 'msg-row ' + (isSelf ? 'is-self' : 'is-other');
    if (msg.idPesan) {
      row.dataset.idPesan = String(msg.idPesan);
    }

    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble ' + (msg.peranPengirim === 'masyarakat' ? 'sender-masyarakat' : 'sender-admin');
    bubble.textContent = msg.isiPesan;

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollKeBawah();
  }

  scrollKeBawah();

  var socket = io();

  socket.on('connect', function () {
    if (currentChatId) {
      socket.emit('gabung_chat', { idChat: currentChatId });
    }
  });

  socket.on('connect_error', function (err) {
    tampilError(err && err.message ? err.message : 'Koneksi LiveChat terputus');
  });

  socket.on('pesan_error', function (teks) {
    tampilError(teks);
  });

  socket.on('sesi_dibuat', function (data) {
    currentChatId = Number(data.idChat);
    appEl.dataset.chatId = String(currentChatId);
    if (statusEl) {
      statusEl.textContent = 'Menunggu respons Admin...';
    }
  });

  socket.on('status_berubah', function (data) {
    if (currentChatId && Number(data.idChat) !== currentChatId) return;
    if (statusEl && peranUser === 'masyarakat') {
      statusEl.textContent = data.namaAdmin
        ? 'Terhubung dengan Admin (' + data.namaAdmin + ')'
        : 'Terhubung dengan Admin';
    }
    if (statusEl && peranUser === 'admin') {
      statusEl.textContent = 'Sesi #' + data.idChat + ' — ' + data.statusChat;
    }
  });

  socket.on('pesan_baru', function (msg) {
    if (currentChatId && Number(msg.idChat) !== currentChatId) return;
    sembunyikanError();
    tambahGelembung(msg);
  });

  socket.on('sesi_selesai', function (data) {
    if (currentChatId && Number(data.idChat) !== currentChatId) return;
    if (statusEl) {
      statusEl.textContent = 'Sesi chat telah selesai';
    }
    if (inputEl) inputEl.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    if (pillEl) pillEl.classList.add('is-disabled');
    tampilError('Sesi live chat telah diakhiri. Muat ulang halaman jika ingin memulai sesi baru.');
  });

  // Pembaruan daftar antrean khusus Admin (UC 20)
  socket.on('admin:antrean_update', function (data) {
    if (peranUser !== 'admin') return;

    // Jika Admin sedang membuka halaman kosong, otomatis buka chat yang baru masuk
    if (!currentChatId && data.statusChat !== 'selesai') {
      window.location.href = '/admin/livechat?idChat=' + data.idChat;
      return;
    }

    if (antreanSelectEl && data.statusChat !== 'selesai') {
      var opsiAda = antreanSelectEl.querySelector('option[value="' + data.idChat + '"]');
      var labelBaru = '#' + data.idChat + ' - ' + (data.namaMasyarakat || 'Masyarakat') + ' (' + data.statusChat + ')';

      if (opsiAda) {
        opsiAda.textContent = labelBaru;
      } else {
        var opsiKosong = antreanSelectEl.querySelector('option[value=""]');
        if (opsiKosong) opsiKosong.remove();

        var opt = document.createElement('option');
        opt.value = String(data.idChat);
        opt.textContent = labelBaru;
        antreanSelectEl.appendChild(opt);
      }
    }

    if (toastEl && currentChatId && Number(data.idChat) !== currentChatId && data.statusChat !== 'selesai') {
      toastEl.textContent = '';
      var teks = document.createTextNode('Pesan masuk dari ' + (data.namaMasyarakat || 'Masyarakat') + ' (Sesi #' + data.idChat + '). ');
      var link = document.createElement('a');
      link.href = '/admin/livechat?idChat=' + data.idChat;
      link.textContent = 'Buka chat';
      toastEl.appendChild(teks);
      toastEl.appendChild(link);
      toastEl.style.display = 'block';
    }
  });

  if (formEl && inputEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var teks = inputEl.value.trim();
      if (!teks) return;

      sembunyikanError();
      socket.emit('kirim_pesan', {
        idChat: currentChatId,
        isiPesan: teks
      });

      inputEl.value = '';
      inputEl.focus();
    });
  }
})();