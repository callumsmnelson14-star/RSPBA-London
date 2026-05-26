# RSPBA London

The redesigned site for the Royal Scottish Pipe Band Association — London & South of England Branch — built to the **Glen** design direction (light stone background, lichen-green primary, heather-amber accent).

## Pages

| File                  | Section                                                                |
|-----------------------|------------------------------------------------------------------------|
| `index.html`          | News homepage — hero with auto-advancing countdown, news, 2026 events, pathway, results, bands, CTA, footer |
| `contests.html`       | 2026 Branch contests, rendered from `data.js`                          |
| `results.html`        | Mark-sheet tables for 2026 + 2025 archive + older                      |
| `results-print.html`  | A4 print-PDF results template (cover with top-grade winner + one page per grade) |
| `diary.html`          | Full 2026 calendar timeline + RSPBA Major Championships                |
| `bands.html`          | 19 member bands, grouped by grade                                      |
| `learn.html`          | SQA, CLASP, training days, RSPBA Summer School                         |
| `news.html`           | Full news archive, rendered from `data.js`                             |
| `about.html`          | History · officials · safeguarding · documents · AGM · contact         |
| `placeholder.html`    | PDF placeholder for every document link not yet wired to a real file   |

## Structure

```
*.html                  (page templates)
assets/
  css/glen.css          Tokens + homepage components
  css/inner.css         Inner-page components (page-head, contest-card, timeline, tables)
  js/data.js            Shared content layer — events, results, news + RSPBA helpers
  js/render.js          Per-section renderers (eventCard, homeDiary, homeNews, contestList, diaryTimeline, newsFeed)
  js/admin.js           Hidden admin panel — ?admin=1 or Ctrl+Shift+A
handoff/                Original design handoff (reference)
```

## Run locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Content & content management

All events, results and news live in **`assets/js/data.js`** under `window.RSPBA_DATA`. Every page that displays this content reads from the same source — edit the array once and the homepage event card, homepage news, homepage diary, contest list, full diary timeline, news archive and print-PDF results sheet all update together.

### Auto-advancing countdown

The homepage floating event card finds the next future event in `RSPBA_DATA.events` and counts down to it. When that event's date passes, the card re-paints to the next event. No manual updates required at end of season.

### Hidden admin panel

Reachable two ways:

| Method | How |
|--------|-----|
| URL parameter | append `?admin=1` to any page (e.g. `index.html?admin=1`) |
| Keyboard | press **Ctrl + Shift + A** (or Cmd + Shift + A on Mac) |

The panel slides in from the right and offers three tabs:
- **Events / Contests** — form-based edit of every event (date, name, location, tier, description, entry-form URL); add new events or delete existing ones.
- **News bulletins** — same for news; tag selector, date picker, link label + URL.
- **JSON view** — raw paste-in/copy-out for backup or full restore.

Edits persist to `localStorage` and are applied across all pages. A "Download data.js" button exports the modified data as a ready-to-commit file.

> **Security note.** Activating by URL is a prototype convenience, **not** production security — anyone reaching the page can edit. In production, gate the admin behind real auth (Auth0, Clerk, NextAuth, etc.) and persist edits to a backend store rather than `localStorage`.

A small "Admin" pill in the bottom-left of every page is the entry point when no shortcut is used; to hide it in production, comment out the call to `renderLauncher()` in `assets/js/admin.js`.

### Print-PDF results sheet

`results-print.html` is a print-optimised A4 template. Hitting **Print results sheet ↗** on any block in `results.html` opens it in a new tab with `?contest=<event-id>`. The template:

1. Reads the event + results from `data.js`
2. Renders an A4 cover page with the **top-grade winner** (the band that won the highest grade competing — lowest `gradeRank` wins) prominently featured
3. Renders one mark-sheet page per grade after the cover
4. Hits browser print on demand — user saves as PDF via the OS print dialog

To wire a new contest's results to the print sheet:
1. Add a `results` entry in `data.js` with `eventId` matching an event in `RSPBA_DATA.events`
2. Order each grade's `placings` array winner-first (and set `gradeRank` lower-is-better)
3. Add a `Print results sheet ↗` link on `results.html` pointing at `results-print.html?contest=<event-id>`

## Design tokens

Defined as CSS custom properties in `assets/css/glen.css` `:root`:

- Stone background `#ecebe7`, paper `#ffffff`
- Lichen primary `#4a6e62`, heather accent `#9c6b3c`
- Type: Spectral (display), Manrope (body/UI), JetBrains Mono (meta)

See `handoff/design_handoff_glen/README.md` for the full token reference.

## Notes

- Image placeholders (`.image-slot` divs) stand in for real photography on the hero and news cards — replace with `<img>` / `<picture>` once branch photos are sourced.
- Every document/PDF link points at `placeholder.html?doc=Name` and renders a faux-PDF mockup. In production, swap each `href` for the real document URL. To list every reference: `grep -rn 'placeholder.html?doc=' *.html assets/js/`.
- The prototype's `tweaks.jsx` knob panel is a design tool only and is intentionally not ported.
- In production, swap `data.js` for content sourced from a CMS or content collection. The shape is intentionally CMS-friendly; the renderers in `render.js` can be replaced with framework templates that take the same shape.
