# Vector Surveillance field app — PWA deployment

Static files only. No build step, no server code.

## Deploy on GitHub Pages
1. Create a repo, e.g. `ento-field-app`.
2. Copy the **contents of this folder** into the repo root (index.html at the top level).
3. Push, then Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
4. Open `https://<user>.github.io/ento-field-app/` on a phone → Share → Add to Home Screen.

HTTPS is required for the service worker; GitHub Pages provides it.

## Files
| File | Purpose |
|---|---|
| index.html | The app |
| User Administration.dc.html | Admin console, loaded on demand |
| support.js | Runtime |
| users.js | User directory (accounts, PINs, roles) |
| geo.json | Cambodia gazetteer |
| ento-seed.json | Household seed data — replace to change the dataset |
| _ds/… | CHAI design system: tokens, styles, fonts |
| manifest.webmanifest | Install metadata |
| sw.js | Offline cache |
| app-icon-*.png | Home-screen icons |

## Live data
The Sheet pull reads `ento-seed.json`. To point it at Apps Script, edit `index.html` and replace the three `'ento-seed.json'` fallbacks with your `/exec` URL. The service worker already treats that host as network-first.

## Updating
Bump `VERSION` in `sw.js` on every deploy, otherwise phones keep serving the cached build.

## Accounts
All PINs are `1234`.

| Username | Role |
|---|---|
| admin | Admin — sees user administration |
| vichea.s | Supervisor — can pull from Sheet |
| sokha.p, dara.k | Collector |
| chantha.l | Lab technician |
| ratana.m | Collector, deactivated |
