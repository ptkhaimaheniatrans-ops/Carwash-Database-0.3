// ============================
// GLOBAL VARIABLES
// ============================
const secretCodes = { "Bungas03": "user1", "Khai2020": "user2" };
let currentUser = null;

// ELEMENTS
const loadingText = document.getElementById('loading-text');
const loadingPage = document.getElementById('loading');
const loginPage = document.getElementById('login-page');
const connectBtn = document.getElementById('connect-btn');
const secretInput = document.getElementById('secret-code');
const welcomePopup = document.getElementById('welcome-popup');
const dashboard = document.getElementById('dashboard');
const inputEntryTab = document.getElementById('input-entry-tab');
const databaseTab = document.getElementById('database-tab');
const inputEntry = document.getElementById('input-entry');
const database = document.getElementById('database');
const backEntry = document.getElementById('back-entry');
const backDB = document.getElementById('back-db');
const entryForm = document.getElementById('entry-form');
const dbTableBody = document.querySelector('#db-table tbody');
const totalEntry = document.getElementById('total-entry');
const filterMonth = document.getElementById('filter-month');
const searchBtn = document.getElementById('search-btn');

// AUDIO
const soundClick = document.getElementById('sound-click');
const soundWelcome = document.getElementById('sound-welcome');
const soundSuccess = document.getElementById('sound-success');
const soundError = document.getElementById('sound-error');

// WEB APP URL (ganti dengan deployment Apps Script Web App)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxCjshGDhCLD71lWeWlVZ8-D7GJIWut1kpd4uSmruvMNpK-brBs8kraI2ccPEAGDA7WCw/exec";

// ============================
// LOADING TYPEWRITER
// ============================
let loadStr = "Loading . . . Please Wait.";
let i = 0;
function typeWriter() {
  if (i < loadStr.length) {
    loadingText.innerHTML += loadStr.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(() => {
      loadingPage.classList.add('hidden');
      loginPage.classList.remove('hidden');
    }, 5000);
  }
}
typeWriter();

// ============================
// LOGIN
// ============================
connectBtn.addEventListener('click', () => {
  soundClick.play();
  const code = secretInput.value.trim();
  if (secretCodes[code]) {
    currentUser = secretCodes[code];
    loginPage.classList.add('hidden');
    welcomePopup.classList.remove('hidden');
    soundWelcome.play();
    setTimeout(() => {
      welcomePopup.classList.add('hidden');
      dashboard.classList.remove('hidden');
      if (currentUser === 'user2') inputEntryTab.style.display = 'none';
    }, 2000);
  } else {
    soundError.play();
    alert("Oopsie! Wrong Move!");
  }
});

// ============================
// DASHBOARD TABS
// ============================
inputEntryTab.addEventListener('click', () => {
  dashboard.classList.add('hidden');
  inputEntry.classList.remove('hidden');
});

databaseTab.addEventListener('click', () => {
  dashboard.classList.add('hidden');
  database.classList.remove('hidden');
  loadDatabase();
});

backEntry.addEventListener('click', () => {
  inputEntry.classList.add('hidden');
  dashboard.classList.remove('hidden');
});

backDB.addEventListener('click', () => {
  database.classList.add('hidden');
  dashboard.classList.remove('hidden');
});

// ============================
// SUBMIT INPUT ENTRY
// ============================
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  soundClick.play();

  const data = {
    date: document.getElementById('entry-date').value,
    driver_or_po: document.getElementById('entry-driver').value,
    unit: document.getElementById('entry-unit').value,
    payment_method: document.querySelector('input[name="payment"]:checked').value
  };

  fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify({action: 'add', entry: data}),
    headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === 'success') {
      soundSuccess.play();
      alert("Success! Entry added.");
      entryForm.reset();
      loadDatabase(); // refresh table
    } else {
      soundError.play();
      alert("Error: " + res.message);
    }
  })
  .catch(() => {
    soundError.play();
    alert("Network error!");
  });
});

// ============================
// LOAD DATABASE
// ============================
function loadDatabase() {
  fetch(`${WEB_APP_URL}?action=get`)
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        renderDatabase(res.data);
      } else {
        alert("Error loading database!");
      }
    })
    .catch(() => alert("Network error!"));
}

// ============================
// RENDER DATABASE TABLE (grouped by date)
// ============================
function renderDatabase(entries) {
  dbTableBody.innerHTML = '';
  let grouped = {};
  entries.forEach(e => {
    // Ubah date string menjadi format "D MMM YYYY"
    let dateObj = new Date(e.date);
    let formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    e.dateFormatted = formattedDate;

    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(e);
  });

  let total = 0;
  Object.keys(grouped).sort((a,b) => new Date(a) - new Date(b)).forEach(date => {
    let row = document.createElement('tr');
    let th = document.createElement('td');
    th.colSpan = 4;
    th.style.fontWeight = 'bold';
    th.textContent = date; // Group header
    row.appendChild(th);
    dbTableBody.appendChild(row);

    grouped[date].forEach(entry => {
      let r = document.createElement('tr');
      r.innerHTML = `
        <td>${entry.dateFormatted}</td>
        <td>${entry.driver_or_po}</td>
        <td>${entry.unit}</td>
        <td>${entry.payment_method}</td>
      `;
      r.dataset.id = entry.unique_id;
      r.addEventListener('click', () => confirmDelete(entry.unique_id));
      dbTableBody.appendChild(r);
      total++;
    });
  });

  totalEntry.textContent = `Total: ${total}`;
}

// ============================
// DELETE CONFIRM POPUP
// ============================
function confirmDelete(uniqueId) {
  if (confirm("Are you sure you want to delete this entry?")) {
    soundClick.play();
    fetch(WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify({action: 'delete', uniqueId: uniqueId}),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        soundSuccess.play();
        loadDatabase();
      } else {
        soundError.play();
        alert("Error: " + res.message);
      }
    })
    .catch(() => {
      soundError.play();
      alert("Network error!");
    });
  }
}

// ============================
// FILTER DATABASE
// ============================
searchBtn.addEventListener('click', () => {
  soundClick.play();
  const filter = filterMonth.value; // format YYYY-MM
  fetch(`${WEB_APP_URL}?action=get`)
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        let data = res.data;
        if (filter) data = data.filter(e => e.date.startsWith(filter));
        renderDatabase(data);
      }
    });
});

