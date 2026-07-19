# Your Personal Ledger — now with automatic sync

## ⚠️ One-time setup required: create the database
This version saves your data to a small Cloudflare database (KV) so it syncs
automatically across devices. You need to create that database once —
I can't do this step for you, it has to happen in your Cloudflare dashboard.

1. Go to **dash.cloudflare.com** → in the left sidebar, find **Storage & Databases** → **KV**
2. Click **Create a namespace**
3. Name it anything (e.g. `ledger-data`) → Create
4. Click into the namespace you just made, and copy its **Namespace ID** (a long string of letters/numbers)
5. Open `wrangler.jsonc` in this folder, find this part:
   ```
   "kv_namespaces": [
     {
       "binding": "LEDGER_KV",
       "id": "PASTE_YOUR_KV_NAMESPACE_ID_HERE"
     }
   ]
   ```
6. Replace `PASTE_YOUR_KV_NAMESPACE_ID_HERE` with the ID you copied
7. Upload all the files in this folder to your GitHub repo (overwrite existing ones), commit
8. Cloudflare redeploys automatically

## How syncing works now
Tap the **circular arrow icon** (🔄) next to the page title:
- **First device:** choose "New passcode," pick something private, confirm it. This device now syncs automatically.
- **Every other device:** open the same site, tap the sync icon, choose "I have one already," enter that same passcode. It pulls in your data and starts syncing automatically too.

From then on, changes save to the server a couple seconds after you make them (whenever you're online), and pull in automatically when you open the app on another device. No more manual export/import needed for keeping devices in sync — though the Export/Import buttons are still there if you ever want an offline backup file too.

**Important limits, to set expectations honestly:**
- If you edit the same data on two devices at the *exact same time* while both are offline, whichever one reconnects and syncs last will overwrite the other's changes. This isn't built for true simultaneous multi-editor conflict resolution — it's last-write-wins by clock, which fits normal one-device-at-a-time use well.
- Write down your passcode somewhere. It can't be recovered or reset if you forget it — you'd just start fresh with a new one.
- The passcode itself is never stored on the server, only a scrambled (hashed) version of it, so even Cloudflare can't see it in plain text.

## Everything else (unchanged)
- **Install on home screen:** open the site, Share/Menu → "Add to Home Screen"
- **Customize:** gear icon → recolor tabs, add custom sections
- **Manual backup:** Download/Upload icons still work exactly as before, independent of sync

## If something needs fixing later
Tell me what's happening and I'll send updated files — same process: replace the files in your repo, commit, Cloudflare redeploys. Your data (both synced and local) stays completely separate from the code, so updates never touch it.
