<h1 align="center">BetterGoogleSearch</h1>

<p align="center">
  <strong>Every <code>udm</code> mode Google ships, in one place.</strong><br>
  <a href="https://bkyaro.github.io/BetterGoogleSearch/">bkyaro.github.io/BetterGoogleSearch</a>
</p>

An interactive launcher and reference for `udm` - the undocumented Google
Search URL parameter that decides *which* result page you get back. Type a
query, pick a region, then launch any of the 24 documented modes in a new tab.

- **Live:** https://bkyaro.github.io/BetterGoogleSearch/
- **Static:** no backend, no API keys, no tracking, no scraping.
- **Bilingual:** English and 中文, switchable at runtime.
- **Honest about its sources:** the mode list is a dated snapshot, and the
  page says so.

---

## Why `udm` is interesting

`udm` is not a filter. It selects which result *module* Google renders, so the
same query with `udm=2` and `udm=14` comes back as structurally different
pages, assembled from different data. It replaced the older `tbm` switch, and
Google has never documented it - it only ever surfaced because people noticed
interesting URLs.

| `udm` | Result page | legacy `tbm` |
| --- | --- | --- |
| `14` | Web - the classic ten blue links, no knowledge panel, no AI summary | - |
| `2` | Images | `isch` |
| `7` | Videos | `vid` |
| `12` | News, sorted by recency | `nws` |
| `18` | Forums and Q&A threads | - |
| `6` | Learn - study guides | - |
| `36` | Books | `bks` |
| `28` | Shopping | `shop` |
| `44` | Visual matches (Lens style) | - |
| `48` | Exact matches | - |
| `15` | Attractions | - |

The remaining 13 modes are regional - see the tier table below.

## Region selection and availability

The picker selects the region a search is localised to, and availability is not
uniform. Every mode declares a minimum tier and every region sits in one of
three tiers, so the UI marks the modes a region does not serve. Those modes can
still be opened - Google falls back to whatever it serves locally.

`src/data/regions.ts` holds the region list with its tier per region;
`src/data/udm.ts` holds the modes and the rules that consume it.

## How it works

The whole app is a link builder:

    query + region + mode   ->   https://www.google.com/search?q=coffee&udm=14&gl=jp

No request ever goes to Google from this site. That is not a limitation worked
around - it is the design:

- Google renders SERPs with JavaScript, so a server-side fetch returns a stub
  (about 90 KB of `enablejs` bootstrap with no results in it).
- Google sends `X-Frame-Options`, so a SERP cannot be embedded in an iframe.
- Scraping would break both the terms of service and the zero-cost constraint.

So the honest product is a launcher: build a correct, shareable, reproducible
link, then get out of the way. All state lives in the URL fragment
(`#q=coffee&gl=jp`), which makes every configuration shareable by default.

Three things fall out of the same model at almost no cost:

- **URL inspector** - paste any Google search URL and it decodes each
  parameter, translating a legacy `tbm` into its modern `udm` equivalent.
- **Keyboard driven** - `/` focuses the query, `1`-`9` launch the nth visible
  mode, `r` rolls a random demo query.
- **Copy all** - every link available in the selected region, as plain text.

## Project structure

    src/
      data/udm.ts           the 24 modes: id, bilingual copy, tiers, tbm aliases
      data/regions.ts     the region list and its availability tiers
      lib/google.ts         the only place that knows how a search URL is shaped
      lib/display.ts        Intl.DisplayNames region names, flags, dates
      i18n/                 a typed two-locale dictionary (en + zh)
      components/           mode cards, region picker, URL inspector, icons
      index.css             design tokens, category accents, motion, themes
    scripts/check-data.mjs  33 assertions over the data and the URL helpers
    .github/workflows/      typecheck + data check + build + Pages deploy

The dictionary is the part worth reading: `zh` is annotated as
`Dictionary = typeof en`, so a missing Chinese key fails the build instead of
showing a blank in the UI.

## Development

    npm install
    npm run dev        # vite dev server
    npm run check      # data integrity assertions
    npm run typecheck  # tsc --noEmit
    npm run verify     # typecheck + check + build
    npm run build      # -> dist/

Node 22.18 or newer: the check script imports TypeScript modules directly and
relies on native type stripping.

## Deploying

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci`
2. `npm run check` - the 33 data assertions
3. `npm run build` - typecheck plus vite build
4. upload `dist/` and publish it to GitHub Pages

A failed data check blocks the deploy, which is the point: the `udm` table is a
dated snapshot, and stale data should not ship quietly.

**One-time setup:** a Pages site cannot be created by the workflow token, so
enable it once under **Settings -> Pages -> Build and deployment -> Source:
GitHub Actions**. Every push to `main` publishes after that.

## Data provenance, and where it stops being true

- The mode list and the three availability tiers come from the SerpApi survey
  [Every Google udm=? in the world](https://serpapi.com/blog/every-google-udm-in-the-world/)
  by Terry Tan (13 June 2024). It is transcribed, not re-derived.
- The region list is curated on top of that rather than copied verbatim.
- `udm` is **undocumented**. Values can vanish, and `udm=14` was eventually
  adopted into the Google UI itself - that is how these parameters usually end.
- `MODES_VERIFIED_AT` in `src/data/udm.ts` records the transcription date and
  the footer displays it.
- The tier boundaries are a survey result, not a specification, so an unlisted
  region degrades to the lowest tier rather than to nothing.

Corrections belong in `src/data/`, and `npm run check` has to still pass.

## License

MIT for the code. The `udm` list is factual data credited to the survey above;
keep the attribution if you reuse it.

---
