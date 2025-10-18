# Carwash-Database-0.3

Digital dashboard & entry system untuk data carwash, siap dihosting di GitHub Pages.

## Struktur File
index.html
style.css
script.js
manifest.json
service-worker.js
assets/
icons/
icon-192.png
icon-512.jpg
sounds/
klik.mp3
welcome.mp3
error.mp3
success.mp3


## Fitur

- Login dengan secret code (2 user berbeda)
- Input Entry (User 1 only)
- Database (lihat & delete entry)
- Table grouped by Date
- Filter database berdasarkan bulan
- Sound effects: klik, welcome, success, error
- Popout Welcome & Confirmation delete
- Mobile-friendly & centered layout
- PWA ready (manifest + service worker)

## Deployment

1. Upload semua file ke GitHub Repository
2. Enable GitHub Pages
3. Update `WEB_APP_URL` di `script.js` dengan Apps Script Web App URL
4. Test di browser / smartphone

## Notes

- Apps Script harus di-deploy sebagai Web App dengan:
  - Execute as: Me
  - Who has access: Anyone, even anonymous
- Dropdown di Input Entry bisa ketik manual jika tidak ada di list
- Semua layout menggunakan font VT323 dan monospace
