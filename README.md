# RSPBA London

A redesigned homepage for the Royal Scottish Pipe Band Association — London & South of England Branch — built to the **Glen** design direction (light stone background, lichen-green primary, heather-amber accent).

## Structure

```
index.html              Homepage
assets/
  css/glen.css          Glen theme tokens + components + layout
  js/countdown.js       Next-contest countdown timer
handoff/                Original design handoff (reference only)
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

- Image placeholders (`.image-slot` divs) stand in for real photography — replace with `<img>` / `<picture>` once branch photos are sourced.
- The prototype's `tweaks.jsx` knob panel is a design tool only and is intentionally not ported.
- Next-contest countdown reads its target date from `data-target` on `#countdown` — update that ISO string to roll over to the next fixture.
