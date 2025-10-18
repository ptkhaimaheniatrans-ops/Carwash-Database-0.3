// GOOGLE APPS SCRIPT DEPLOYED URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxIRFJhysCT_pMvDW-yPLD-w6gSdSh4UTMhMU_5pwPyGhBIjfBwtx00NhpozaDv_0EVEw/exec"; // replace with your Apps Script Web App URL

// Sound setup
const sounds = {
  klik: new Audio('assets/sounds/klik.mp3'),
  success: new Audio('assets/sounds/success.mp3'),
  error: new Audio('assets/sounds/error.mp3'),
  welcome: new Audio('assets/sounds/welcome.mp3')
};
Object.values(sounds).forEach(s => s.preload = 'auto');

function playSound(type) {
  const s = sounds[type];
  if (s) {
    s.currentTime = 0;
    s.play().catch(()=>{});
  }
}

function showPopup(text) {
  const pop = document.createElement('div');
  pop.className = 'popup';
  pop.textContent = text;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 2500);
}

// 🎵 Play click sound for every button globally
document.addEventListener('click', e => {
  const el = e.target.closest('button, .btn');
  if (el) {
    playSound('klik');
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 400);
  }
});

// 🎵 Also trigger sound on input focus (date, dropdown, etc.)
document.addEventListener('focusin', e => {
  const el = e.target;
  if (['INPUT', 'SELECT'].includes(el.tagName)) {
    playSound('klik');
  }
});

// --- LOGIN SYSTEM ---
let currentUser = "";

document.getElementById('btnConnect').onclick = () => {
  const code = document.getElementById('secretCode').value.trim();
  if (code === "Bungas03" || code === "Khai2020") {
    currentUser = code;
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    showPopup('Welcome!');
    playSound('welcome');
    setupDashboard(code);
  } else {
    showPopup('Oopsie! Wrong Move!');
    playSound('error');
  }
};

// --- DASHBOARD SETUP ---
function setupDashboard(code) {
  const menu = document.getElementById('menuButtons');
  menu.innerHTML = "";

  const dbBtn = document.createElement('button');
  dbBtn.textContent = "Database";
  dbBtn.className = "btn lilac";
  dbBtn.onclick = () => {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('databaseTab').classList.remove('hidden');
  };

  if (code === "Bungas03") {
    const inBtn = document.createElement('button');
    inBtn.textContent = "Input Entry";
    inBtn.className = "btn lilac";
    inBtn.onclick = () => {
      document.getElementById('dashboard').classList.add('hidden');
      document.getElementById('inputTab').classList.remove('hidden');
    };
    menu.appendChild(inBtn);
  }

  menu.appendChild(dbBtn);
}

// --- SEGMENT CONTROL (Transfer / Cash) ---
let paymentMethod = "";
document.querySelectorAll('.segment').forEach(seg => {
  seg.onclick = () => {
    // reset other segments
    document.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));
    // activate clicked one
    seg.classList.add('active');
    seg.classList.add('bounce');
    setTimeout(() => seg.classList.remove('bounce'), 300);
    // play sound
    playSound('klik');
    // save selection
    paymentMethod = seg.dataset.value;
  };
});

// --- SUBMIT ENTRY ---
document.getElementById('submitEntry').onclick = async () => {
  const date = document.getElementById('dateInput').value;
  const driver = document.getElementById('driverInput').value;
  const unit = document.getElementById('unitInput').value;
  if (!date || !driver || !unit || !paymentMethod) {
    showPopup("Oopsie! Wrong Move!");
    playSound('error');
    return;
  }

  const form = new FormData();
  form.append('date', date);
  form.append('driver', driver);
  form.append('unit', unit);
  form.append('payment', paymentMethod);

  try {
    const res = await fetch(SCRIPT_URL, { method: 'POST', body: form });
    const data = await res.json();
    if (data.success) {
      showPopup("Success!");
      playSound('success');

      // 🔄 Kosongkan semua input setelah sukses submit
      document.getElementById('dateInput').value = '';
      document.getElementById('driverInput').value = '';
      document.getElementById('unitInput').value = '';
      paymentMethod = '';

      // Hilangkan warna aktif di tombol metode pembayaran
      document.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));

      // Fokus kembali ke input tanggal biar cepat input berikutnya
      document.getElementById('dateInput').focus();
    } else {
      showPopup("Oopsie! Wrong Move!");
      playSound('error');
    }
  } catch (err) {
    showPopup("Oopsie! Wrong Move!");
    playSound('error');
  }
};

// --- DATABASE SEARCH ---
document.getElementById('searchBtn').onclick = loadDatabase;

async function loadDatabase() {
  const monthInput = document.getElementById('filterMonth').value;
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';
  if (!monthInput) return;

  const [y, m] = monthInput.split('-');
  const url = `${SCRIPT_URL}?action=list&month=${parseInt(m)}&year=${y}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const data = json.data;

    // 🔹 Kelompokkan data berdasarkan tanggal
    const grouped = {};
    data.forEach(row => {
      if (!grouped[row.date]) grouped[row.date] = [];
      grouped[row.date].push(row);
    });

    // 🔹 Tampilkan dalam urutan tanggal (ascending)
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(date => {
      // Tambahkan baris tanggal besar
      const dateRow = document.createElement('tr');
      dateRow.innerHTML = `<td colspan="4" style="font-weight:bold; background:#e6d1ff;">${date}</td>`;
      tbody.appendChild(dateRow);

      // Tambahkan baris detail
      grouped[date].forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td></td><td>${row.driver}</td><td>${row.unit}</td><td>${row.payment}</td>`;
        tbody.appendChild(tr);
      });
    });

    document.getElementById('totalEntry').textContent = `Total: ${json.total}`;
    playSound('success');
  } catch (err) {
    playSound('error');
  }
}

// --- BACK BUTTONS ---
document.getElementById('backToDashboard1').onclick = () => {
  document.getElementById('inputTab').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  playSound('klik');
};

document.getElementById('backToDashboard2').onclick = () => {
  document.getElementById('databaseTab').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  playSound('klik');
};

document.getElementById('btnBackMain').onclick = () => {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  playSound('klik');
};



