# Overview

 <a href="https://github.com/royce-mathew/r0yce">
     <img src="./public/icon.svg" alt="royce.sh" height="100" />
  </a>

> A Personal Website Built with Next.js and Firebase. This repository contains the source code for my personal website.

--- 

![image](https://github.com/user-attachments/assets/f64c2265-3201-41a4-9312-151803339b7d)

The `royce.sh` website leverages Next.js to serve MDX content in a flexible environment, supporting both static site generation and on-demand server rendering. The application tracks content for each page, including projects, blog posts, and other resources, using MDX files to store metadata and content.

It also includes a realtime text editor for collaborative editing, built with Firebase. To access the editor, visit the `src/app/(app)/kanjou` route on the website.

## Hero and scroll prototypes — throwaway branch

Question: how can manga-panel framing create a portrait-led introduction, with coordinated navigation and scroll choreography rather than a featured-work gallery?

### B-derived manga endings

Five throwaway homepage compositions keep the preferred receding title / expanding portrait opening, then resolve into different manga pages. `/` now opens **Impact**. Use `?study=panels&variant=A-E`, or the existing bottom selector, to compare:

- `http://localhost:3000/?study=panels&variant=A` — **Impact**: diagonal portrait, panoramic eye panel, vermilion role ribbon, oversized split-color name.
- `http://localhost:3000/?study=panels&variant=B` — **Neo Tokyo**: architectural portrait column, blue detail crop, Japanese sign rails, industrial navigation.
- `http://localhost:3000/?study=panels&variant=C` — **Quiet Volume**: warm-paper editorial spread, serif identity, vertical Japanese typography, restrained brass accents.
- `http://localhost:3000/?study=panels&variant=D` — **Panel Cascade**: six unequal panels hinge into a complete page, with stepped roles and a yellow Projects panel.
- `http://localhost:3000/?study=panels&variant=E` — **Creation**: Michelangelo’s almost-touching hands unfold across nested frames above a serif name and receding portrait fragments.

Each has matching desktop/mobile navigation, footer, and `royce.sh` branding. New endings and the earlier Ink Cinema study use a caption-free crop of the supplied portrait; the original image and historical portrait studies remain unchanged. No featured-work section was added. About/experience still uses the real MDX; Projects links retain the active family and variant.

The shared scroll owner retains one Lenis instance. Each ending owns its scoped GSAP timeline, reveal-link inertness, and static reduced-motion layout. Short viewports use complete normal-flow compositions instead of squeezing a sticky page into the available height. Japanese glyphs use local regular/bold Noto Sans JP subsets; their OFL license is included beside the font files.

The decorative hands asset is a panoramic crop of Michelangelo’s *The Creation of Adam*, from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_%28hand_crop%29.jpg), marked public domain. The two animated halves preserve the original gap between the fingertips.

Local Chromium checks exercised native wheel completion at 1440×1000, 768×1000, 390×844, and 320×780; all five final compositions loaded their images, retained one h1, avoided horizontal homepage overflow and logo/search collisions, and exposed links with at least 44px targets. All five 320×600 layouts used normal flow. Live reduced-motion changes removed Lenis/sticky positioning and released links; restoring motion resumed each timeline, and reverse scrolling made hidden links inert again. Real About and Projects links worked for every ending; Projects navigation removed Lenis. Root loading, A→B→C→D→E→A switching during inertia, and Creation’s mobile menu/search were exercised. TypeScript and changed-source ESLint passed.

Known unrelated limits: missing private auth configuration still produces Auth.js client-fetch errors. The existing mobile Projects heading overflows at 390px in both the previous scroll family and the new panel family; it was not changed by this hero experiment. No production build or physical-device check was performed. No ending has been selected for promotion.

### Scroll studies

Four earlier dark-first sequences remain available at `?study=scroll&variant=A-D`. Existing `?variant=A-E` links still select the first portrait studies. The bottom comparison bar stays within the active family.

- `http://localhost:3000/?study=scroll&variant=A` — **Spatial Panels**: a Three.js portrait page with close-up crops, ink frames, and scroll-driven camera/panel depth.
- `http://localhost:3000/?study=scroll&variant=B` — **Ink Cinema**: the preferred oversized-title recession and expanding portrait aperture, refined into asymmetric black/ivory identity panels.
- `http://localhost:3000/?study=scroll&variant=C` — **Kinetic Panels**: opposing Software / AI / Play typography and angular portrait motion reveal an AI Developer identity panel against acid lime.
- `http://localhost:3000/?study=scroll&variant=D` — **Quiet Fragments**: a centered, warm-ink dimensional portrait composition above a broad sans/italic-serif name.

These four homepage studies contain no project showcases. Projects remain on their dedicated route, reached through variant-preserving hero links. Role branding reads Software Developer / AI Developer / Game Developer across both prototype families and homepage metadata; career and project content are unchanged. Each new study has a matching masthead, navigation treatment, and `royce.sh` wordmark, also applied to its mobile menu and footer. Header heights remain 90px desktop and 76px mobile so sticky tracks align across variants.

`scroll-home-prototype.tsx` owns one Lenis instance, synchronized with GSAP's ticker and ScrollTrigger. The two Three.js scenes share one portrait texture across their cropped panels and render on scroll, resize, and texture arrival, not an idle animation loop. Essential identity, Projects links, and the real About/experience MDX remain in the DOM. Reduced motion removes smooth scrolling, sticky tracks, and WebGL, leaving the portrait and content in normal flow. B/C's reveal links stay inert until visible and retain 44px touch targets. Anchor spacing uses CSS scroll margins, which the installed Lenis version already honors.

Lenis follows Radix's `body[data-scroll-locked]` lifecycle so dialogs stop both new wheel input and ongoing page inertia. The mobile menu's own scroll area uses `data-lenis-prevent` to retain native scrolling while the portfolio is locked. Browser checks exercised search-dialog lock/unlock and a scrollable mobile menu at 390×600: the menu moved while the background stayed fixed.

Changing designs resets scroll in the Lenis owner's layout effect, after the previous instance is destroyed. Resetting in the comparison button's click handler is too early: active Lenis motion can restore the old scroll position before the next hero mounts. Browser checks cover opening `/`, returning through Home, advancing all four timelines, and switching while scroll is still moving; each newly selected study starts at scroll position and timeline progress zero.

Exercised in local Chromium: wheel-driven motion at 320, 390, 768, and 1440px; no document overflow or wordmark/tool collisions; real WebGL on A/D; complete B/C mobile reveals; all four static reduced-motion layouts at 390×844 and 320×600; live preference disable/restore for every sequence; About anchors and real Projects navigation from all four heroes; and A→B→C→D→A switching during inertia with scroll/progress reset and matching mastheads. Short-screen checks caught and corrected D's role/footer overlap. The mobile menu and command-search controls were opened and closed with the new chrome. TypeScript and prototype-source lint passed. Earlier five-way comparisons remain available. This is viewport emulation, not a physical-device GPU or production-performance benchmark.

### Portrait studies


Five homepage prototypes on the existing `/` route, switchable with the development-only bottom selector, arrow buttons, or keyboard arrows:

- `http://localhost:3000/?variant=A` — **Baseline / Hero lab**: restrained split hero with shareable layout, typography, and texture controls.
- `http://localhost:3000/?variant=B` — **Monolith**: dark typographic poster, acid-lime surname, inset portrait; GSAP glyph/depth/rule sequence.
- `http://localhost:3000/?variant=C` — **Contact Sheet**: editorial contact print with central portrait and bottom-spanning name; GSAP grid and print assembly.
- `http://localhost:3000/?variant=D` — **Signal**: centered portrait on a technical field, oversized outlined disciplines; GSAP scan and reveal.
- `http://localhost:3000/?variant=E` — **Afterimage**: vermilion disc, layered portrait planes, sans/italic-serif name; GSAP depth assembly.

Run `pnpm prototype` from `/home/royce/royce-manga-prototype`. The work is isolated on `prototype/manga-redesign`; the original worktree and `master` are unchanged. The homepage source is `src/app/(app)/manga-home-prototype.tsx`. Project index/detail and Kanjou retain their existing routes and content.

The prototype branch defaults to dark mode. Existing explicit theme choices are respected, and the settings menu still offers light, system, and dark modes. Contact Sheet uses the shared theme tokens rather than a fixed light-paper palette. All five desktop heroes were captured in dark mode after their GSAP entrances finished; fresh-session dark default, light/dark switching, and the mobile Contact Sheet palette were exercised in the browser.

The arrow bar wraps in either direction, supports keyboard arrows outside text fields and interactive widgets, and updates a reload-stable URL. The browser console prints the current variant, route, viewport, motion preference, and theme. Hero experiment settings live in the URL, with no database or local-storage persistence.

The local `.env.local` contains only the deployed site's public Firebase client configuration, not private credentials, and is not committed. Authenticated editing and OAuth require the real private settings documented below; the prototype does not mock or mutate production data.

All five prototypes are captured on this throwaway branch. The old Midnight Serial and Field Notes hero implementations were replaced; their earlier source remains in commit `150deef`. No full homepage winner has been approved or promoted to `master`, and no implementation issue was supplied for a branch pointer.

### Direction and browser verification

The portrait treatment and royce.sh logo were approved; the surrounding comic lettering and decorations were rejected. The baseline name, navigation, project headings, and body now use restrained sans typography. Bangers remains on the logo and the baseline portrait's vertical lettering; Comic Neue remains only in that portrait caption. The speech bubble, laptop vignette, tilted section headings, and hard card shadows were removed. New B–E prototypes use the exact user-provided portrait, including its frame, screentone, impact lines, and caption. The logo stays consistent across all five. Fonts are self-hosted through `next/font`.

Open **Hero lab** on variant A to compare Split, Portrait lead, and Wide cover compositions. Choose DM Sans, Cal Sans, or Instrument Serif; adjust name size, desktop portrait width, screentone, and impact-line strength. Zero removes the respective texture or lines. Portrait width is hidden on mobile and disabled for the full-width cover. Controls are development-only. Changes update the current URL without navigation or replaying the entrance; **Copy link** shares it and **Reset** restores defaults while preserving unrelated query parameters and the fragment.

Baseline hero controls were exercised in Chromium, including all nine layout/typeface combinations at 1440, 768, 390, and 320px with maximum name size: no page or name overflow. Range keyboard input did not change the page variant. Portrait sizing, zero-strength effects, reload restoration, reset, native clipboard copying with permission, clipboard-denied feedback, dark mode, and reduced motion were exercised. The mobile controls fit the viewport.

New B–E prototypes were exercised at desktop 1440px, mobile 390px, tablet 768px, and narrow 320px widths. Observed each GSAP sequence running to completion and sampled changing portrait transforms/opacity during active animation. All four also reached their complete reduced-motion states. Checked loaded portraits, one h1, the unchanged logo, no page/name overflow, selector fit, reload restoration, E↔A wrap, keyboard switching, baseline slider keyboard isolation, and work navigation clearing the sticky header. Signal and Afterimage add bounded pointer depth only on fine-pointer devices; this headless browser reports no fine pointer, so hardware pointer response is not verified. These are local browser checks, not physical-device or production-build checks.

The rebranded direction was checked in Chromium at 1440×1000, 390×844, and 320×780. Verified loaded font families, unclipped mobile identity, no horizontal overflow, project index/detail navigation, command-search keyboard selection, skip link, mobile sheet navigation, dark mode, and reduced motion. Home, projects, project details, Kanjou, and Market State returned 200 with royce.sh canonical URLs and Open Graph site names; robots and sitemap use royce.sh. The historical `/projects/r0yce` URL and real GitHub repository links remain valid. DNS, hosting, and OAuth provider domains were not changed.

Previous artwork performance smoke (before the restrained hero revision): one 180-frame foreground sample at desktop and mobile widths, with native wheel scrolling and the GSAP entrance observed running. Each sample had one isolated frame around 67 ms and one 55 ms long task; no repeated long-frame sequence was observed. Buffered layout-shift totals stayed below 0.00002, and no horizontal overflow occurred. These local development observations are not a production or physical-phone benchmark.

Authenticated editing is not verified. The editor entry redirects to `/api/auth/signin`; missing private auth configuration prevents completing sign-in and can surface Auth.js fetch errors. No production data was changed. Changed-source lint reported no errors and one existing MDX `<img>` optimization warning. No production build or physical-device check was performed.

## Installation

To install the project, follow these steps:

1. Clone the repository.
2. Install dependencies using your preferred package manager. For example:  
   • npm install  
   • pnpm install  
   • yarn install
3. Run the development server using the `dev` command.
4. To build the application for production, use the `build` command.

## Commands

Common commands are defined in the `package.json` file. You can run these commands using your preferred package manager.

• `dev`: Runs Next.js in development mode.  
• `build`: Builds the application for production.  
• `start`: Runs the compiled production build.  
• `lint`: Runs ESLint to check for code issues.  
• `lint:fix`: Attempts to automatically fix lint issues.  
• `format`: Formats the code with Prettier.

## Development Environment

To set up the development environment, follow these steps:

1. Create a `.env.local` file in the root directory. Use the `.env.example` file as a template.
2. Create a Firebase project and enable Google and Github authentication.
3. Add your Firebase configuration to the `.env.local` file.
4. Add Google OAuth and Github OAuth credentials to the `.env.local` file.

### Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. You can use the `commit` command to create a commit message using the commitizen CLI.

It uses `husky` and `lint-staged` to run linting and formatting checks before committing changes.

## Content Organization

```python
./src/
├─ content/             # Markdown content
│ ├─ projects/          # Project pages in MDX format
│ │ └─ r0yce.mdx
│ └─ ...
└─ app/                 # Application components
   ├─ auth/             # Authentication
   │  └─ ...
   ├─ projects/         # Projects folder
   │  └─ [slug]/        # Slug for each project. Dynamically loads the MDX content for the project.
   └─ ...
```

## License

Licensed under the [GNU Affero General Public License v3.0](./LICENSE).
