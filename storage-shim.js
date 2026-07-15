// Real, persistent, on-device storage — replaces the window.storage API
// the app was originally built against. Backed by localStorage, namespaced
// so it never collides with anything else on the host page.
(function () {
  const PREFIX = "ledger:";

  function read(key) {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    return { key, value: raw, shared: false };
  }

  function write(key, value) {
    localStorage.setItem(PREFIX + key, value);
    return { key, value, shared: false };
  }

  window.storage = {
    async get(key) {
      try {
        return read(key);
      } catch (e) {
        return null;
      }
    },
    async set(key, value) {
      try {
        return write(key, value);
      } catch (e) {
        console.error("Storage write failed (device storage may be full):", e);
        return null;
      }
    },
    async delete(key) {
      try {
        const existed = localStorage.getItem(PREFIX + key) !== null;
        localStorage.removeItem(PREFIX + key);
        return { key, deleted: existed, shared: false };
      } catch (e) {
        return null;
      }
    },
    async list(prefix) {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) {
            const bare = k.slice(PREFIX.length);
            if (!prefix || bare.startsWith(prefix)) keys.push(bare);
          }
        }
        return { keys, prefix, shared: false };
      } catch (e) {
        return null;
      }
    },
  };
})();
