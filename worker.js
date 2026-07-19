// Personal Ledger — sync backend
//
// Two API routes, backed by Cloudflare KV (env.LEDGER_KV):
//   POST /api/save   { passcode, payload, updatedAt }  -> stores payload under a hash of passcode
//   GET  /api/load?passcode=...                        -> returns { updatedAt, payload } or 404
//
// The passcode itself is never stored — only its SHA-256 hash is used as the
// KV key, so the raw passcode isn't visible in the KV dashboard or logs.
//
// Everything else falls through to the static files (index.html, app.js,
// etc.) via the "assets" binding configured in wrangler.jsonc.

async function hashPasscode(passcode) {
  const enc = new TextEncoder().encode("ledger-v1:" + passcode);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/save" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return json({ error: "Invalid JSON body" }, 400);
      }
      const { passcode, payload, updatedAt } = body || {};
      if (!passcode || typeof passcode !== "string" || passcode.length < 4) {
        return json({ error: "Passcode must be at least 4 characters" }, 400);
      }
      if (!payload) {
        return json({ error: "Missing payload" }, 400);
      }
      const key = "user:" + (await hashPasscode(passcode));
      const record = { updatedAt: updatedAt || new Date().toISOString(), payload };
      await env.LEDGER_KV.put(key, JSON.stringify(record));
      return json({ ok: true, updatedAt: record.updatedAt });
    }

    if (url.pathname === "/api/load" && request.method === "GET") {
      const passcode = url.searchParams.get("passcode");
      if (!passcode || passcode.length < 4) {
        return json({ error: "Passcode must be at least 4 characters" }, 400);
      }
      const key = "user:" + (await hashPasscode(passcode));
      const raw = await env.LEDGER_KV.get(key);
      if (!raw) return json({ error: "No data found for this passcode yet" }, 404);
      return json(JSON.parse(raw));
    }

    // Everything else: serve the static app files.
    return env.ASSETS.fetch(request);
  },
};
