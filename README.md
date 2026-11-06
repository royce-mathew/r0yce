# Overview

 <a href="https://github.com/royce-mathew/r0yce">
     <img src="./public/icon.svg" alt="royce.sh" height="100" />
  </a>

> A Personal Website Built with Next.js and Firebase. This repository contains the source code for my personal website.

--- 

![image](https://github.com/user-attachments/assets/f64c2265-3201-41a4-9312-151803339b7d)

The `royce.sh` website leverages Next.js to serve MDX content in a flexible environment, supporting both static site generation and on-demand server rendering. The application tracks content for each page, including projects, blog posts, and other resources, using MDX files to store metadata and content.

Kanjou, the Firebase-backed collaborative editor, is available at `/kanjou`.

## Current design and ownership

- `/` renders Creation: an illustrated manga hero followed by the complete About & Experience MDX. `creation-home.tsx` owns the single Lenis instance and GSAP clock; dialogs stop page inertia, sheets scroll natively, and navigation away destroys the scroll owner.
- `creation-hero.tsx` owns the scroll choreography and keeps hidden navigation inert until revealed. Short viewports and reduced motion use normal flow. Animated layouts require at least 930px viewport height on desktop or 816px on mobile so the role text fits.
- `site-shell.css` owns `--site-header-height`: 90px on desktop and 76px on mobile. Header layout, hero offsets, editor toolbar, Wordle, and project sidebars consume that value rather than maintaining separate offsets.
- The shared Index header is transparent over the opening hero; scrolling past 24px reveals its dark backing. Other routes use the dark surface immediately. The selected navigation is A / Quiet index and A / Quick jump search, with native scrolling and Radix focus management.
- `/projects` uses the regular responsive card grid, not the discarded manga/comparison studies. Featured and remaining projects are sorted latest-modified-first, with each project included once.
- The site has one fixed dark palette with intentional ivory/white hero surfaces and gold accents. There is no theme provider or stored/system theme selection. Accent fills use their paired foreground tokens; syntax highlighting and toasts use fixed dark themes.

The selected layouts render on normal URLs. Comparison controls, variant query handling, scroll-story experiments, theme switching, and the unused Three.js packages are removed. [Design notes](design.md) record the visual constraints and archived navigation/project studies. The rejected Three.js and character studies remain in commits `566e17a` and `d2a0e49`.

### Artwork

The hero's local paper texture is `public/images/hero-paper-grain.svg`. The Japanese panel and About / Email / Résumé links use plain white; the résumé link appears only in the hero.

The hands are traced from the public-domain [Creation of Adam fresco](https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg). Regenerate `creation-hands-paths.ts` with `uv run scripts/trace-creation-hands.py`; edit the tracer rather than generated paths. Japanese lettering uses local Noto Sans JP subsets, with their OFL license beside the font files.

## Easter eggs

Open search with the header button, Ctrl/Cmd+K, or `/`, then type:

- `Wordle` → `/misc/wordle`
- `Market State` → `/market-state`
- `Image to comic` → `/misc/image-to-comic`

These tools are intentionally absent from primary navigation and the Index drawer. Image to Comic uses local Canvas processing and exports PNGs without uploading images. Its upstream implementation is retained, with `royce.sh` metadata and a readable selected-pen foreground. The authenticated business finder is not exposed in public navigation.

## Verification and local limits

Run `pnpm build:content`, `pnpm exec tsc --noEmit`, and `pnpm lint` for content, types, and lint. ESLint currently reports the existing MDX `<img>` warning.

`pnpm build` also collects the auth routes and requires the private Firebase service-account configuration. Without it, compilation and TypeScript can succeed while route collection fails with `app/invalid-credential` and a missing `project_id`. This is not a successful production build; supply the real configuration rather than bypassing auth initialization.

Browser checks cover the hero's animated/static/reduced-motion boundaries, shared header offsets, standalone editor typing and formatting, responsive projects, drawer/search keyboard behavior, and easter egg navigation and conversion. Authenticated persistence, a completed production build, and physical-device behavior require separate verification.

## Installation

To install the project, follow these steps:

1. Clone the repository.
2. Install the pinned pnpm version from `package.json`, then run `pnpm install`.
3. Configure `.env.local` as described below.
4. Run `pnpm dev`. Both `localhost` and `127.0.0.1` are supported; `allowedDevOrigins` permits loopback development WebSocket connections.
5. Build with `pnpm build`, then serve the result with `pnpm start`.

## Commands

Use pnpm to run the scripts defined in `package.json`:

• `dev`: Runs the Velite content watcher and Next.js development server.
• `build`: Compiles content and builds the application for production.
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

Husky runs `pnpm lint` before commits and enforces [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with commitlint.

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
