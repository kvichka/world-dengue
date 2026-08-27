# Dengue Situation Dashboard — Cambodia + Global Context

A single web page with two tabs:

- **Cambodia** — the national DHF surveillance dashboard (NDCP data, by province,
  2018 to now). Unchanged from the national-only version.
- **Global Context** — where Cambodia sits among other countries, from WHO's
  global dengue surveillance feed.

Everything in this folder is ready to upload to GitHub Pages as-is.

## What's in this folder

```
index.html                    the dashboard — all HTML/CSS/JS, no embedded data
.nojekyll                     tells GitHub Pages to serve the files as-is
Data/
  dengue-data.json            national data      (built by update_data.py)
  who-dengue-global.json      global data        (built by update_world_data.py)
  who-dengue-global.csv       the full WHO feed, for Excel — not used by the page

Dengue_Master_Data_Entry.xlsx  your national data — edit this every week
static_assets.json             rarely-changing reference data — don't touch

UPDATE-DASHBOARD.bat/.command  <-- START HERE: runs both updates in one go
update_data.py                 rebuilds Data/dengue-data.json from the Excel file
update_data.bat / .command     double-click launchers for the above
update_world_data.py           rebuilds the two WHO files from the internet
update_world_data.bat/.command double-click launchers for the above
```

`index.html` loads its data with `fetch()` at runtime, so it must be served over
`http://` or `https://`. **Double-clicking `index.html` will not work** — browsers
block `fetch()` of local files. See "Testing locally" below.

The global data is only fetched when you actually open the Global Context tab, so
the Cambodia tab loads just as fast as it did before.

## Putting this on GitHub Pages

1. **Create a repository** on GitHub (or use an existing one).
2. **Upload the whole folder contents**, keeping `Data/` sitting next to
   `index.html`.
   - Easiest: on the repo page, **Add file → Upload files**, drag everything in,
     commit.
   - Or from a terminal in this folder:
     ```
     git init
     git add .
     git commit -m "Dengue dashboard with global context"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<your-repo>.git
     git push -u origin main
     ```
3. **Turn on Pages**: repo **Settings → Pages**, set **Source** to "Deploy from a
   branch", pick **main** and **/ (root)**, **Save**.
4. Wait 30 seconds to a couple of minutes. The same screen then shows your URL:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```

The `.nojekyll` file is already included — without it GitHub can be fussy about
serving some files, so leave it in place.

### A note on what you are publishing

GitHub Pages sites are public to anyone with the link. The national numbers in
`Data/dengue-data.json` are aggregate province-month counts with no personal
information, but if NDCP treats any of this as pre-release, confirm before
pushing — once it is on a public URL it can be cached and indexed even if you
later delete it.

## Updating the data

### The easy way — one file to double-click

1. Edit `Dengue_Master_Data_Entry.xlsx` with the week's new rows.
2. Double-click **`UPDATE-DASHBOARD.bat`** (Windows) or
   **`UPDATE-DASHBOARD.command`** (Mac).
3. Read what it prints at the end — it names exactly which files to upload.
4. Upload those files to GitHub, replacing the old ones. Commit.

It runs both refreshes in order and tells you plainly what happened:

- **Step 1, national** — rebuilds `Data/dengue-data.json` from your Excel file.
  This is the one that matters, so if it fails the run stops there and says so;
  nothing half-finished gets uploaded.
- **Step 2, WHO global** — downloads the world data. **This step is allowed to
  fail.** No internet, WHO down, on a plane — it says "DONE, but only partly",
  keeps your national update, and leaves the previous WHO data in place. Your
  weekly job is never blocked by someone else's server.

You do **not** need `index.html` for a data refresh, and viewers won't get a
stale cached copy — the page revalidates its data files on every load. GitHub
Pages redeploys about a minute after you commit.

### Running just one half

The individual launchers are still there if you want a single step:

| File | Does |
|---|---|
| `update_data.bat` / `.command` | National only — rebuilds `Data/dengue-data.json` |
| `update_world_data.bat` / `.command` | WHO only — rebuilds `Data/who-dengue-global.json` + `.csv` |

There is little point refreshing WHO every week: it publishes on a bi-weekly
cycle and its Cambodia figure already trails NDCP by about three weeks, so most
weeks it would download the same numbers back. Monthly is plenty.

### If Windows says Python was not found

Windows ships a placeholder `python.exe` that only opens the Microsoft Store.
The launchers detect this and prefer the real `py` launcher, but if you see the
Store open, Python is not properly installed: get it from
<https://python.org> and tick **"Add Python to PATH"** during setup.

## Reading the Global Context tab honestly

WHO's feed is a genuinely different source from NDCP, and it is uneven. The tab
is built to show that unevenness rather than smooth it over, because most ways
of charting this data quietly mislead. Specifically:

- **Absent is not zero.** Countries that submitted nothing are named in prose
  under each chart, never drawn as an empty bar. Viet Nam has submitted nothing
  for 2026; the Philippines is missing from the feed in *every* year, despite
  normally being one of the region's largest burdens. So "Cambodia ranks #1 in
  the Western Pacific" is really "#1 among countries that reported".
- **Reporting lag differs by weeks.** Every country carries the date its data
  actually runs to. Comparing raw year-to-date totals between two countries with
  different cut-offs compares different lengths of year.
- **Deaths are a floor, not a count.** Many countries report cases and leave
  deaths blank. Cambodia's own 2025 deaths come through WHO as 0 against a true
  national figure of 79.
- **No incidence rates.** WHO's feed carries population for only about a quarter
  of countries, and not for Cambodia, so cases per 100,000 cannot be computed
  across countries here. All global charts are raw counts. (The Cambodia tab
  *does* have real incidence rates, from NIS population projections.)
- **WHO and NDCP disagree, and card G6 shows exactly where.** WHO lags NDCP by a
  few weeks on the current year, and its 2024 total differs by about 16%. For
  Cambodia, **use the national tab** — the global tab is for comparison only.

`update_world_data.py` prints every cleaning decision it makes when you run it,
including the ~9,000 empty placeholder weeks it excludes and the countries that
have gone silent. It is worth reading that output after a refresh.

## Testing locally before pushing

```
cd path/to/this/folder
py -m http.server 8000
```
(on Mac: `python3 -m http.server 8000`). Then open `http://localhost:8000/`.

## External dependencies (loaded via CDN, need internet)
- Chart.js 4.5.1 — `cdn.jsdelivr.net`
- Leaflet 1.9.4 — `unpkg.com`
- Google Fonts (Inter, Noto Sans Khmer) — `fonts.googleapis.com`

These load automatically when the page is opened online. The dashboard won't
render correctly without internet access at least once per visit (browsers cache
them afterwards).

## Data sources

- **National** — NDCP DHF weekly reports, entered into
  `Dengue_Master_Data_Entry.xlsx`. Population from NIS Population Projection
  2020–2033.
- **Global** — WHO. The same reference list appears at the foot of the Global
  Context tab in the dashboard itself.

  | Reference | What it is |
  |---|---|
  | [WHO Global Dengue Surveillance Dashboard](https://worldhealthorg.shinyapps.io/dengue_global/) | The source of every figure on the Global tab; WHO's own interactive view of the same data. |
  | [`xmart-api-public.who.int/ARBOV/V_DENGUE_GLOBAL_VALIDATED_PUBLIC`](https://xmart-api-public.who.int/ARBOV/V_DENGUE_GLOBAL_VALIDATED_PUBLIC) | The open endpoint `update_world_data.py` downloads. No key or login needed. |
  | [WHO Western Pacific — Dengue Situation Updates](https://www.who.int/westernpacific/wpro-emergencies/surveillance/dengue) | Bi-weekly regional bulletins (PDF) covering Cambodia and its neighbours, with narrative context the feed does not carry. |
  | [WHO fact sheet — Dengue and severe dengue](https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue) | Background on transmission, clinical classification (DF/DHF/DSS) and case definitions. |

  WHO's own caveat on the data: the global dengue surveillance system "is still
  under development and the sensitivity varies substantially between countries
  and regions." Case definitions and surveillance intensity are not consistent
  between countries or over time.
