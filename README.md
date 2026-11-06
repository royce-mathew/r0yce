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

`/projects` restores master’s Selected Works header, total count, equal-width responsive cards, cover gradients, and tag/date footers. Featured projects are selected by the existing content flags, followed by the remaining projects in All Projects; each group is latest-modified-first, every project appears once, and the total includes both groups. The grid has three desktop columns, two tablet columns, and one mobile column. The current `royce.sh` metadata and fixed dark palette remain. The comparison layouts, switcher, keyboard listeners, state logging, and obsolete manga-grid styles are removed.

The rejected Editorial / Project ledger / Contact sheet prototypes remain captured as primary source on branch `prototype/projects-layout-study`, commit `7fe8031`. No implementation issue was supplied; this section records the verdict and archive pointer.

Run `pnpm dev`, then open `http://localhost:3000/projects`. Verified the restored split in local Chromium at 1440×1000, 800×1000, and 320×600: three/two/one grid columns, three featured projects (Fotoland, Portfolio, Axelot), ten remaining projects, thirteen unique links overall, and no horizontal overflow. The total still includes both sections. The project collection renders only this selected layout.

## Selected topbar

The user chose C, the Index drawer, and asked to remove the “Portfolio Index” block and make the header belong to the hero. It is now the shared header on normal URLs, not a query-selected prototype.

The homepage header starts genuinely transparent over Creation, without a divider or separate painted backing. After the first 24px of scrolling, a diagonal black ink wipe brings in C's dark surface and its subtle lower rule. It stays dark throughout the rest of the page and on other routes; returning to the opening frame lifts the backing away. Reduced motion makes the surface change immediate. The hero's paper extends beneath the transparent header while its content and sticky stage retain their original offsets. This is contextual header styling, not a restored light theme.

Navigation still uses the existing Index sheet, command search, account settings, and skip link. The outer header remains 90px on desktop and 76px on mobile, preserving Creation's sticky offsets. The header uses the existing GSAP / ScrollTrigger clock, adds no scroll owner, and cleans up its own trigger on navigation. No hero artwork, hero choreography, project card component, or footer changes.

The comparison layouts, variant query handling, floating switcher, arrow-key listeners, and prototype state logging are removed. The original three-way study remains archived on `prototype/topbar-study`, commit `d987a5c`.

The harsh About heading rules and career timeline are softened locally, without changing global input or focus contrast.

Verified in local Chromium: a transparent, borderless opening with the paper genuinely behind the header; the live diagonal wipe on first scroll and its reversal at the top; unchanged hero sticky offsets; desktop and mobile motion paths; an effectively immediate reduced-motion change; 44px mobile controls and no homepage overflow at 390px and 320px; softened About rules at the reported 523px width; drawer navigation to projects and wordmark navigation home; command search, Login in settings, and skip-link focus. TypeScript and ESLint pass with the existing MDX image warning. Authenticated actions, a production build, and physical devices were not checked.

## Selected command menu

The user selected A / Quick jump. The shared search dialog now uses its compact dark layout, inline paths, quiet gold selection marker, and underlined input focus. It renders on normal URLs, independently of prototype query parameters. Five page destinations and thirteen projects retain fuzzy matching, arrow/Enter navigation, Ctrl/Cmd+K and slash shortcuts, native result scrolling, focus trapping, and focus restoration. Closing and reopening clears the query.

`command-menu.tsx` and `command-menu.css` own the selected implementation. The search variants, comparison host, query handling, and search-state logging are removed. The original study remains captured on `prototype/command-menu-study`, commit `1ea2b17`. The floating controls now belong only to the separate Index drawer study below.

Verified the selected search in local Chromium at 1440×1000, 390×844, and 320×600: all eighteen destinations, no-result feedback, filtering and real Fotoland navigation, normal-URL rendering regardless of `variant`, input cursor isolation, shortcuts, query reset, Escape focus restoration, reduced motion, and the quieter input outline.

## Index drawer study

Question: should the navigation remain a compact drawer, become a paper directory, or expand into a full-screen atlas? All three use the same Home, Projects, and Kanjou links and thirteen projects. No drawer direction has been selected.

Run `pnpm dev`, then open:

- A / Quiet index: `http://localhost:3000/projects?variant=A&drawer=1` — narrow dark drawer with a clear site/project hierarchy and quieter framing.
- B / Paper directory: `http://localhost:3000/projects?variant=B&drawer=1` — ivory split directory, stacked on mobile.
- C / Navigation atlas: `http://localhost:3000/projects?variant=C&drawer=1` — full-screen primary navigation above a responsive project catalog.

The bottom gold bar cycles layouts, including keyboard arrows while the bar is focused. Existing query parameters and hashes survive changes; reloading preserves the layout. `drawer=1` opens the study automatically in development. Escape and the close button restore focus to Index; following a link closes the drawer. Navigation links do not intercept comparison arrow keys. The comparison bar and state logging are development-only.

The full study is captured on `prototype/index-drawer-study`. No implementation issue was supplied; this section records the question, pending verdict, and primary-source pointer. Do not merge the unselected drawer variants or comparison machinery into production.

Verified all three drawers in local Chromium at 1440×1000, 800×1000, 390×844, and 320×600: sixteen unique destinations, exact-route current states, 44px link heights and close controls, final-project reachability through native scrolling, and no horizontal overflow. Also exercised Tab trapping, link-arrow isolation, real Fotoland navigation from every variant, comparison wraparound and keyboard control, query/hash preservation, reload stability, close/reopen and focus restoration, homepage scroll locking, and reduced motion. TypeScript and ESLint pass with the existing MDX image warning. No production build, authenticated editing, or physical-device check was performed.

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
