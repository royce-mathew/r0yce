# Overview

 <a href="https://github.com/royce-mathew/r0yce">
      <img src="./public/favicon.png" alt="Spyder" height="100" />
  </a>

> A Personal Website Built with Next.js and Firebase. This repository contains the source code for my personal website.

--- 

![image](https://github.com/user-attachments/assets/f64c2265-3201-41a4-9312-151803339b7d)

The `r0yce.com` website leverages Next.js to serve MDX content in a flexible environment, supporting both static site generation and on-demand server rendering. The application tracks content for each page, including projects, blog posts, and other resources, using MDX files to store metadata and content.

It also includes a realtime text editor for collaborative editing, built with Firebase. To access the editor, visit the `src/app/(app)/kanjou` route on the website.

## Manga design prototype — throwaway branch

Question: which manga reading rhythm best serves this portfolio without changing its content or visitor tasks?

Three structurally different homepage variants on the existing `/` route, switchable via `?variant=` and the floating development-only arrow bar:

- `http://localhost:3000/?variant=A` — **Ink / Signal**: asymmetric ink-panel spread.
- `http://localhost:3000/?variant=B` — **Midnight Serial**: oversized cover and horizontal story strips.
- `http://localhost:3000/?variant=C` — **Field Notes**: journal column and marginalia.

Run `pnpm prototype` from `/home/royce/royce-manga-prototype`. The work is isolated on `prototype/manga-redesign`; the original worktree and `master` are unchanged. The homepage source is `src/app/(app)/manga-home-prototype.tsx`. Project index/detail and Kanjou retain their existing routes and content.

The arrow bar wraps in either direction, supports keyboard arrows outside text fields and interactive widgets, and updates a reload-stable URL. The browser console prints the current variant, route, viewport, motion preference, and theme. No prototype state is persisted.

The local `.env.local` contains only the deployed site's public Firebase client configuration, not private credentials, and is not committed. Authenticated editing and OAuth require the real private settings documented below; the prototype does not mock or mutate production data.

The three variants are captured on this throwaway branch for comparison. No winner has been approved or promoted to `master`, and no implementation issue was supplied for a branch pointer.

### Direction and browser verification

Ink / Signal is the recommended starting point: asymmetric panels put identity, portrait, résumé/contact, and experience into one reading spread. Midnight Serial prioritizes cover impact; Field Notes prioritizes long-form reading. Reference study included the actual cover and interior pages in [VIZ's Ping Pong preview](https://www.viz.com/manga-books/manga/ping-pong-volume-1/product/6271/digital). The prototype uses original layout, rules, gutters, and screentone treatment with the existing photographs—not manga artwork.

Verified in Chromium at 1440×1000 and 390×844: all three homepage variants, project index/detail navigation, command-search keyboard selection, skip link, résumé PDF response, biography accordion, mobile sheet navigation and Escape focus restoration, settings/theme switching, back-to-top, URL/reload-stable variant controls, and reduced-motion preference changes. Kanjou's typewriter now reserves its text dimensions and hydrates consistently in both motion modes.

Local development performance smoke: one 180-frame foreground sample per variant at each viewport, with native wheel scrolling. All six samples had no frames above 50 ms and no long tasks during the sample. Frame p95 ranged from 17.1 to 17.5 ms; this is refresh-cadence-limited desktop Chromium with a mobile viewport, not a physical-phone or production benchmark. Buffered layout-shift totals were below 0.00002; a separate 90-frame entrance capture confirmed the GSAP animation ran with no layout-shift entries. No horizontal document overflow was observed.

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
