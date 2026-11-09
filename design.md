# Design notes — royce.sh

Current design constraints for royce.sh.

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
`src/styles/globals.css` is the single owner of the effective shared palette
and `.font-display` typography. Status colours remain separate semantic tokens.
`src/styles/site-theme.css` owns shared focus, tap, and reduced-motion defaults.
Do not introduce a second root palette that overrides the first.

Kanjou's hero owns its layout and document-preview styling directly.
MDX components and `src/styles/mdx.css` own article surfaces; do not override
them through global DOM-nesting selectors or Tailwind class-name matching.

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
| Icon accent              | Favicon and Apple icon folded corner: `#f0ce53`, matching the site gold                |
| Plain white panels        | Japanese-text panel and About / Email / Résumé buttons: `#fff`                         |

Use semantic tokens for shared UI and the existing local hero variables for
its illustrated spread. Gold is the main UI accent; use dark ink on gold fills.
Do not apply a gold-on-dark text treatment unchanged to white paper. Check
contrast on the actual surface; body text should meet WCAG AA. Status colours
and real project screenshots may retain their functional colours.

## Typography

- Use confident, legible headings rather than novelty comic lettering.
- The site `.font-display` is DM Sans, weight 600, upright, with tight tracking.
- The Creation hero uses local Cal Sans for the name and Projects link, DM Sans
  for supporting text, and local Noto Sans JP for Japanese lettering.
- JetBrains Mono handles timestamps, keyboard syntax, counts, and columnar data;
  use `tabular-nums` where alignment matters.
- `.label-editorial` is a small uppercase, tracked label. Use it to establish
  hierarchy, not to fill empty space.

## Homepage: Creation

The Creation hero uses a face-framed opening and illustrated multi-panel spread,
with the Creation of Adam hands as its central art reference. The hands need
defined anatomy, separated fingers, sharp ink, and readable hatching.
Preserve the dramatic space between the hands without losing their definition.

- Use a soft paper-stock texture on the ivory hero background. Keep grain,
  mottling, and fibres subtle and behind the content, not as a heavy overlay
  on text. The asset is `public/images/hero-paper-grain.svg`.
- Keep the Japanese-text panel and About / Email / Résumé buttons plain white.
  The Projects panel remains gold.
- Keep project browsing behind the Projects link; do not put featured work
  into the hero.
- About & Experience follows as the complete, static, single-column content.
  Keep the résumé link in the hero only, not duplicated below About.
- Keep the homepage focused on the Creation artwork, without additional
  characters or Three.js scroll stories.

## Projects: Featured grid

Use the featured-grid layout on `/projects`.

- Keep the Projects heading, large featured lead, stacked highlights, and
  responsive three/two/one-column grid for the remaining projects.
- Preserve the existing featured flags and latest-modified ordering. Every
  project appears once and links to its complete case study.
- Keep the filled dark cards, gold accents, and descriptions. Show technology
  tags as 24px brand icons with accessible names and hover titles; retain text
  for unknown technologies. Do not restore the attribution subtitle.
- The implementation is `projects-index.tsx` with `projects-index.css`.
  Keep one production layout without comparison controls or variant state.

Cards with footage play a muted, inline loop on mouse hover or keyboard focus.
A 14px play/pause icon sits on a quiet 28px dark backing, with gold on hover
or keyboard focus. Its invisible 44px target supports touch, with a
project-specific accessible label and hover tooltip.
Reduced motion keeps covers static until Preview is explicitly activated.
Enabling reduced motion also stops an automatic preview already in progress;
explicit playback remains an opt-in, including across preference changes.
Video sources are attached only after interaction; leaving the card or viewport
restores the still cover. Case-study links remain separate from playback controls.

Local clips in `public/project-previews/` are recordings of the public pages at
`https://www.fotoland.net/`, `https://www.axelot.io/`, `https://royce.sh/`, and
`https://royce.sh/kanjou`. They use slow, continuous eased scrolling down and
back to the opening view, rather than jump cuts. These are live-site tours, not
recordings of authenticated editing sessions. Projects without footage keep
their still covers.
Axelot uses its native dark theme and a wider capture matched to the existing
cover's aspect ratio, keeping the hover transition consistent with the still.

## Project detail: Visual case study

Use a large, uncropped project preview beside a top-aligned title, description,
technology list, and real project links. Stack the opening on mobile, then give
the full article a quiet reading column with its table of contents.

- Leave the project image uncaptioned, without “Project / Case study” or
  “Behind the project” eyebrows.
- Preserve direct access to every other project. Use a compact current-project
  switcher and Previous / Next links instead of a tall permanent sidebar.
  Keep an All projects link for returning to the grid.
- Show 24px technology logos beside plain-text names, with no
  pills, circular backplates, borders, or arbitrary theme recolouring. Preserve
  each brand's colours and use white inverse marks for monochrome brands on the
  dark canvas. Amazon SES uses AWS's mark; Turnstile uses Cloudflare's.
  Project tags contain technologies only, not topics or categories; use the
  same metadata for detail pages and the grid's icon tags. Local asset
  provenance and license notices live in `public/technology/LICENSES.txt`.
  `projects/technologies.ts` resolves canonical names for both surfaces.
  Unknown technologies keep their original text and render without a logo.
- Put external project links below the technologies. Source code uses a filled
  neutral button with a solid white GitHub mark and a minimum 44px target.
- Anchor **Read the story** at the bottom of the desktop intro; on mobile,
  keep it after the project facts in the natural reading flow.
- Keep the complete MDX articles, code blocks, steps, and working heading links.
  Do not carry the hero's heavy borders into the reading surface.
- Code blocks use one spacing layer: 1rem vertical padding and 1.15rem
  horizontal line insets. Filename headers sit flush with the frame, and
  line-number/diff gutters stay aligned. Inline-code padding is separate.
- Use the quiet 15% border treatment for code frames and headers, quotes,
  tables, accordion dividers, step lines, and footer borders. Focus rings and
  semantic accent colours retain their contrast.
- Use direct project URLs without comparison controls or variant query state.

## Blog

`/blog` opens with a plain Blog heading and compact, horizontal entries with
numbered thumbnails. Omit collection slogans and redundant post counts.
Keep the site's dark canvas, ivory type, and gold accents.
`/blog/[slug]` uses the editorial article direction: oversized sans-serif title,
serif deck and reading column, with section links alongside the blog on desktop.

- Reuse the shared palette, `.label-editorial`, and the MDX rendering pipeline.
  Blog CSS owns layout and editorial modifiers, not a second theme or prose engine.
- Author blogs as ordinary Markdown in `src/content/blog/*.md`. Frontmatter
  provides title, description, date, author, and tags.
  Velite generates the contents, reading time, and slug; `src/lib/blog.ts` owns
  newest-first ordering for the index, navigation, and sitemap.
- Each index entry is one link. Its title and “Read the blog” label share the
  existing hover and keyboard-focus underline treatment.
- Add images directly in Markdown with descriptive alt text, using
  `![Description](/images/example.webp)` for an asset in `public/images/`.
  Use the shared MDX image renderer rather than a blog-specific figure registry.
- Keep real article URLs, normal missing-post responses, and complete metadata.
  Design comparisons and prototype controls stay on the archived prototype branch.
- Label the collection Blog in navigation and search. Discover individual blogs
  through the same generated content registry as the index.
- Comments are publicly readable plain text. Posting requires the existing
  sign-in flow; authors can delete their own comments after confirmation.
  Server routes derive identity from Auth.js and persist comments through the
  existing Firebase Admin connection at `blogComments/{slug}/comments/{id}`.
  Keep that collection inaccessible to browser Firestore clients. Display
  storage errors explicitly and preserve failed drafts.

## Topbar: Index drawer

Use a minimal wordmark, search, settings, and Index drawer on desktop as well
as mobile, without a “Portfolio Index” metadata block. Other pages retain
the dark header treatment.

`SiteHeader` renders one home wordmark and one all-viewport `IndexDrawer`.
`IndexHeader` owns the contextual surface, not alternate desktop/mobile trees.
Do not hide obsolete navigation or duplicate branding through breakpoint overrides.

On the homepage, the opening header is genuinely transparent over the hero,
with no divider or painted paper backing. A diagonal black ink wipe engages
on the first scroll, then keeps the dark treatment throughout the rest of the
page and other routes. Returning to the top lifts the backing away again.
Respect reduced motion with an immediate surface change. Keep the hero's
artwork, choreography, and fixed header offsets; do not add a scroll owner.

Use compact dark drawer contents, numbered main links, a quieter project list,
and native scrolling. No misc section.

## Search: Quick jump

Use a compact dark search palette, single-column results, inline destination
paths, a quiet gold selection edge, and underlined input focus. Avoid oversized
selection pills, icon tiles, and boxed input focus rings.
Destination paths use the shared muted foreground token, with readable contrast
on both normal and selected result backgrounds.

Use normal URLs and retain fuzzy search, keyboard navigation, shortcuts,
native scrolling, and dialog focus behavior.

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
  One positive eligibility query in `creation-hero.tsx` controls first paint
  and GSAP: motion enabled, desktop height ≥930px or mobile height ≥816px,
  with the width boundary at 768px. Its `data-creation-enhanced` activation
  also controls sticky layout; CSS does not repeat the eligibility thresholds.
  Navigation becomes interactive as its own panel starts appearing, not after
  another animation finishes. Fully hidden navigation remains inert on reverse
  scrolling; static and reduced-motion links are always available.
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
- Text links share `.link-underline`; card and composite anchors apply
  `.link-underline-target` to their text label instead of drawing a rule beneath
  the entire card or its icons. Hover and keyboard focus reveal the same line.
  Prose retains a quiet underline at rest; reduced motion removes the transition.
  Wordmarks, image-only links, skip links, and button-styled actions stay distinct.
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
