# Sugar Khata (Demo)

Billing, GST invoicing, credit register and reports for a sugar wholesale business.
Works as a web app, an installable PWA and an Android APK.

This repository is a **demo**: it uses fictional business details and sample data that stays on your own device. No login or server is needed. Type any email and password on the login screen.

## Features
- GST tax invoice (CGST + SGST or IGST) with Original / Duplicate / Office copies and print support
- Credit register that clears the oldest bill first when a payment is received
- Sales and pending-dues reports (today, month, year, all)
- Katta to quintal conversion for the sugar trade
- Hindi and English, light and dark theme

## Tech
JavaScript, HTML, CSS, PWA, Capacitor (Android), GitHub Actions. The full version uses Supabase (PostgreSQL, Auth, Realtime, Row Level Security) for multi-device sync; this demo replaces it with `demo.js`.

## Download
Open the **Releases** section on the right side of this page and download `SugarKhata-Demo.apk`.
