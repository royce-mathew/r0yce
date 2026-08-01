# Design — r0yce.com

The locked design system for this site. Page redesigns read this file before
emitting code. It is not regenerated per page — extend or amend it when the
system needs to grow.

Nothing here is new. The palette, type, and spacing were established by the UI
overhaul and live in `src/styles/globals.css` and `tailwind.config.ts`; this
file writes down the decisions that were only implicit, and adds the rules the
Kanjou app pages needed.

## Genre

**Editorial.** Architectural, warm, hairline-ruled. Serif display against a
plain sans body, one accent, generous whitespace, asymmetric layout. Not
"modern SaaS" — no glassmorphism, no gradient headlines, no icon-tile grids.

## Macrostructure families

Pages in a family share the family's shape; they vary by component archetype,
not by theme.

- **Marketing / content pages** — Workbench (`/kanjou`), Portfolio Grid
  (`/projects`), Long Document (project MDX pages).
- **App pages** — Index-First for list surfaces (`/kanjou/docs`), Long Document
  for the writing surface (`/kanjou/docs/[slug]`).

## Theme

Tokens are HSL triples in `src/styles/globals.css`; Tailwind reads them through
`hsl(var(--token))`. Use the named token, never a raw colour.

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

Three accent rules, all of them load-bearing:

1. The champagne gold is the only accent. Keep it under ~5 % of any viewport.
2. **Gold as a fill** (`bg-primary`) always takes `--primary-foreground` as its
   ink. That token is dark in _both_ themes because the gold itself is
   identical in both — a light value here reads at 1.8:1.
3. **Gold as text** uses `.text-gold-ink`, not `.text-gold`. The champagne fill
   measures 2.1:1 on the light paper; `--gold-ink` darkens in light mode and
   passes AA in both.

Every text/background pair ships at WCAG AA or better. Verify, don't assume.

## Typography

- **Display** — Instrument Serif 400, roman. `.font-display`.
  Headings are never italic; emphasis comes from weight, accent, or a rule.
- **Body** — DM Sans 300–700. `.font-body` / default.
- **Mono** — JetBrains Mono 400–500. Timestamps, input rules, counts, step
  numbers. Anything columnar also takes `tabular-nums`.
- **Label** — `.label-editorial`: 10–11 px, uppercase, tracked. At most one or
  two per page; never as a decorative eyebrow on every section, and never in a
  left column with the heading beside it.

## Spacing

Tailwind's 4-point scale. Sections vary their rhythm deliberately — the page
should not have identical padding on every band.

## Motion

- Easing: `cubic-bezier(0.19, 1, 0.22, 1)`, the house curve, everywhere.
- One orchestrated entrance per page. Content below the fold is simply there;
  no scroll-triggered fade on every section.
- `transform` and `opacity` only.
- `prefers-reduced-motion: reduce` lands on the finished state.
- **App pages carry no entrance motion at all.** A list or a writing surface
  that animates under the user is a defect, not a flourish.

## Microinteraction stance

- Silent success. Toasts only for failures and for async effects the user
  cannot see (a copied link qualifies; a saved document does not).
- Confirmations only for irreversible actions — deleting a Firestore document
  earns one; renaming does not.
- Focus rings appear instantly and are never transitioned.
- Hit targets ≥ 44 px on coarse pointers. Clickable labels never wrap.

## CTA voice

- **Primary** — `bg-primary`, `rounded-sm`, `min-h-11`, `whitespace-nowrap`.
  The label is the verb: "Open the editor", "Create document", "Copy link".
- **Secondary** — hairline border, transparent fill, same geometry, plus
  `.link-underline` where it reads as a link.
- Never a gradient fill, never a pill with a gradient.

## Sticky offsets

The site header is `sticky top-0 z-50`, `h-16` / `md:h-20`. Anything else that
sticks parks beneath it: `top-16 md:top-20`, and a z-index below 50. Getting
this wrong slides the element under the header — which is exactly what the
editor toolbar did at `top-14 z-10`.

## Per-page allowances

- Marketing pages may use enrichment (Tier-A CSS/JS, hand-built SVG, real
  product screenshots in a `<figure>`).
- App pages must not. Function carries the page.
- No page re-draws UI chrome: no fake browser bars, phone frames, or window
  chrome around a screenshot or a code block.

## What pages must share

The wordmark, the accent and its restraint, the display + body pairing, the
CTA geometry, and hairline rules instead of card borders.

## What pages may differ on

Macrostructure within their family, component archetypes, and section rhythm.
Not the theme — variety lives in structure here, not in colour.
