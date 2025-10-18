# 🚗 Carwash Database 0.3

A simple PWA (Progressive Web App) to record and view carwash entries connected to Google Sheets through Google Apps Script.

---

## 📂 Project Structure

.
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
├── README.md
└── assets/
├── icons/
│ ├── icon-192.png
│ └── icon-512.jpg
└── sound/
├── klik.mp3
├── success.mp3
├── error.mp3
└── welcome.mp3


---

## ⚙️ Features

- Secure login with secret code
- Input new carwash data
- View monthly database from Google Sheets
- Offline support via service worker
- Sound effects for actions and notifications

---

## 🔊 Sound Effects

| Action | Sound File | Description |
|--------|-------------|-------------|
| All button clicks (connect, submit, back, dropdown, etc.) | `klik.mp3` | Click sound |
| Successful login | `success.mp3` | Login success |
| Wrong password or invalid submission | `error.mp3` | Error sound |
| Welcome pop-up | `welcome.mp3` | Greeting sound |

---

## 🧠 Notes

- Make sure to update your **Apps Script Web App URL** inside `script.js`  
  ```js
  const SCRIPT_URL = "YOUR_DEPLOYED_APPS_SCRIPT_URL";
