# Overview

 <a href="https://github.com/royce-mathew/r0yce">
     <img src="./public/icon.svg" alt="royce.sh" height="100" />
  </a>

> A Personal Website Built with Next.js and Firebase. This repository contains the source code for my personal website.

--- 

![image](https://github.com/user-attachments/assets/f64c2265-3201-41a4-9312-151803339b7d)

The `royce.sh` website leverages Next.js to serve MDX content in a flexible environment, supporting both static site generation and on-demand server rendering. The application tracks content for each page, including projects, blog posts, and other resources, using MDX files to store metadata and content.

It also includes a realtime text editor for collaborative editing, built with Firebase. To access the editor, visit the `src/app/(app)/kanjou` route on the website.

## Creation homepage

`/` renders Creation: a face-framed title card opens into an illustrated manga spread, followed by the real About & Experience MDX. The alternative hero studies are removed; navigation uses clean `/` and `/projects` URLs.

`src/app/(app)/creation-home.tsx` owns one Lenis instance synchronized with GSAP and ScrollTrigger. Dialogs stop page inertia, mobile menus retain native scrolling, and leaving the homepage destroys the scroll owner. `creation-hero.tsx` owns the scroll-scrubbed title, portrait, panel, and hand entrances. Hidden navigation stays inert until revealed. Reduced motion and short viewports show the complete hero in normal flow.

The hands are traced from the public-domain [Creation of Adam fresco](https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg). Regenerate `creation-hands-paths.ts` with `uv run scripts/trace-creation-hands.py`. The tracing separates silhouette, light, dense shading, shadow, and anatomical ink. `creation-hands.tsx` renders shadows as diagonal hatching rather than solid black, retaining finger separation and heavier outlines. Japanese lettering uses local Noto Sans JP subsets; their OFL license is beside the font files.

`creation-about.tsx` follows the hero with the complete About & Experience MDX in a static, single-column reading layout. The résumé link lives in the hero's personal links only; the duplicate below About is removed. The Japanese-text panel and personal-link buttons use plain white backgrounds, separate from the textured ivory hero. The scroll-story experiments, comparison controls, and walking character are removed.

Run `pnpm dev` for local development. Both `localhost` and `127.0.0.1` are supported; `allowedDevOrigins` explicitly permits the latter so Next.js development WebSocket connections can initialize hydration and animation.

### Hero paper texture

The ivory hero background uses a repeating local SVG texture at `public/images/hero-paper-grain.svg`. Layered grain, irregular mottling, and light/dark fibers sit behind the content at 72% group opacity for a softer paper-stock finish, without tinting text, adding an animated overlay, or intercepting links. The existing Creation hero animation remains unchanged, including its normal-flow reduced-motion layout. The softened texture was visually checked at 1440×1000 and 390×844.

The abandoned Three.js story study is archived in commit `566e17a` on `prototype/manga-redesign`; the earlier character-layout study is archived in `d2a0e49`. Neither renders on the current homepage. No scroll-story direction was selected.

The site uses one fixed dark palette, with intentional white/ivory manga surfaces and gold accents. Dark semantic tokens are unconditional root defaults; `color-scheme: dark` also keeps native controls dark. Theme providers, stored/system theme selection, theme controls in settings/footer/command search, conditional light/dark styles, and the `next-themes` dependency are removed. Toasts and syntax highlighting use fixed dark themes. `/projects` uses master’s regular card-grid layout rather than the manga-panel or comparison studies.

Exercised in local Chromium: white hero surfaces and the single hero résumé link at 1440×1000 and 390×844, fixed dark styling with both an OS light preference and an old saved light theme, settings and command-menu navigation, the project collection/footer, and single-theme code highlighting on `/projects/axelot`. The 320×600 reduced-motion About layout has no horizontal overflow or duplicate résumé link. Velite content compilation, TypeScript, and ESLint pass with the existing MDX `<img>` warning. No production build, authenticated editing, or physical-device check was performed.

Authenticated editing requires the private configuration below. Missing local auth configuration can produce Auth.js client-fetch errors; no production data is mocked or modified.

## Projects layout decision

Question: which information hierarchy suits the complete collection? The user chose the existing layout from `master`, not any of the three alternatives.

`/projects` restores master’s Selected Works header, total count, equal-width responsive cards, cover gradients, and tag/date footers. It keeps the current `royce.sh` metadata, fixed dark palette, and one complete latest-modified-first collection without a separate Featured section. The grid has three desktop columns, two tablet columns, and one mobile column. The comparison layouts, switcher, keyboard listeners, state logging, and obsolete manga-grid styles are removed.

The rejected Editorial / Project ledger / Contact sheet prototypes remain captured as primary source on branch `prototype/projects-layout-study`, commit `7fe8031`. No implementation issue was supplied; this section records the verdict and archive pointer.

Run `pnpm dev`, then open `http://localhost:3000/projects`. Verified in local Chromium at 1440×1000, 800×1000, 390×844, and 320×600: the expected responsive column counts, all 13 unique project links in their existing order, decoded covers, no horizontal overflow, and opening Axelot then returning to the collection. The project collection renders only this selected layout; the topbar study below does not change its cards. Narrow layouts were checked with reduced motion. TypeScript and ESLint pass with the existing MDX image warning. No production build, authenticated editing, or physical-device check.

## Topbar prototype

Question: which of three topbar layouts best connects the Creation hero with the rest of the site? The shared header hosts three throwaway variants on the real routes:

- `/?variant=A` — Panel strip: an ivory brand panel, exposed indexed navigation cells, and a bordered utility panel.
- `/?variant=B` — Print masthead: a centred paper masthead above a separate navigation tier.
- `/?variant=C` — Index drawer: a minimal wordmark and tools, with the complete navigation behind an Index button on desktop as well as mobile.

Run `pnpm dev`, then open `http://localhost:3000/?variant=A`. Compare the same options above the existing project grid at `/projects?variant=A`, `B`, or `C`. The floating bar and left/right arrow keys update the URL, preserve unrelated query parameters and the hash, and survive reloads. Ordinary navigation links retain their normal URLs; an unqualified destination defaults to A. There is no stored selection. The comparison controls and relevant-state console output are development-only.

All variants reuse the actual main navigation, mobile sheet, command search, account settings, and skip link. Their fixed 90px desktop / 76px mobile outer heights preserve the existing hero's sticky offsets. No hero artwork, animation, project layout, footer, or theme controls are changed.

Verified in local Chromium: all three headers on the homepage and projects page at desktop and mobile widths, including 320px; unchanged header heights and no horizontal overflow on those pages; 44px minimum visible button targets; animated Creation alignment with motion enabled and normal-flow content with reduced motion; search opening in every variant; input arrow-key isolation; Login in the account popover; independently scrolling navigation with all 13 project links; drawer project navigation and direct Kanjou navigation; skip-link focus; URL wraparound, keyboard switching, and reload stability. TypeScript and ESLint pass with the existing MDX image warning. Private auth configuration still limits authenticated actions. No production build or physical-device check.

Verdict: no topbar selected yet. The study is captured on `prototype/topbar-study`; it is not a production promotion.

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
