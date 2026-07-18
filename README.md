# Your Personal Ledger — standalone offline app

## What's in this folder
- `index.html` — the app shell
- `app.js` — the ledger itself (compiled, ready to run — no build step needed)
- `storage-shim.js` — on-device storage (this is what makes your data actually persist)
- `manifest.json`, `sw.js`, `icon-*.png` — what makes it installable and work offline

## 1. Put it online (takes ~1 minute, no signup)
1. Go to **https://app.netlify.com/drop** in a browser
2. Drag this whole folder onto the page
3. It gives you a live URL immediately (something like `random-name-123.netlify.app`)

That URL is now your app's home. No account needed for this step — though if you want the URL to stay stable forever instead of being tied to a temporary session, you can optionally claim it with a free Netlify account afterward.

*(Alternative if you'd rather not use Netlify: GitHub Pages or Cloudflare Pages both work too — just need a free account.)*

## 2. Install it on each device
Open that URL on your phone/iPad/laptop, then:
- **iPhone/iPad (Safari):** tap the Share icon → "Add to Home Screen"
- **Android (Chrome):** tap the ⋮ menu → "Add to Home screen" / "Install app"
- **Laptop (Chrome/Edge):** click the install icon (⊕) in the address bar

Once installed, it opens like a real app and works fully offline — no data connection needed.

## 3. Moving data between devices
Data lives locally on each device (that's what makes offline possible) — it doesn't sync automatically. Use the two icons next to the page title:
- **Download icon** = Export a backup file (`ledger-backup-2026-07-15.json`)
- **Upload icon** = Import a backup file (replaces current device's data)

So: export on your phone → AirDrop/email yourself the file → import on your iPad. Takes a few seconds.

## About future changes
If you ever want a feature added or a bug fixed, I can hand you an updated `app.js` (and only that file, usually) to drop back into this same folder. Your existing data stays exactly where it is — the code and your data are stored completely separately. Just re-upload the changed file(s) to the same host and refresh.

**Before any big change, tap the Export icon first** to keep a backup on hand, just in case.
