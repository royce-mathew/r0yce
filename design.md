# Design notes — r0yce.com

Conventions the site already follows, written down so they stop being implicit.
The palette, type, and spacing live in `src/styles/globals.css` and
`tailwind.config.ts`; this file explains the parts that aren't obvious from the
token names, and records a few rules that were learned the hard way.

## Character

Architectural and warm. Serif display against a plain sans body, one accent,
hairline rules instead of card borders, generous whitespace, asymmetric layout.
No glassmorphism, no gradient headlines, no three-column icon-tile grids.

## Colour

Tokens are HSL triples; Tailwind reads them through `hsl(var(--token))`. Use the
named token, never a raw value.

| Token                  | Light        | Dark         |
| ---------------------- | ------------ | ------------ |
| `--background`         | `40 6% 96%`  | `30 10% 5%`  |
| `--foreground`         | `30 8% 12%`  | `35 15% 90%` |
| `--surface`            | `40 6% 93%`  | `30 6% 8%`   |
| `--muted-foreground`   | `30 5% 40%`  | `30 8% 55%`  |
| `--border`             | `32 15% 85%` | `32 12% 16%` |
| `--primary` / `--gold` | `32 38% 64%` | `32 38% 64%` |
| `--primary-foreground` | `30 8% 8%`   | `30 8% 8%`   |
| `--gold-ink`           | `32 26% 37%` | `32 38% 64%` |

Three rules about the gold, all of them load-bearing:

1. It is the only accent. Keep it under roughly 5 % of any viewport.
2. **Gold as a fill** (`bg-primary`) always takes `--primary-foreground` as its
   ink. That token is dark in _both_ themes because the gold itself is identical
   in both — a light value there puts every filled button at 1.8:1.
3. **Gold as text** uses `.text-gold-ink`, not `.text-gold`. The champagne fill
   measures 2.1:1 on the light paper; `--gold-ink` darkens in light mode and
   clears AA in both.

Every text/background pair should measure at WCAG AA or better. Measure it —
the two failures above both looked fine by eye.

## Typography

- **Display** — Instrument Serif 400, roman. `.font-display`. Headings are never
  italic; emphasis comes from weight, accent, or a rule.
- **Body** — DM Sans 300–700.
- **Mono** — JetBrains Mono 400–500. Timestamps, keyboard syntax, counts, step
  numbers. Anything columnar also takes `tabular-nums`.
- **Label** — `.label-editorial`: 10–11 px, uppercase, tracked. One or two per
  page at most. It is an ordinal device, not decoration, and the heading goes
  directly underneath it rather than beside it.

## Spacing

Tailwind's 4-point scale. Vary the rhythm between sections deliberately; a page
where every band has identical padding reads as a template.

## Motion

- Easing: `cubic-bezier(0.19, 1, 0.22, 1)` everywhere.
- One orchestrated entrance per page. Content below the fold is simply there.
- `transform` and `opacity` only.
- `prefers-reduced-motion: reduce` lands on the finished state.
- Scroll-linked opacity or scale peaks with the element **mid-viewport**, not at
  the end of its range. Mapping it `0 → 1` makes things brightest as they leave
  the top of the screen, which is backwards.
- App pages carry no entrance motion at all. A list or a writing surface that
  animates under the user is a defect.

## Interaction

- Silent success. Toasts are for failures and for async effects the user cannot
  see — a copied link qualifies, a saved document does not.
- Confirm only irreversible actions. Deleting a Firestore document earns a
  dialog; renaming does not.
- Focus rings appear instantly and are never transitioned.
- Hit targets ≥ 44 px on coarse pointers. Clickable labels never wrap to two
  lines.

## Buttons

- **Primary** — `bg-primary`, `rounded-sm`, `min-h-11`, `whitespace-nowrap`. The
  label is the verb: "Open the editor", "Create document", "Copy link".
- **Secondary** — hairline border, transparent fill, same geometry, plus
  `.link-underline` where it reads as a link.
- No gradient fills.

## Sticky offsets

The site header is `sticky top-0 z-50`, `h-16` / `md:h-20`. Anything else that
sticks parks beneath it — `top-16 md:top-20`, z-index below 50. Getting this
wrong slides the element under the header, which is what the editor toolbar did
at `top-14 z-10`.

## Imagery

- Screenshots go in a `<figure>` with at most a hairline border, shot to frame
  so the page doesn't have to crop them.
- Never re-draw UI chrome — no fake browser bars, phone frames, or window
  chrome around a screenshot or a code block. The reader already has chrome.
- App pages don't use decorative imagery. Function carries them.
