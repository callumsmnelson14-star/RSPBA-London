# RSPBA London

The redesigned site for the Royal Scottish Pipe Band Association — London & South of England Branch — built to the **Glen** design direction (light stone background, lichen-green primary, heather-amber accent).

## Pages

| File              | Section                                                                |
|-------------------|------------------------------------------------------------------------|
| `index.html`      | News homepage (hero, news, diary, pathway, results, bands, CTA, footer) |
| `contests.html`   | 2026 Branch contests (5 fixtures + draws)                              |
| `results.html`    | Mark-sheet tables for 2026 + 2025 archive + older                      |
| `diary.html`      | Full 2026 calendar timeline + RSPBA Major Championships                |
| `bands.html`      | 19 member bands, grouped by grade                                      |
| `learn.html`      | SQA, CLASP, training days, RSPBA Summer School                         |
| `news.html`       | Full news archive                                                      |
| `about.html`      | History · officials · safeguarding · documents · AGM · contact         |
| `placeholder.html`| PDF placeholder for every document link not yet wired to a real file   |

## Structure

```
index.html, contests.html, results.html, diary.html,
bands.html, learn.html, news.html, about.html, placeholder.html
assets/
  css/glen.css      Tokens + homepage components
  css/inner.css     Inner-page components (page-head, fixtures, timeline, tables, etc.)
  js/countdown.js   Next-contest countdown timer
handoff/            Original design handoff (reference)
```

## Run locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Design tokens

Defined as CSS custom properties in `assets/css/glen.css` `:root`:

- Stone background `#ecebe7`, paper `#ffffff`
- Lichen primary `#4a6e62`, heather accent `#9c6b3c`
- Type: Spectral (display), Manrope (body/UI), JetBrains Mono (meta)

See `handoff/design_handoff_glen/README.md` for the full token reference.

## Notes on the implementation

- Image placeholders (`.image-slot` divs) stand in for real photography on the homepage hero and news cards — replace with `<img>` / `<picture>` once branch photos are sourced.
- Every document/PDF link points at `placeholder.html?doc=Name` and renders a faux-PDF mockup. In production, swap each `href` for the real document URL once the assets are available. To list every placeholder reference: `grep -rn 'placeholder.html?doc=' *.html`.
- The prototype's `tweaks.jsx` knob panel is a design tool only and is intentionally not ported.
- The countdown reads its target from `data-target` on `#countdown` in `index.html` — update that ISO string to roll over to the next fixture.
