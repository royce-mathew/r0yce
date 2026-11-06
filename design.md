# Design notes — royce.sh

Current design direction, updated from the November 2026 design conversations.
Later explicit choices take precedence over earlier experiments. A prototype
request is not approval to keep the result.

## Character and identity

An original manga-inspired portfolio, not a generic portfolio with comic
decorations added. Use panel composition, gutters, ink weight, restrained
screentones, Japanese lettering, and reading rhythm deliberately. Keep the
presentation professional: manga, not a cartoon or a Western-comic pastiche.

- Brand: **royce.sh**, including navigation and metadata.
- Roles: **Software Developer, AI Engineer, Game Developer**.
- Carry the same ink, ivory, and gold palette through the whole site. Cohesion
  does not mean forcing every page into the hero's panel layout.
- No glassmorphism, gradient headlines, or decorative icon-tile sections.
- Preserve real content, routes, and visitor tasks. A visual redesign is not a
  reason to invent services, statistics, or new product scope.

## Colour and surfaces

**Dark-only.** There is no light theme, system-theme selection, saved theme
preference, theme provider, or theme switcher. White and ivory panels are
intentional surfaces inside this one palette, not another mode.

Semantic tokens are HSL triples consumed through `hsl(var(--token))`.
`src/styles/globals.css` defines the base tokens; `src/styles/site-theme.css`
provides the effective site palette and display-type overrides. Check both,
rather than copying the older base values into a new component.

| Role                      | Current token / value                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Dark canvas               | `--background`: `60 6.25% 6.27%` (approximately `#11110f`)                             |
| Light ink on dark         | `--foreground`: `45 40% 92.16%` (approximately `#f3efe3`)                              |
| Card                      | `--card`: `60 5% 10%`                                                                  |
| Raised surface            | `--surface`: `45 6% 13%`                                                               |
| Muted text                | `--muted-foreground`: `45 13% 73%`                                                     |
| Rules and inputs          | `--border` / `--input`: `45 10% 54%`                                                   |
| Gold accent               | `--primary` / `--gold` / `--gold-ink`: `47.39 83.76% 63.33%` (approximately `#f0ce53`) |
| Ink on gold               | `--primary-foreground`: `60 6.25% 6.27%`                                               |
| Hero paper / ink / accent | Local `--me-void-*` variables: `#f3efe3` / `#11110f` / `#f0ce53`                       |
| Plain white panels        | Japanese-text panel and About / Email / Résumé buttons: `#fff`                         |

Use semantic tokens for shared UI and the existing local hero variables for
its illustrated spread. Gold is the main UI accent; use dark ink on gold fills.
Do not apply a gold-on-dark text treatment unchanged to white paper. Check
contrast on the actual surface; body text should meet WCAG AA. Status colours
and real project screenshots may retain their functional colours.

## Typography

- Use confident, legible headings rather than novelty comic lettering.
- The current site `.font-display` is DM Sans, weight 600, upright, with tight
  tracking. The older Instrument Serif font variable is not the effective
  global heading style.
- The Creation hero uses local Cal Sans for the name and Projects link, DM Sans
  for supporting text, and local Noto Sans JP for Japanese lettering.
- JetBrains Mono handles timestamps, keyboard syntax, counts, and columnar data;
  use `tabular-nums` where alignment matters.
- `.label-editorial` is a small uppercase, tracked label. Use it to establish
  hierarchy, not to fill empty space.

## Homepage: Creation

Creation is the selected hero direction. Keep the face-framed opening and
illustrated multi-panel spread, with the Creation of Adam hands as its central
art reference. The hands need defined anatomy, separated fingers, sharp ink,
and readable hatching; vague silhouettes were not acceptable. Preserve the
dramatic space between the hands without losing their definition.

- Use a soft paper-stock texture on the ivory hero background. The user asked
  for more paper character, then reduced its strength. Keep grain, mottling,
  and fibres subtle and behind the content, not as a heavy overlay on text.
  The current asset is `public/images/hero-paper-grain.svg`.
- Keep the Japanese-text panel and About / Email / Résumé buttons plain white.
  The Projects panel remains gold.
- Keep project browsing behind the Projects link; do not put featured work
  into the hero.
- About & Experience follows as the complete, static, single-column content.
  Keep the résumé link in the hero only, not duplicated below About.
- Do not restore the walking character or the Three.js / scroll-story
  experiments. They were explored and dropped.

If character artwork is proposed again, the earlier preference was a
recognisable manga likeness with curly hair and glasses, with JoJo-like
illustrative detail rather than a cartoon. That is context for a future
proposal, **not approval to add a character now**. Use original artwork rather
than copying a manga character.

## Projects: master's layout

The latest choice is the layout from `master`, not the manga-panel grid or the
Editorial, Project ledger, and Contact sheet alternatives.

- Selected Works header and total-project count.
- Equal-width cards: three desktop columns, two tablet columns, one mobile
  column. Keep cover images, subtle gradients, descriptions, and tag/date footers.
- Keep master's Featured section, populated from the existing `featured` flags,
  followed by the remaining projects. Sort each group by latest modification.
  Every project appears once across the two sections; the total counts both.
- Keep the current dark palette and `royce.sh` identity when reusing master's
  layout; do not restore its old branding or theme plumbing.
- No comparison bar, variant state, or prototype keyboard handlers in the
  selected page.

The rejected projects studies are archived on `prototype/projects-layout-study`,
commit `7fe8031`. The current decision is also recorded in `README.md`.

## Project detail: Visual case study

Option 2 / B is the selected direction: a large, uncropped project preview
beside the title, description, real project links, and technology list.
Stack the opening on mobile, then give the full article a quiet reading column
with its table of contents.

- Remove the “Project / Case study” and “Behind the project” eyebrows.
  The image caption says **Preview**, without repeating the project title.
- Preserve direct access to every other project. Use a compact current-project
  switcher and Previous / Next links instead of a tall permanent sidebar.
  Keep an All projects link for returning to the grid.
- Show technology logos at a readable size beside plain-text names, with no
  pills, circular backplates, borders, or arbitrary theme recolouring. Preserve
  each brand's colours and use white inverse marks for monochrome brands on the
  dark canvas. Amazon SES uses AWS's mark; Turnstile uses Cloudflare's.
  Project tags contain technologies only, not topics or categories; use the
  same metadata for detail pages and the grid's text-only tags. Local asset
  provenance and license notices live in `public/technology/LICENSES.txt`.
- Keep the complete MDX articles, code blocks, steps, and working heading links.
  Do not carry the hero's heavy borders into the reading surface.
- No comparison controls or variant query state in the selected implementation.
  The three original studies are archived on
  `prototype/project-detail-directions`, commit `1e343cd`.

## Topbar: Index drawer

The user selected C from the topbar study. Keep its minimal wordmark, search,
settings, and Index drawer on desktop as well as mobile. Remove the
“Portfolio Index” metadata block. Other pages should retain C's dark treatment.

On the homepage, the opening header is genuinely transparent over the hero,
with no divider or painted paper backing. A diagonal black ink wipe engages
on the first scroll, then keeps C's dark treatment throughout the rest of the
page and other routes. Returning to the top lifts the backing away again.
Respect reduced motion with an immediate surface change. Keep the hero's
artwork, choreography, and fixed header offsets; do not add a scroll owner.

The comparison controls and alternate layouts are removed from the live site.
The original study is archived on `prototype/topbar-study`, commit `d987a5c`.

The drawer contents use A / Quiet index from the separate navigation study:
compact dark surface, numbered main links, a quieter project list, and native
scrolling. No misc section. The discarded drawer alternatives are archived on
`prototype/index-drawer-study`, commit `d23f851`; their comparison controls are
removed.

## Search: Quick jump

The user selected A from the command-menu study. Keep the compact dark palette,
single-column results, inline destination paths, quiet gold selection edge, and
underlined input focus. Do not restore the oversized gold selection pill,
icon tiles, or boxed input focus ring.

The selected menu uses normal URLs and retains fuzzy search, keyboard
navigation, shortcuts, native scrolling, and dialog focus behavior. The full
rejected-alternative study is archived on `prototype/command-menu-study`,
commit `1ea2b17`.

Wordle, Market State, and Image to Comic are easter eggs discovered through
command search, not advertised in the Index drawer or primary navigation.
Preserve their real routes and tools; do not replace discovery with a visible
misc directory or invent a secret gesture.

## Spacing and framing

Use Tailwind's 4-point scale and vary section rhythm deliberately. Strong panel
borders and gutters belong to the illustrated hero; restrained borders and
whitespace belong to the chosen project cards. Do not impose either treatment
on every surface.

Keep the header rule, About heading dividers, and career timeline low-contrast.
Do not let white or bright gold hairlines dominate those dark reading surfaces.

## Motion

- Keep the purposeful GSAP / ScrollTrigger choreography in Creation, with Lenis
  synchronized to the same scroll owner. Prefer spring-like movement where it
  supports the hero; do not impose one easing on every interaction.
- Animate hierarchy and the unfolding spread, not every element on the site.
  About & Experience remains static; utility and editing surfaces should not
  animate underneath the user.
- Avoid scroll hijacking, excessive pinning, and effects that delay access to
  content. Clean up timelines, triggers, and scroll ownership on navigation.
- Use `gsap.matchMedia()` for responsive and reduced-motion behaviour.
  Reduced motion and short viewports must show the finished content in normal
  flow, without hidden text, inaccessible links, or a required animation.
- The first paint matches the animated opening, without flashing the unfolded
  spread before it. Without JavaScript, the complete content remains available.
- Check the actual animation in a browser with motion enabled, then check the
  reduced-motion path separately. A reduced-motion fallback is not proof that
  the animation works.
- Verify scrolling and navigation on desktop and mobile; avoid layout shifts
  and sustained scrolling stutter.

## Interaction

- Silent success. Toasts are for failures and for async effects the user cannot
  see — a copied link qualifies, a saved document does not.
- Confirm only irreversible actions. Deleting a Firestore document earns a
  dialog; renaming does not.
- Focus rings appear instantly and are never transitioned.
- Hit targets ≥ 44 px on coarse pointers. Keep short action labels on one line
  where space permits, without clipping or creating horizontal overflow.
- Search and Index preserve the visible page and scroll position while open.
  Dismissing either restores focus without scrolling the page.

## Buttons

- **Primary** — `bg-primary`, `rounded-sm`, `min-h-11`, `whitespace-nowrap`. The
  label is the verb: "Open the editor", "Create document", "Copy link".
- **Secondary** — hairline border, transparent fill, same geometry, plus
  `.link-underline` where it reads as a link.
- No gradient fills.

## Sticky offsets

Sticky toolbars and other surfaces sit below the actual site header, at a lower
z-index. Check the current header height at each breakpoint rather than copying
an old fixed offset that lets controls slide underneath it.

## Imagery

- Use real project screenshots. The chosen cards crop covers to a consistent
  ratio; detailed screenshots in content should remain readable.
- Do not add fake browser bars, phone frames, or window chrome around
  screenshots and code blocks.
- Keep manga illustration sharp and anatomically convincing. Avoid placeholder
  cartoon characters and decorative imagery on functional app pages.
- Japanese lettering should have reliable local glyph coverage, appropriate
  language markup, and a clear role in the composition.
