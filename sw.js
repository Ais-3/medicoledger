const CACHE_NAME = "ledger-cache-b9";

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

// Stale-while-revalidate: serve the cached copy immediately (fast, works
// offline), while quietly refreshing the cache in the background for next
// time.
//
// IMPORTANT BUG FIX (this is what caused "Script error." specifically after
// installing to the home screen): the previous version, when a cross-origin
// request was neither cached NOR reachable over the network, returned a
// synthetic plain-text Response ("Offline and this resource was never
// cached.") as a stand-in. For a <script src="..."> request, the browser
// doesn't care that the body isn't real JS — it tries to EXECUTE that text
// as a script anyway. "Offline and this resource..." is not valid
// JavaScript, so it throws a SyntaxError — and because that error is
// attributed to a cross-origin script URL, the browser sanitizes it down to
// the generic, undebuggable "Script error." with zero detail. That's
// exactly the symptom reported. The fix: never synthesize a fake body for a
// failed fetch — let the failure propagate as a real network error instead,
// so the browser (and our own onerror handlers in index.html) can report it
// properly.
//
// Also fixed: previously called fetch(req, { mode: "cors" }) — passing a
// second options argument to override an existing Request's mode is
// unreliable across browsers when the two disagree. Plain fetch(req) always
// respects the request's own mode and is spec-safe everywhere.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);

      const networkFetch = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) {
        // Don't block the response on the network — update the cache quietly
        // for the next load. Swallow any rejection so it can't surface as an
        // unhandled promise rejection.
        networkFetch.catch(() => {});
        return cached;
      }

      const fresh = await networkFetch;
      if (fresh) return fresh;

      // Nothing cached and the network failed — this is a genuine failure.
      // Let it propagate as a real error rather than inventing a response
      // body, so callers (script tags, fetch(), import()) see an honest
      // network failure instead of malformed content.
      throw new Error("Resource unavailable: not cached and network fetch failed for " + req.url);
    })()
  );
});
