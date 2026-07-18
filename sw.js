const CACHE_NAME = "ledger-cache-b7";

// Same-origin files — required, install fails loudly if any of these are missing.
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./storage-shim.js",
  "./react-shim.js",
  "./react-dom-client-shim.js",
  "./lucide-shim.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];

// Cross-origin CDN dependencies — precached on install so offline works after
// just ONE successful visit, instead of requiring a second visit (a service
// worker can't intercept the very first page load, so without this list,
// these would only get cached opportunistically on visit #2+).
const CDN_ASSETS = [
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://cdn.tailwindcss.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CORE_ASSETS); // must succeed — these are ours, always reachable
      // CDN assets are best-effort: don't let one flaky fetch block the whole
      // install (the app can still limp along on next online visit if these
      // don't land yet).
      await Promise.all(
        CDN_ASSETS.map((url) =>
          fetch(url, { mode: "cors" })
            .then((res) => { if (res.ok) return cache.put(url, res); })
            .catch(() => {})
        )
      );
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Stale-while-revalidate for everything: serve the cached copy immediately
// (fast, works offline), but always kick off a background fetch to refresh
// the cache for next time. This is the key fix for "stuck on an old
// version forever" — pure cache-first (the previous strategy) never
// re-checks the network once something is cached, so a page could serve a
// stale build indefinitely with no way to self-correct short of a full
// cache wipe. Stale-while-revalidate self-heals within one extra reload.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);

      const network = fetch(req, req.url.startsWith(self.location.origin) ? {} : { mode: "cors" })
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) {
        // Don't block the response on the network — update the cache quietly
        // in the background for the next load.
        network;
        return cached;
      }
      const fresh = await network;
      if (fresh) return fresh;
      // Nothing cached and network failed — only real recourse when totally offline
      // on a never-before-seen resource.
      return new Response("Offline and this resource was never cached.", { status: 503 });
    })()
  );
});
