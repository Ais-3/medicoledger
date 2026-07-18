# Your Personal Ledger — standalone offline app

## ⚠️ Read this first if you're deploying via GitHub + Netlify
This is very likely the actual cause of "I fixed the code but it still shows the same error": **Netlify creates a brand new, permanently frozen URL for every single commit** when connected to GitHub. If you've been opening a link from inside an individual entry in Netlify's **Deploys** list (or a PR check link from GitHub), that link is locked to that one old commit forever — no future push can ever change what it shows.

**How to make sure you're looking at the current version:**
1. In Netlify, open your site → the **Deploys** tab → confirm the newest deploy says **Published** (not still "Building")
2. Go to your site's **Overview** page and use the URL shown at the very top (e.g. `yoursite.netlify.app`) — this is the one link that always points to whatever was deployed last
3. Open it in a **private/incognito window** the first time, so nothing old is cached in your regular browser
4. Check **Site settings → Build & deploy → your production branch** — confirm it matches the branch you're actually pushing to (usually `main`)

**This build has a built-in way to confirm you're looking at the right thing:** every page now shows a small build tag. Right now that's **`b6`** — visible in the browser tab title, the loading text, and in small gray text at the bottom of the app. If you ever don't see the current tag after I ship a fix, you are looking at a stale copy — full stop — and no code change will help until the stale link/cache is bypassed.

## What's in this folder
- `index.html` — the app shell
- `app.js` — the ledger itself (compiled, ready to run)
- `react-shim.js`, `react-dom-client-shim.js`, `lucide-shim.js` — small local adapter files (see "Why it broke" below)
- `storage-shim.js` — on-device storage (this is what makes your data actually persist)
- `manifest.json`, `sw.js`, `icon-*.png` — installability + offline support

## Why it broke, and what changed
The blank page / "Script error." was caused by React being loaded in a way that's more fragile than it needs to be. This build now loads React the way React's own official docs recommend — as a plain global script — instead of a more failure-prone module-based method. If anything ever does fail to load again (bad connection, CDN hiccup), you'll now see an actual error message on the page telling you what happened, instead of a blank screen or an unhelpful "Script error." A watchdog also catches the case where something just hangs instead of failing outright.

## 1. Deploying
**Via GitHub → Netlify:** push these files to your repo's production branch, wait for the Netlify deploy to say "Published," then open your site's main URL (see warning above).

**Via Netlify Drop (no GitHub, no signup):** go to **app.netlify.com/drop** and drag this whole folder onto the page — it gives you a live URL immediately.

## 2. Install it on each device
Open your live URL on your phone/iPad/laptop, then:
- **iPhone/iPad (Safari):** tap the Share icon → "Add to Home Screen"
- **Android (Chrome):** tap the ⋮ menu → "Add to Home screen" / "Install app"
- **Laptop (Chrome/Edge):** click the install icon (⊕) in the address bar

## 3. Moving data between devices
Data lives locally on each device — it doesn't sync automatically. Use the icons next to the page title:
- **Download icon** = Export a backup file
- **Upload icon** = Import a backup file (replaces current device's data)

## 4. Customizing sections
Tap the **gear icon** next to the page title:
- **Recolor any tab** — tap a color swatch under any section name
- **Add a new section** — name it, pick an icon and color, tap Create
- **Remove** a section you created (built-in ones can only be recolored, not removed)

Your color choices and custom sections are included in Export/Import backups.

## About future changes
If something needs fixing or a feature gets added, I'll bump the build tag so you can visually confirm you're on the new version, and the app will automatically clear out any old cached version on your device the first time it loads. Your data always stays put — it's stored completely separately from the code.

**Before any big change, tap Export first** to keep a backup on hand.
