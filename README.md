# Carwash Database 0.3

Web app untuk input dan melihat data Carwash entry, terhubung dengan Google Spreadsheet (`Carwash_database`).

## Fitur
- Login dengan secret code:
  - Admin: `Bungas03` → bisa entry, lihat database, edit & delete
  - Owner: `Khai2020` → hanya lihat database
- Entry form dengan:
  - Date (picker)
  - Driver/PO (dropdown/manual)
  - Unit (dropdown/manual)
  - Payment Method (Transfer/Cash segment control)
- Database tab:
  - Lihat semua data entry
  - Filter per bulan
  - Edit & delete entry (admin)
- Popout dan sound effect
- Mobile-first, vertical scroll, center content
- PWA ready (manifest.json + service worker)

## Setup
1. Deploy Google Apps Script dengan `code.gs` sebagai Web App.
2. Ganti `WEB_APP_URL` di `script.js` dengan URL Web App.
3. Upload semua file ke GitHub repository.
4. Aktifkan GitHub Pages pada branch `main` (root folder).
5. Buka web di smartphone → bisa add to home screen.

## Struktur File
