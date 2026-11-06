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

`creation-about.tsx` follows the hero with the complete About & Experience MDX and résumé in a static, single-column reading layout. The scroll-story experiments, comparison controls, and walking character are removed.

Run `pnpm dev` for local development. Both `localhost` and `127.0.0.1` are supported; `allowedDevOrigins` explicitly permits the latter so Next.js development WebSocket connections can initialize hydration and animation.

### Hero paper texture

The ivory hero background uses a small, repeating local SVG texture at `public/images/hero-paper-grain.svg`. Static grain and sparse fibers sit behind the content, without tinting text, adding an animated overlay, or intercepting links. The existing Creation hero animation remains unchanged, including its normal-flow reduced-motion layout.

The abandoned Three.js story study is archived in commit `566e17a` on `prototype/manga-redesign`; the earlier character-layout study is archived in `d2a0e49`. Neither renders on the current homepage. No scroll-story direction was selected.

The shared palette uses Creation ivory, ink, and gold across navigation, content, project details, and both themes. `/projects` is one chronological manga-panel collection: varied panel sizes, ink gutters, cropped images, and gold title bands. The separate Featured block is removed without dropping any projects.

Exercised in local Chromium: the textured hero's opening and completed spread at 1440×1000, the static About anchor and full MDX content, the 390×844 mobile layout, and the 320×600 reduced-motion layout. The texture loads successfully; mobile layouts have no horizontal overflow, and no story canvas, comparison controls, or walking character remain. TypeScript and ESLint pass with the existing MDX `<img>` warning. No production build or physical-device check was performed.

Authenticated editing requires the private configuration below. Missing local auth configuration can produce Auth.js client-fetch errors; no production data is mocked or modified.

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
