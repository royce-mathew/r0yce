# Overview

 <a href="https://github.com/royce-mathew/r0yce">
     <img src="./public/icon.svg" alt="royce.sh" height="100" />
  </a>

> A Personal Website Built with Next.js and Firebase. This repository contains the source code for my personal website.

--- 

![image](https://github.com/user-attachments/assets/f64c2265-3201-41a4-9312-151803339b7d)

The `royce.sh` website leverages Next.js to serve MDX content in a flexible environment, supporting both static site generation and on-demand server rendering. The application tracks content for each page, including projects, blog posts, and other resources, using MDX files to store metadata and content.

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
• `perf:check`: Checks production public-route JavaScript budgets after a Turbopack build.
• `perf:vitals`: Checks the production home page's median mobile LCP and CLS across five Lighthouse runs.

## Development Environment

To set up the development environment, follow these steps:

1. Create a `.env.local` file in the root directory. Use the `.env.example` file as a template.
2. Create a Firebase project and enable Google and Github authentication.
3. Add your Firebase configuration to the `.env.local` file.
4. Add Google OAuth and Github OAuth credentials to the `.env.local` file.

### Commits

Husky runs `pnpm lint` before commits and enforces [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with commitlint.

## Performance checks

Build and check production public-route JavaScript budgets:

```sh
pnpm build
pnpm perf:check
```

Route-entry gzip budgets are defined in `scripts/check-public-js.mjs`; they do
not measure total page transfer or load time. A compile-only check remains
available with `pnpm build:content && pnpm exec next build --experimental-build-mode compile`.

Run the mobile home-page load budget with Chrome/Chromium installed:

```sh
AUTH_TRUST_HOST=true pnpm perf:vitals
```

This starts the production build on port 3215 and uses pinned Lighthouse CI.
Set `CHROME_PATH` if Chrome is not auto-detected. `.lighthouserc.json` checks
the median of five cold-browser runs with mobile DevTools throttling:
LCP ≤ 2,500 ms and CLS ≤ 0.1. Reports stay local in `.lighthouseci/`.
CI runs both budget checks and saves Lighthouse artifacts. Its generated
local-only credentials permit Firebase SDK initialization and anonymous
session checks without production secrets; they do not grant database access
or exercise authenticated workflows.

Production Web Vitals reporting already uses Google Analytics
(`NEXT_PUBLIC_ANALYTICS_ID`). After deployment, compare per-page p75 LCP, INP,
and CLS against the preceding release; targets are ≤ 2.5 s, ≤ 200 ms, and ≤ 0.1.

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
