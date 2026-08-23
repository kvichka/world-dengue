// Vector Surveillance field app — offline shell
const VERSION = 'ento-v1';
const ASSETS = [
  "./",
  "index.html",
  "User%20Administration.dc.html",
  "support.js",
  "geo.json",
  "ento-seed.json",
  "app-icon-180.png",
  "app-icon-512.png",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/styles.css",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/_ds_bundle.js",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/tokens/colors.css",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/tokens/fonts.css",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/tokens/spacing.css",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/tokens/typography.css",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/fonts/Trebuchet_MS.ttf",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/fonts/Trebuchet_MS_Bold.ttf",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/fonts/Trebuchet_MS_Bold_Italic.ttf",
  "_ds/chai-design-system-eb475a38-cb32-41b6-a2ce-822ca75afe8d/fonts/Trebuchet_MS_Italic.ttf",
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600&display=swap"
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // add one at a time so a single failed CDN asset does not abort the install
    await Promise.all(ASSETS.map((u) => c.add(new Request(u, { mode: u.startsWith('http') ? 'cors' : 'same-origin' })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isData = url.pathname.endsWith('ento-seed.json') || /script\.google\.com/.test(url.hostname);

  if (isData) {
    // network first: pulling from the Sheet should get fresh data when online
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res && res.ok) (await caches.open(VERSION)).put(req, res.clone());
        return res;
      } catch (_) {
        return (await caches.match(req)) || Response.error();
      }
    })());
    return;
  }

  // cache first for the shell
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: false });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok && (url.origin === location.origin || /unpkg|gstatic|googleapis/.test(url.hostname))) {
        (await caches.open(VERSION)).put(req, res.clone());
      }
      return res;
    } catch (_) {
      if (req.mode === 'navigate') return (await caches.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
