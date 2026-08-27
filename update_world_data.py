#!/usr/bin/env python3
"""
update_world_data.py — pulls global dengue surveillance data from WHO's public
API and writes it out as clean JSON + CSV for the "world context" dashboard.

EASIEST WAY TO RUN IT:
  Windows  -> double-click update_world_data.bat
  Mac      -> double-click update_world_data.command (or run: python3 update_world_data.py)
  Anyone   -> open a terminal in this folder and run:  python3 update_world_data.py

It needs NOTHING in the folder — the data comes from the internet. It does need
an internet connection at the moment you run it.

SOURCE
  WHO Global Dengue Surveillance Dashboard, public xMart OData endpoint:
    https://xmart-api-public.who.int/ARBOV/V_DENGUE_GLOBAL_VALIDATED_PUBLIC
  Human-facing version of the same data:
    https://worldhealthorg.shinyapps.io/dengue_global/

It writes:
    Data/who-dengue-global.json   slim bundle the dashboard actually loads
    Data/who-dengue-global.csv    the FULL tidy table, one row per country-period, for Excel

The JSON is deliberately not the whole feed. The full history is ~3.4 MB, and
almost all of that is twenty years of weekly rows no chart ever draws. The web
bundle carries yearly totals for EVERY country in EVERY region, but weekly detail
only for this year and last, and only for the Western Pacific and South-East Asia
in full plus the largest reporters in each other region — enough to put Cambodia's
curve next to Brazil's or Bangladesh's, without shipping every Caribbean island's
2011 weeks. The CSV keeps everything, so nothing is lost for offline analysis.

WHAT THIS SCRIPT CLEANS UP (the feed is raw, and has real quirks):

  1. Impossible future years. A handful of rows are stamped 2027-2029. They are
     data-entry errors upstream. Dropped, and reported in the run log.

  2. Empty placeholder weeks. Around 50 countries — most of the Americas — have the entire
     current year pre-created, one blank row per epidemiological week out to late December.
     They carry CASES = null (never 0), which is what separates them from a country genuinely
     reporting no cases. They are excluded from "data through" and from period counts;
     without that, Colombia reads as current to 27 December, months into the future, and
     sorts above countries that are actually up to date.

  3. YEAR vs START_DATE disagreement. ~433 rows have a START_DATE in the previous
     calendar year — e.g. epiweek 1 of 2019 starts 2018-12-30. That is CORRECT
     epidemiological-week behaviour, not an error, so YEAR is treated as
     authoritative and START_DATE is kept only as a label. Do not "fix" these.

  4. Mixed reporting cadence in one country-year. Singapore 2025 reports under
     BOTH 'isoweek' and 'epiweek'. Summing all of it double-counts that year, so
     for any country-year reporting under more than one DATE_TYPE the script
     keeps whichever cadence has more rows and drops the other, logging it.

WHAT THIS SCRIPT CANNOT FIX (and you must not paper over in the dashboard):

  * Missing countries. Viet Nam and the Philippines have submitted NOTHING for
    2026 — they are absent, not zero. Any chart must show them as "no data",
    never as a zero bar, or it will read as if dengue vanished there.

  * Reporting lag varies wildly. As of this writing Brazil is current to
    mid-August while Thailand, Indonesia and India stop at 1 July. Comparing
    raw year-to-date totals across countries compares different lengths of
    year. The bundle therefore carries a per-country 'latest_date' and
    'periods' count so the dashboard can caption the lag honestly.

  * No population for most countries. Only ~51 of 193 countries carry a
    POPULATION value for 2026, and Cambodia is NOT one of them. Incidence per
    100,000 cannot be computed from this feed alone for most countries. Any
    incidence-rate view needs a population table from elsewhere.

  * Deaths are under-reported. Many countries submit cases but leave deaths
    null or zero — Cambodia's own 2025 deaths come through as 0 here when the
    true national figure is 79. Treat WHO deaths as a floor, not a count, and
    prefer national data where you have it.
"""
import json, sys, csv, datetime, urllib.request, urllib.error
from collections import defaultdict, Counter
from pathlib import Path

# See the matching note in update_data.py: --no-pause lets update_all run this as one step
# without stopping for a keypress between stages.
NO_PAUSE = "--no-pause" in sys.argv

def pause():
    if NO_PAUSE:
        return
    try:
        input("\nPress Enter to close...")
    except EOFError:
        pass

# Exit codes, so the update_all wrapper can tell "WHO was unreachable" (which must not stop the
# national refresh) apart from a genuine failure.
EXIT_OK, EXIT_ERROR, EXIT_NO_NETWORK = 0, 1, 2

HERE = Path(__file__).parent
OUTPUT_DIR = HERE / "Data"
JSON_PATH = OUTPUT_DIR / "who-dengue-global.json"
CSV_PATH = OUTPUT_DIR / "who-dengue-global.csv"

API_URL = ("https://xmart-api-public.who.int/ARBOV/"
           "V_DENGUE_GLOBAL_VALIDATED_PUBLIC?$top=100000&excludeSysColumns=1")

# Anything at or beyond this is an upstream typo, not a forecast.
MAX_PLAUSIBLE_YEAR = datetime.date.today().year


def log(msg):
    print(f"  {msg}")


def fail(msg, code=EXIT_ERROR):
    print(f"\nERROR: {msg}")
    pause()
    sys.exit(code)


print("=" * 60)
print("Global dengue data — refresh from WHO")
print("=" * 60)

# ---- Fetch -------------------------------------------------------------
log("Contacting WHO API (this can take up to a minute) ...")
try:
    req = urllib.request.Request(API_URL, headers={"User-Agent": "dengue-dashboard-updater"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        raw = json.loads(resp.read().decode("utf-8"))
except urllib.error.URLError as e:
    # Not a real failure of this toolkit — the internet, a proxy or WHO is unavailable. Signalled
    # separately so update_all can report it as a skipped step and still keep the national refresh
    # it already completed, rather than presenting the whole run as broken.
    fail(f"Could not reach the WHO API.\nAre you connected to the internet?\n\nDetails: {e}",
         EXIT_NO_NETWORK)
except json.JSONDecodeError as e:
    fail(f"WHO returned something that wasn't valid JSON.\nThe service may be down; try again later.\n\nDetails: {e}",
         EXIT_NO_NETWORK)

rows = raw.get("value", [])
if not rows:
    fail("The WHO API responded, but with zero rows. Try again later.", EXIT_NO_NETWORK)
log(f"Received {len(rows):,} raw rows.")

# ---- Clean -------------------------------------------------------------
bad_year = [r for r in rows if (r.get("YEAR") or 0) > MAX_PLAUSIBLE_YEAR]
if bad_year:
    log(f"Dropping {len(bad_year)} row(s) stamped with an impossible future year:")
    for r in bad_year:
        log(f"    {r['COUNTRY']} {r['YEAR']} ({r['DATE_TYPE']} {r['DATE_NUM']})")
rows = [r for r in rows if (r.get("YEAR") or 0) <= MAX_PLAUSIBLE_YEAR and r.get("YEAR")]

# Resolve mixed reporting cadence within a single country-year.
by_cy = defaultdict(list)
for r in rows:
    by_cy[(r["ISO3"], r["YEAR"])].append(r)

kept = []
for (iso, year), group in by_cy.items():
    cadences = Counter(r["DATE_TYPE"] for r in group)
    if len(cadences) > 1:
        winner, _ = cadences.most_common(1)[0]
        dropped = sum(n for c, n in cadences.items() if c != winner)
        log(f"{group[0]['COUNTRY']} {year} reports under {len(cadences)} cadences "
            f"{dict(cadences)} — keeping '{winner}', dropping {dropped} row(s) to avoid double-counting.")
        group = [r for r in group if r["DATE_TYPE"] == winner]
    kept.extend(group)
rows = kept
log(f"{len(rows):,} rows after cleaning.")


def num(v):
    """Feed uses null for 'not reported'. Keep that distinct from a real 0."""
    return v if isinstance(v, (int, float)) else None


def zero(v):
    return v if isinstance(v, (int, float)) else 0


# ---- Reshape -----------------------------------------------------------
countries = {}
for r in rows:
    iso = r["ISO3"]
    c = countries.setdefault(iso, {
        "iso3": iso, "country": r["COUNTRY"], "who_region": r["WHO_REGION"],
        "yearly": {}, "periods": {}, "latest_date": None, "population": {},
    })
    y = str(r["YEAR"])
    slot = c["yearly"].setdefault(y, {"cases": 0, "deaths": 0, "severe": 0,
                                      "confirmed": 0, "periods": 0,
                                      "deaths_reported": False})
    slot["cases"] += zero(r.get("CASES"))
    slot["deaths"] += zero(r.get("DEATHS"))
    slot["severe"] += zero(r.get("SEVERE_CASES"))
    slot["confirmed"] += zero(r.get("CONFIRMED_CASES"))
    if num(r.get("DEATHS")) is not None:
        slot["deaths_reported"] = True

    if r.get("POPULATION"):
        c["population"][y] = r["POPULATION"]

    c["periods"].setdefault(y, r["DATE_TYPE"])

    # Only rows that actually carry a case count advance "how current is this country".
    #
    # This matters more than it looks. Around 50 countries — nearly all of the Americas —
    # have the WHOLE of the current year pre-created, one empty row per epidemiological week
    # through to late December. Those placeholder rows have CASES = null, never 0, which is
    # what makes them separable from a country genuinely reporting no cases (Canada reports
    # real zeros every week and must keep counting as up to date).
    #
    # Counting them would make Colombia look current to 27 December — months into the future —
    # and would put every padded country top of any "most current" sort, which is precisely
    # backwards. The dashboard's whole reporting-lag caption rests on this being right.
    sd = r.get("START_DATE")
    if num(r.get("CASES")) is not None:
        slot["periods"] += 1
        if sd and (c["latest_date"] is None or sd > c["latest_date"]):
            c["latest_date"] = sd
    elif sd:
        c["_placeholders"] = c.get("_placeholders", 0) + 1

    # Weekly/monthly series, kept for trend charts
    c.setdefault("series", []).append({
        "y": r["YEAR"], "n": r["DATE_NUM"], "t": r["DATE_TYPE"],
        "d": sd, "c": num(r.get("CASES")), "x": num(r.get("DEATHS")),
    })

placeholder_countries = sorted(
    (c["country"], c.pop("_placeholders")) for c in countries.values() if c.get("_placeholders"))
if placeholder_countries:
    total_ph = sum(n for _, n in placeholder_countries)
    log(f"{len(placeholder_countries)} countries carry {total_ph:,} empty placeholder periods "
        f"(pre-created weeks with no case count yet) — excluded from 'data through' and period counts.")

# Drop year buckets that turned out to contain nothing but placeholders: a country with 52
# empty weeks and no data has not reported that year, and must show as "no data", not as zero.
for c in countries.values():
    c["yearly"] = {y: s for y, s in c["yearly"].items() if s["periods"] > 0}

for c in countries.values():
    c["series"].sort(key=lambda s: (s["y"], s["n"]))
    for y, slot in c["yearly"].items():
        slot["cfr"] = round(slot["deaths"] / slot["cases"] * 100, 3) if slot["cases"] else None

all_years = sorted({r["YEAR"] for r in rows})
current_year = max(all_years)

# Regional and global rollups
regions = defaultdict(lambda: defaultdict(lambda: {"cases": 0, "deaths": 0, "countries": 0}))
for c in countries.values():
    for y, slot in c["yearly"].items():
        rg = regions[c["who_region"]][y]
        rg["cases"] += slot["cases"]
        rg["deaths"] += slot["deaths"]
        rg["countries"] += 1

global_yearly = {}
for y in all_years:
    ys = str(y)
    global_yearly[ys] = {
        "cases": sum(c["yearly"].get(ys, {}).get("cases", 0) for c in countries.values()),
        "deaths": sum(c["yearly"].get(ys, {}).get("deaths", 0) for c in countries.values()),
        "countries_reporting": sum(1 for c in countries.values() if ys in c["yearly"]),
    }

# Which countries are silent this year? The dashboard must render these as
# "no data", never as zero.
reporting_now = {iso for iso, c in countries.items() if str(current_year) in c["yearly"]}
silent_now = sorted(
    (c["country"], c["iso3"], c["who_region"], max(c["yearly"], key=int))
    for iso, c in countries.items() if iso not in reporting_now
)

# Trim the weekly detail down to what the dashboard draws (see the note in the
# file header). Yearly totals survive for every country in every region; weekly
# series are the expensive part, so they survive only where they get compared.
#
# Cambodia's own neighbourhood is kept in full, because that is the comparison
# the dashboard is built around. Every OTHER region keeps its biggest reporters
# too, so Cambodia's curve can be set against Brazil's or Bangladesh's rather
# than only against Laos's — cross-region comparison was the point of adding
# this feed at all. Small reporters elsewhere fall back to yearly totals.
SERIES_REGIONS_FULL = {"WPR", "SEAR"}
SERIES_TOP_N_PER_REGION = 8
SERIES_FROM_YEAR = current_year - 1

top_elsewhere = set()
by_region = defaultdict(list)
for c in countries.values():
    if c["who_region"] not in SERIES_REGIONS_FULL:
        by_region[c["who_region"]].append(c)
for rg, members in by_region.items():
    members.sort(key=lambda c: c["yearly"].get(str(current_year), {}).get("cases", 0), reverse=True)
    for c in members[:SERIES_TOP_N_PER_REGION]:
        if c["yearly"].get(str(current_year), {}).get("cases", 0) > 0:
            top_elsewhere.add(c["iso3"])

kept_series = dropped_series = 0
for c in countries.values():
    keep = c["who_region"] in SERIES_REGIONS_FULL or c["iso3"] in top_elsewhere
    before = len(c["series"])
    c["series"] = [s for s in c["series"] if s["y"] >= SERIES_FROM_YEAR] if keep else []
    c["has_series"] = bool(c["series"])
    kept_series += len(c["series"])
    dropped_series += before - len(c["series"])
log(f"Web bundle keeps {kept_series:,} weekly/monthly points "
    f"({'+'.join(sorted(SERIES_REGIONS_FULL))} in full, plus the top "
    f"{SERIES_TOP_N_PER_REGION} reporters in each other region, {SERIES_FROM_YEAR}-{current_year}); "
    f"{dropped_series:,} stay in the CSV only.")

bundle = {
    "meta": {
        "source": "WHO Global Dengue Surveillance Dashboard (xMart public API)",
        "source_url": "https://worldhealthorg.shinyapps.io/dengue_global/",
        "api_url": API_URL.split("?")[0],
        "retrieved": datetime.date.today().isoformat(),
        "current_year": current_year,
        "years": all_years,
        "row_count": len(rows),
        "series_scope": {
            "full_regions": sorted(SERIES_REGIONS_FULL),
            "top_n_per_other_region": SERIES_TOP_N_PER_REGION,
            "from_year": SERIES_FROM_YEAR,
            "note": ("Weekly detail covers the Western Pacific and South-East Asia in full, plus "
                     "the largest reporters in every other region, from this year and last. "
                     "Yearly totals cover every country in every region. The CSV has the full feed."),
        },
        "caveats": [
            "Countries absent from a year submitted nothing — that is not zero cases.",
            "Reporting lag differs by country; compare using latest_date/periods, not raw YTD.",
            "Deaths are widely under-reported; treat as a floor. Prefer national data where available.",
            "Population is present for only a minority of countries, so incidence per 100k is not computable feed-wide.",
        ],
    },
    "countries": countries,
    "regions": {rg: dict(years) for rg, years in regions.items()},
    "global_yearly": global_yearly,
    "not_reporting_current_year": [
        {"country": n, "iso3": i, "who_region": rg, "last_year_seen": int(ly)}
        for n, i, rg, ly in silent_now
    ],
}

# ---- Write -------------------------------------------------------------
log("Writing data files ...")
OUTPUT_DIR.mkdir(exist_ok=True)
JSON_PATH.write_text(json.dumps(bundle, ensure_ascii=False), encoding="utf-8")

with CSV_PATH.open("w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["country", "iso3", "who_region", "year", "date_type", "date_num",
                "start_date", "cases", "confirmed_cases", "severe_cases", "deaths", "population"])
    for r in sorted(rows, key=lambda r: (r["COUNTRY"], r["YEAR"], r["DATE_NUM"])):
        w.writerow([r["COUNTRY"], r["ISO3"], r["WHO_REGION"], r["YEAR"], r["DATE_TYPE"],
                    r["DATE_NUM"], r.get("START_DATE", ""), num(r.get("CASES")),
                    num(r.get("CONFIRMED_CASES")), num(r.get("SEVERE_CASES")),
                    num(r.get("DEATHS")), num(r.get("POPULATION"))])

print()
print("=" * 60)
print(f"DONE. {len(countries)} countries, {all_years[0]}-{all_years[-1]}.")
print(f"  {JSON_PATH.relative_to(HERE)}  ({JSON_PATH.stat().st_size/1024:.0f} KB)")
print(f"  {CSV_PATH.relative_to(HERE)}  ({CSV_PATH.stat().st_size/1024:.0f} KB)")
print("=" * 60)
print()
print(f"{current_year} global total so far: {global_yearly[str(current_year)]['cases']:,} cases, "
      f"{global_yearly[str(current_year)]['deaths']:,} deaths, "
      f"from {global_yearly[str(current_year)]['countries_reporting']} countries.")
print()
if silent_now:
    print(f"NOT REPORTING in {current_year} ({len(silent_now)} countries) — show these as")
    print("'no data' in any chart, never as a zero:")
    for n, i, rg, ly in silent_now[:12]:
        print(f"    {n} ({rg}) — last reported {ly}")
    if len(silent_now) > 12:
        print(f"    ... and {len(silent_now)-12} more (full list in the JSON).")
print()
pause()
