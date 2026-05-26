# Handoff: RSPBA London — "Glen" Theme

A modern redesign of [rspbalondon.org](https://rspbalondon.org) (Royal Scottish Pipe Band Association — London & South of England Branch). This bundle covers the **Glen** direction: a light, photo-forward, heritage-modern aesthetic with a lichen-green primary, heather amber accent, and a warm stone neutral.

## About the Design Files

The files in `prototype/` are **design references created in HTML** — a working prototype showing intended look and behaviour, not production code to copy directly. The task is to **recreate these designs in your codebase's existing environment** (React, Vue, SvelteKit, etc.) using established patterns and libraries — or, if no app yet exists, to pick the most appropriate framework and implement there.

The prototype uses inline React + Babel transpilation for convenience; that's an authoring choice, not a recommendation for production.

## Fidelity

**High-fidelity.** Exact colours, type scale, spacing, and component states are specified below. Recreate pixel-perfectly using the codebase's existing libraries.

## Files in this bundle

```
design_handoff_glen/
├── README.md                     ← this file
└── prototype/
    ├── home.html                 ← Glen homepage (news landing + auto-advancing countdown)
    ├── contests.html             ← Branch Contests 2026 (rendered from data.js)
    ├── results.html              ← Contest Results (links to print sheets)
    ├── results-print.html        ← Print-PDF template with top-grade-winner cover
    ├── diary.html                ← Full 2026 calendar incl. Major Championships
    ├── bands.html                ← 19 member bands directory, by grade (no photos)
    ├── learn.html                ← SQA, CLASP, training days, Summer School
    ├── news.html                 ← Full news archive (rendered from data.js)
    ├── about.html                ← Hub: history / officials / safeguarding / documents / AGM / contact
    ├── placeholder.html          ← PDF placeholder page (every doc link points here)
    ├── style.css                 ← base tokens + homepage components
    ├── inner.css                 ← inner-page components (page-head, contest-card, timeline, tables)
    ├── data.js                   ← ★ canonical content layer (events, results, news)
    ├── render.js                 ← ★ per-section renderers reading from data.js
    ├── admin.js                  ← ★ hidden in-page admin panel
    ├── tweaks.jsx                ← in-design knob panel (homepage only)
    ├── tweaks-panel.jsx          ← reusable tweak control shell
    └── image-slot.js             ← drag-and-drop image placeholder component
```

To preview locally: open `prototype/home.html` directly in a browser, or serve `prototype/` over `python3 -m http.server` and visit `http://localhost:8000/home.html`.

## Changes in v3 — shared data layer, auto-advancing countdown, admin, print-PDF

This revision (v3) adds the four features requested after v2:

### 1 · Shared content layer (`data.js`)

A single `data.js` file is now the canonical source of every event, news bulletin and contest result. Every page reads from `window.RSPBA_DATA`. Editing the array in one place updates the homepage event card, the homepage diary, the homepage news cards, the full contest list, the diary timeline, the news archive — and the print-PDF results sheet — all together.

Shape (abridged):

```js
window.RSPBA_DATA = {
  events:  [ { id, date, name, location, tier, category, grades, description, entryForm, resultsAnchor }, … ],
  results: [ { eventId, date, adjudicators, grades: [{ name, gradeRank, placings: [...] }] }, … ],
  news:    [ { id, date, tag, title, summary, link: { label, url } }, … ]
};
```

A second file `render.js` exposes `RSPBA_RENDER.eventCard(el)`, `.homeDiary(el)`, `.homeNews(el)`, `.contestList(el)`, `.diaryTimeline(el)`, `.newsFeed(el)`. Pages call only the renderers they need.

**For the developer:** in production, swap `data.js` for content sourced from a CMS or content-collection. The shape is intentionally CMS-friendly. The renderers in `render.js` can be replaced with framework templates that take the same shape.

### 2 · Auto-advancing countdown

The homepage floating event card finds the next future event in `RSPBA_DATA.events` and counts down to it. The instant that event's date passes (or sooner, if you reload the page), the card re-paints with the next event after it. No manual updates required at end of season.

Implementation: `RSPBA.nextEvent()` filters events by date and returns the first future one; the renderer ticks every second and re-paints whenever the countdown hits zero.

### 3 · Hidden admin panel

Reachable two ways:

| Method | How |
|---|---|
| URL parameter | append `?admin=1` to any page (e.g. `/home.html?admin=1`) |
| Keyboard | press **Ctrl + Shift + A** (or Cmd + Shift + A on Mac) |

The panel slides in from the right and offers three tabs:
- **Events / Contests** — form-based edit of every contest (date, name, location, address, tier, description, entry-form URL); add new contests or delete existing ones.
- **News bulletins** — same for news; tag selector, date picker, link label + URL.
- **JSON view** — raw paste-in/copy-out for backup or full restore.

Edits persist to `localStorage` and are applied across all pages while the admin is using them. A "Download data.js" button exports the modified data as a ready-to-commit file.

**Security note for the developer:** activating by URL is fine for prototype demos and for handing off, but is **NOT production security** — anyone reaching the page can edit. In production, gate the admin behind real auth (Auth0, Clerk, NextAuth, etc.) and persist edits to a backend store, not localStorage.

A small "Admin" pill in the bottom-left of every page is the entry point when no shortcut is used; you can hide it in production by removing the call to `renderLauncher()` in `admin.js`.

### 4 · Print-PDF results sheet

The `results-print.html` page is a print-optimised results template. Hitting **Print results sheet ↗** on any block in `results.html` opens it in a new tab with `?contest=<event-id>`. The template:

- Reads the event + results from `data.js`
- Renders an A4 cover page with the **top-grade winner** (the band that won the highest grade competing — Grade 1 beats Grade 2 etc.) prominently featured
- Renders one mark-sheet page per grade after the cover
- Hits browser print on demand — user saves as PDF via the OS print dialog
- Includes a print stylesheet (`@page A4`, hidden toolbar, no shadows) so the saved PDF is clean

To wire a new contest's results to the print sheet:
1. Add a `results` entry in `data.js` with `eventId` matching an event in `RSPBA_DATA.events`
2. Order each grade's `placings` array winner-first (and set `gradeRank` lower-is-better)
3. Add a "Print results sheet ↗" link on results.html pointing at `results-print.html?contest=<event-id>`

### 5 · Fixture → Contest

The word "fixture" has been replaced with "contest" everywhere in the visible copy and in CSS class names (`.fixture` → `.contest-card`, `.fixtures` → `.contest-list`).

---

## Changes in v2 — full site

This revision (v2) addresses the feedback from the first review:

- **Band photos removed** — the homepage bands section is now a text-only directory listing bands by grade. The new `bands.html` page shows all 19 member bands as cards with no images.
- **“2026 Branch fixtures” → “2026 Events”** — homepage diary heading updated.
- **Inner pages added** for every primary nav item: `contests.html`, `results.html`, `diary.html`, `bands.html`, `learn.html`, plus `news.html` (archive) and `about.html` (hub for history/officials/safeguarding/contact/documents/AGM).
- **All links resolve.** Every `href` in the prototype points to either a real page in the bundle, an external URL (Facebook group, RSPBA HQ, band websites), an email link, or the shared `placeholder.html` page for any document/PDF the redesign references but doesn’t have the original asset for.
- **Real band roster.** The bands directory uses the actual 19 branch member bands and their grades, lifted from the existing site (City of London, Macánta, Scots Guards Association South, City of Plymouth, Ratae, Seaforth Highlanders, Laidlaw Memorial, Wolverhampton, Cambridgeshire Caledonian, Glen Duart, Milton Keynes &amp; District, Reading Scottish, The Standard Triumph, Stow Caledonian, Suffolk Glenmoriston, Gordon's School, Blackwater Thistle, Hampshire Caledonian, Oatlands Park).
- **Real 2026 contests.** The contests page reflects the actual 5 fixtures: Miniband Contest (19 Apr), PM Jim McGinn (17 May), Pipes in the Park Colchester (14 Jun), Corby Highland Gathering (12 Jul), Chatsworth Country Fair (5–6 Sep).

## How the placeholder PDF page works

Any link in the prototype that would have pointed at a real document or PDF (entry forms, draws, AGM minutes, governance documents, results CSVs, etc.) instead points at:

```
placeholder.html?doc=Name+of+Document
```

The placeholder page renders a faux-PDF-viewer mockup with a watermarked page that reads “Placeholder document — Linked from: {Name of Document}”. **In production, swap each of these `href`s for the real document URL** once the assets are available.

A full list of every placeholder reference can be extracted from the source with a grep:

```bash
grep -rn 'placeholder.html?doc=' prototype/
```

---

## Design Tokens

### Colour palette

| Token        | Hex        | Role                                    |
|--------------|-----------:|-----------------------------------------|
| `--bg`       | `#ecebe7`  | Page background · warm stone            |
| `--bg-2`     | `#f3f2ee`  | Section alt background                  |
| `--paper`    | `#ffffff`  | Card / surface                          |
| `--line`     | `#dad7d0`  | Hairline dividers                       |
| `--line-soft`| `#e5e2db`  | Soft dividers (inside cards)            |
| `--ink`      | `#1e2630`  | Primary text                            |
| `--ink-2`    | `#3c4452`  | Secondary text                          |
| `--muted`    | `#6b7280`  | Captions, labels, meta                  |
| `--lichen`   | `#4a6e62`  | **Primary brand** · headlines, CTAs     |
| `--lichen-2` | `#5d8474`  | Primary hover                           |
| `--heather`  | `#9c6b3c`  | **Accent** · kickers, status, highlight |
| `--slate`    | `#5a6478`  | Tag · admin                             |

Defined as CSS custom properties in `style.css` `:root`.

### Typography

| Family             | Where used                                                | Weights        |
|--------------------|-----------------------------------------------------------|----------------|
| **Spectral**       | Display / headlines / italic accents (`--serif`)          | 400, 500, 600 + italic 400, 500 |
| **Manrope**        | Body, UI, navigation, buttons (`--sans`)                  | 400, 500, 600, 700, 800 |
| **JetBrains Mono** | Metadata, dates, grade tags, status pills (`--mono`)      | 400, 500       |

Load from Google Fonts (this single `<link>` covers everything):

```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type scale (HiFi values)

| Element             | Family   | Size  | Weight | Line   | Letter-spacing | Style    |
|---------------------|----------|------:|-------:|-------:|---------------:|----------|
| Hero headline       | Spectral | 86px  | 500    | 0.98   | -0.03em        | em → italic 400, color `--lichen` |
| Section title       | Spectral | 60px  | 500    | 1.00   | -0.02em        | em → italic 400, color `--lichen` |
| Card large heading  | Spectral | 30px  | 500    | 1.20   | -0.005em       |          |
| Card heading        | Spectral | 22px  | 500    | 1.20   | -0.005em       |          |
| Body / lede         | Manrope  | 19px  | 400    | 1.55   |                | `--ink-2` |
| Body                | Manrope  | 16px  | 400    | 1.55   |                | `--ink-2` |
| Card body           | Manrope  | 15px  | 400    | 1.55   |                | `--ink-2` |
| Kicker (uppercase)  | Manrope  | 11px  | 600    | 1.00   | 0.18em         | uppercase, `--heather` |
| Section link        | Manrope  | 12px  | 600    | 1.00   | 0.12em         | uppercase, `--lichen` |
| Meta / date         | JetBrains Mono | 11–12px | 500–600 | 1.00 | 0.06–0.18em    | uppercase for labels |
| Hero stat number    | Spectral | 44px  | 500    | 0.95   | -0.02em        | `--lichen` |
| Event-card day      | Spectral | 56px  | 500    | 0.90   | -0.02em        | `--ink` |
| Diary card day      | Spectral | 48px  | 500    | 0.90   | -0.02em        | `--ink` |

`text-wrap: pretty` is applied to headlines and lede paragraphs.

### Spacing & radii

| Token         | Value      | Where                                           |
|---------------|-----------:|-------------------------------------------------|
| Container     | max-width 1320px, padding 0 56px (32px ≤1080px) | All sections |
| Section pad   | 100px top/bottom                                | All major sections |
| CTA section   | 120px top/bottom                                | `.cta` only |
| Card radius   | 6px                                             | News cards, diary cards, result cards |
| Slot radius   | 4px                                             | Image slots, photo frames |
| Pill radius   | 999px                                           | Buttons, header CTA |
| Hairline      | 1px solid `--line`                              | Dividers |

### Shadows

| Where                   | Value                                                                 |
|-------------------------|-----------------------------------------------------------------------|
| Card hover lift         | `0 16px 40px -16px rgba(30,38,48,.18)`                                |
| Floating event card     | `0 24px 60px -20px rgba(30,38,48,.25), 0 8px 24px -16px rgba(30,38,48,.18)` |
| Diary card hover (lichen-tinted) | `0 16px 40px -20px rgba(74,110,98,.25)`                      |

### Header (sticky)

Backdrop-filter blur:

```css
background: rgba(236, 235, 231, 0.85);
backdrop-filter: blur(14px) saturate(140%);
border-bottom: 1px solid var(--line);
```

---

## Page structure

The Glen homepage has the following sections, top to bottom. Each section is one of `<section>`'s in `home.html`. The descriptions below are abridged — open `home.html` for exact markup.

### 1. Header (sticky)

`grid-template-columns: auto 1fr auto` — brand left, primary nav centred, mini CTA right.

- **Brand**: thistle SVG rune (40×40) + two-line wordmark
  - L1: "RSPBA London" (Spectral 17/1, weight 600, `--ink`)
  - L2: "London & South of England Branch" (Manrope 11, weight 500, `--muted`)
- **Nav links** (7): News · Contests · Results · Diary · Bands · Learn · About
  - Active = bold + 2px `--lichen` underline 2px below baseline
- **Mini CTA pill**: "Find a band →" — white pill, `--line` border, arrow turns lichen on hover and translates 3px right

### 2. Hero

`grid-template-columns: 1.25fr 1fr` · gap 80px · max-width 1440px container.

Left column ("hero-text"):
- Kicker dot + "2026 Season" (heather thistle-dot 6×6, lichen text)
- Headline: "Pipe band music in *the south of England.*" — Spectral 86/0.98, -0.03em; the italic phrase uses `<em>` styled italic 400 in `--lichen`
- Lede paragraph: Manrope 19/1.55, max-width 50ch, `--ink-2`
- Stat row (3 stats): top + bottom `--line` borders, 24px padding. Big numbers in Spectral 44px lichen, labels uppercase Manrope 12px mono-style.
- CTA row: `.btn-primary` lichen pill + `.btn-text` borderless lichen text link

Right column ("hero-photo"):
- Image slot · aspect-ratio 4/4.6 · radius 4px · stone background
- **Floating event card** — absolute positioned, right -32px / bottom 36px, 360px wide, white, large shadow:
  - Top row: "June" small caps, "14" big day (Spectral 56), "2026" small
  - Hairline divider
  - Body: heather kicker, lichen-green title "Pipes in the Park" (Spectral 24), location line
  - Countdown row: 4 cells (days/hrs/min/sec) bordered top+bottom, numbers in Spectral 18 lichen, labels in Manrope 12 muted
  - CTA link "View contest details →"

### 3. Tartan thread

2px decorative stripe spanning full width — repeating linear-gradient of lichen, bg, lichen, heather, lichen, dark — opacity 0.6. **Subtle Scottish heritage cue.**

### 4. Recent news

`grid-template-columns: 2fr 1fr 1fr` · gap 28px

- **Large lead card**: spans 2 rows, image slot 16/9 on top, body below. Tag "Results" (lichen pill), date, headline (Spectral 30, -0.005em), body, "View results →" link in lichen
- **Two regular cards**: image slot 4/3, smaller heading (Spectral 22), category tag colour-varies (`Results` lichen, `Admin` slate, `Education` heather)
- **Quote card** (4th slot): solid lichen background, white serif text, paper-coloured tag, sandy white CTA link

All cards: 1px `--line-soft` border, radius 6px, hover translates `-3px` and adds shadow.

### 5. Diary — 2026 fixtures

`grid-template-columns: repeat(3, 1fr)` · 6 cards.

Each card (`.dx`):
- Padding 28/26
- Header row: month abbreviation (Manrope 13 uppercase lichen) + day big (Spectral 48) + status pill far right (`Past` / `Next` / `Highland` / `Major` / `AGM`)
  - Status `.highlight` (Next, Major) = white text on heather background
- Heading (Spectral 22)
- Location (Manrope 13, muted)
- Action link (Manrope 13 bold lichen) pushed to bottom
- States: `.past` = opacity 0.58 · `.next` = heather border · `.major` = paper-to-parchment subtle gradient

### 6. Pathway (4-step)

`grid-template-columns: repeat(4, 1fr)` — Learn → Qualify → Compete → Excel.

Each step:
- Top border 1px solid `--ink` (full opacity — quite confident)
- Number "01"–"04" in JetBrains Mono 22, heather
- Heading Spectral 28, ink
- Body 15/1.55 ink-2
- Link Manrope 13 bold lichen at bottom

### 7. Latest results

Background switches to `--bg-2` with top + bottom hairlines, 100px vertical padding.

3 result cards in a `repeat(3, 1fr)` grid:
- Title `.r-event` (Spectral 19), date `.r-date` (mono uppercase 11)
- Hairline divider
- Ordered list — each row `grid-template-columns: 24px 1fr auto` (position number / band name / grade tag)
- Position 1 has heather-colored larger number and bold band name
- Grade tag in JetBrains Mono 11 muted

### 8. Bands — 22 bands. One branch.

`grid-template-columns: repeat(4, 1fr)`. Each band:
- Photo slot 4/5 aspect, stone bg, 1px `--line-soft` border, radius 4
- Spectral 18 band name
- Manrope 12 uppercase muted city + grade

Heading uses italic `<em>` for "One branch." in lichen.

### 9. CTA band

Solid `--lichen` background, white text, 120px padding.
- `grid-template-columns: 1.4fr 1fr` · text + buttons stack
- Kicker uses `#e5b87f` (lighter amber for contrast)
- "Find a band" button is now white-on-lichen
- "Become a Branch member →" text link in light amber, hovers to white

### 10. Footer

Dark `--ink` background.
- Top: `1.2fr 3fr` brand block + 4-column link grid (Compete / Branch / Learn / Connect)
- Column headers (`.foot-h`) — JetBrains Mono 11, 0.18em letter-spacing, uppercase, in `#e5b87f` amber
- Body links — 14px Manrope, white 70%, hover full white
- Bottom base row: copyright left, Privacy/Terms/Safeguarding right, hairline divider above

---

## Components catalogue

| Component       | Source class       | Variants                                         |
|-----------------|--------------------|--------------------------------------------------|
| Button          | `.btn`             | `.btn-primary` (lichen pill), `.btn-text` (borderless), `.lg` size |
| Mini-CTA pill   | `.cta-mini`        | header only — white pill with hover arrow        |
| Card            | `.card`            | `.card-lg` (spans 2 rows), `.card-quote` (lichen background) |
| Card tag        | `.card-tag`        | default lichen, `.tag-admin` slate, `.tag-edu` heather |
| Diary card      | `.dx`              | `.past` (faded), `.next` (heather border), `.major` (gradient) |
| Diary status    | `.dx-status`       | `.highlight` for active/major events             |
| Result card     | `.result-card`     | ordered list with position numbers + grade tags  |
| Band card       | `.band`            | photo + name + place stack                       |
| Pathway step    | `.pw`              | numbered, top-bordered                           |
| Event card      | `.event-card`      | floating, hero-only, contains countdown          |
| Kicker          | `.kicker`          | uppercase + heather                              |
| Section title   | `.section-title`   | em → italic lichen                               |
| Tartan thread   | `.tartan-thread`   | 2px decorative stripe                            |

### Buttons in detail

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font: 600 14px/1 Manrope;
  letter-spacing: 0.01em;
  padding: 14px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: background .15s, color .15s, border-color .15s, transform .12s;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: var(--lichen); color: var(--paper); }
.btn-primary:hover { background: var(--lichen-2); }
.btn-text { background: transparent; color: var(--lichen); padding-inline: 0; border-radius: 0; }
.btn-text:hover { color: var(--heather); transform: none; text-decoration: underline; text-underline-offset: 4px; }
.btn.lg { padding: 18px 28px; font-size: 15px; }
```

---

## Interactions & behaviour

### Countdown timer
Runs on every page-load and ticks each second. Target date `2026-06-14T10:00:00+01:00`. Updates `data-u="d|h|m|s"` spans with zero-padded values. See `home.html` end-of-body `<script>`.

### Image slots
Use the `<image-slot>` web component (`image-slot.js`). Each one has a stable `id` so user-dropped images persist across reload. Props used in this design:
- `shape="rounded"` (or `"rect"`)
- `radius="3"` or `radius="4"`
- `placeholder="…"` for empty-state text

In a production codebase, replace these with the codebase's existing image component (Next.js `<Image>`, etc.) and feed in real photography.

### Hover states
- Cards (`.card`, `.dx`): translate up 3–4px, add soft drop-shadow
- Bands: translate up 4px
- Buttons: translate up 1px (except `.btn-text` which underlines instead)
- Header CTA arrow: translates 3px right
- Nav links: bold + lichen underline when `.active`

### Header
Sticky to top, `z-index: 50`. Uses backdrop blur — make sure the page sits behind it (no `overflow: hidden` ancestors that would clip blur).

### Tweaks panel
The `tweaks.jsx` + `tweaks-panel.jsx` combo is a **prototyping aid only** — exposes palette swap (lichen/heather/stone tuples), italic-vs-roman headline style, hero stat row toggle, and card style (raised/flat/bordered). **Do not port this to production.** It's there so reviewers can play with options in the prototype.

### Responsive
The prototype uses a single 1080px breakpoint where it collapses to one-column layouts. The intent is that production handles tablet (~768px) and phone (~430px) with the existing codebase's responsive system. Hero photo should drop below text on tablet; news grid should become 2-col then 1-col; diary/pathway/results/bands should go 2-col then 1-col; CTA should stack.

---

## Content & copy

All copy is lifted verbatim from the existing rspbalondon.org site where possible. Key content:

- Hero headline: "Pipe band music in *the south of England.*"
- Hero lede: "Twenty-two member bands, eight branch fixtures, and a pathway from first chanter to championship circle. Founded in 1965 to grow the pipe-band tradition south of the Tweed — and we're still at it."
- Stats: 22 member bands · 8 branch fixtures · 61 years on
- Next contest: Pipes in the Park, Castle Park, Colchester · 14 June 2026 · 10:00 BST
- CTA section: "Whether you're starting out or competing at Grade 1 — there's a place for you."

The exact news headlines, diary entries, results, and footer link labels are in `home.html`.

---

## Assets

- **Brand mark**: inline SVG thistle rune (in `.rune` spans in markup) — keep as SVG, not raster
- **Photography**: no real photos in the prototype — `<image-slot>` placeholders for hero, news cards, bands. Production must supply real branch photography
- **Tartan thread**: pure CSS — repeating linear-gradient at 2px height, 6 colour stops over 168px. No image needed

---

## Recommended approach

1. **Set up the design token layer** first (CSS variables, theme object, or whatever your stack uses). The `:root` block at the top of `style.css` is the source of truth.
2. **Type system**: import the three Google fonts; define a type scale matching the table above.
3. **Build the primitives**: Button (primary/text), Card, Tag/Kicker, Section header.
4. **Build the page shell**: sticky header, footer (used identically on every page).
5. **Build the inner-page shell**: breadcrumb + page-head + quick-actions aside (used identically on every inner page).
6. **Build the specialised components**: Event card with countdown, Diary card, Result card / table, Pathway step, Fixture card, Timeline item, Band card, Doc list, Officials list, Placeholder PDF page.
7. **Compose the pages**: home → news → contests → results → diary → bands → learn → about.
8. **Wire data**: news items, diary, results, bands all want to live in CMS / data layer, not hard-coded. The bands list, in particular, is naturally a single source of truth (used on homepage roster, bands directory, and result-card band names).

If the codebase is React + Tailwind, the token names above translate cleanly to `tailwind.config.js` `theme.extend.colors`. If it's plain CSS, copy the `:root` block from `style.css` directly.

---

## Open questions for the developer

- Existing component library? (Radix? shadcn/ui? Bespoke?)
- CMS for news/diary/results? Or static MDX?
- Image hosting and component (real photos to replace `<image-slot>` placeholders)?
- Backend or just a static site? The countdown only needs JS, but result tables imply some data source.
