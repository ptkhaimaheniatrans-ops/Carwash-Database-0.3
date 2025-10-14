const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzU8B1jrHtB6XrLTdwNbnahCb1uRBFwYT6w3uAnEfUSJhMM5u8o5N0fZ-MIW6WI797ryw/exec";

const sounds = {
  klik: new Audio("assets/sounds/klik.mp3"),
  success: new Audio("assets/sounds/success.mp3"),
  error: new Audio("assets/sounds/error.mp3"),
  welcome: new Audio("assets/sounds/welcome.mp3")
};

// Loading animation
const loadingText = document.getElementById("loading-text");
let loadingStr = "Loading . . . Please wait, your data in sync.";
let i = 0;
function typeWriter() {
  if (i < loadingStr.length) {
    loadingText.innerHTML += loadingStr.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  } else {
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
  }
}
typeWriter();

// Login
document.getElementById("login-btn").addEventListener("click", () => {
  sounds.klik.play();
  const code = document.getElementById("secret-code").value;
  if(code === "Bungas03" || code === "Khai2020") {
    document.getElementById("login-screen").classList.add("hidden");
    const welcomePop = document.getElementById("welcome-popout");
    welcomePop.classList.remove("hidden");
    sounds.welcome.play();
    setTimeout(() => {
      welcomePop.classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      if(code === "Khai2020") {
        document.querySelector('[data-tab="entry"]').style.display = "none";
      }
      loadDatabase();
    }, 2000);
  } else {
    showPopout("Oopsie! Invalid Code", "error");
  }
});

// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    sounds.klik.play();
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
    document.getElementById(tab+"-tab").classList.remove("hidden");
    if(tab==="database") loadDatabase();
  });
});

// Segment control click
document.querySelectorAll(".segment-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    sounds.klik.play();
    document.querySelectorAll(".segment-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Entry form submit
document.getElementById("entry-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  sounds.klik.play();
  const data = {
    date: document.getElementById("date").value,
    driver_or_po: document.getElementById("driver_or_po").value,
    unit: document.getElementById("unit").value,
    payment_method: document.querySelector(".segment-btn.active")?.dataset.method || ""
  };
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if(json.status === "success") {
      showPopout("Data entry success!", "success");
      document.getElementById("entry-form").reset();
      document.querySelectorAll(".segment-btn").forEach(b=>b.classList.remove("active"));
      loadDatabase();
    } else {
      showPopout("Data mismatch! Try again :)", "error");
    }
  } catch(err) {
    showPopout("Error connecting to server", "error");
  }
});

// Popout message
function showPopout(message, type) {
  const pop = document.getElementById("popout-msg");
  const text = document.getElementById("popout-text");
  text.textContent = message;
  pop.classList.remove("hidden");
  if(type==="success") sounds.success.play();
  if(type==="error") sounds.error.play();
  setTimeout(()=>pop.classList.add("hidden"),2000);
}

// Load database
async function loadDatabase(month, year){
  let url = WEB_APP_URL;
  if(month && year) url += `?month=${month}&year=${year}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    renderDatabase(data);
  } catch(err){
    showPopout("Error fetching database", "error");
  }
}

// Render database
function renderDatabase(data){
  const dbList = document.getElementById("db-list");
  dbList.innerHTML = "";

  if(data.length === 0) {
    dbList.innerHTML = "<p>No entries found.</p>";
    return;
  }

  const table = document.createElement("table");

  // Table header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Driver/PO</th>
      <th>Unit</th>
      <th>Payment Method</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.dataset.id = row[0];
    tr.innerHTML = `
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);

    // Event Edit & Delete
    tr.querySelector(".edit-btn").addEventListener("click", ()=>{
      // logic edit
    });
    tr.querySelector(".delete-btn").addEventListener("click", ()=>{
      // logic delete
    });
  });

  table.appendChild(tbody);
  dbList.appendChild(table);

  document.getElementById("db-total").textContent = "Total entries: " + data.length;
}

// Tombol Delete & Confirm
const deleteBtn = document.getElementById("delete-btn");
const confirmBtn = document.getElementById("confirm-btn");

// Klik Delete → munculkan tombol Yes
deleteBtn.addEventListener("click", () => {
  confirmBtn.classList.remove("hidden");
});

// Klik Yes → hapus entry yang dicentang
confirmBtn.addEventListener("click", async () => {
  const checkedBoxes = document.querySelectorAll(".entry-checkbox:checked");
  if(checkedBoxes.length === 0){
    showPopout("Please select at least one entry", "error");
    return;
  }

  for(const box of checkedBoxes){
    const tr = box.closest("tr");
    const id = tr.dataset.id;

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({ action: "delete", id })
      });
      const json = await res.json();
      if(json.status !== "success"){
        showPopout("Failed to delete ID: " + id, "error");
      }
    } catch(err){
      showPopout("Error deleting ID: " + id, "error");
    }
  }

  confirmBtn.classList.add("hidden");
  loadDatabase(); // refresh tabel
});

// Render database → tambah checkbox
function renderDatabase(data){
  const dbList = document.getElementById("db-list");
  dbList.innerHTML = "";

  if(data.length === 0) {
    dbList.innerHTML = "<p>No entries found.</p>";
    return;
  }

  const table = document.createElement("table");

  // Header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Driver/PO</th>
      <th>Unit</th>
      <th>Payment Method</th>
      <th>Select</th>
    </tr>
  `;
  table.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.dataset.id = row[0]; // unique ID
    tr.innerHTML = `
      <td>${row[2]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
      <td><input type="checkbox" class="entry-checkbox"></td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  dbList.appendChild(table);
  document.getElementById("db-total").textContent = "Total entries: " + data.length;
}

// Filter per month
document.getElementById("filter-btn").addEventListener("click", ()=>{
  sounds.klik.play();
  const monthYear = document.getElementById("filter-month").value; // YYYY-MM
  if(monthYear){
    const [year, month] = monthYear.split("-");
    loadDatabase(parseInt(month), parseInt(year));
  } else loadDatabase();
});

const leaveBtn = document.getElementById("leave-btn");

leaveBtn.addEventListener("click", () => {
  sounds.klik.play(); // optional sound
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("secret-code").value = ""; // kosongkan input
});
