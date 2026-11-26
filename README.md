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
2. Use Node.js 24.x (24.15+) or 26+, install the pinned pnpm version from `package.json`, then run `pnpm install --frozen-lockfile`.
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
• `test:e2e`: Runs browser checks against the production build, including keyboard navigation in project contents. Run `pnpm build` first.
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

### Adaptive site search

Site search works without the Libraries.dev model. To add the optional cursor
effects and search highlight, download the React kit 0.5 and model 0.4 from
[Libraries.dev → Install](https://libraries.dev/mood-recognition). Run these
commands from the repository root, with `downloads` set to the ZIP directory:

```sh
downloads="$HOME/Downloads"
unzip -o "$downloads/MoodRecognition-React-0.5.zip" -d .site-mood
unzip -o "$downloads/MoodRecognition-0.4.zip" -d .site-mood
install -D .site-mood/LICENSE-MODEL.md public/licenses/site-mood.txt
NEXT_PUBLIC_ADAPTIVE_HELP=1 pnpm dev
```

In **Settings**, select **Show adaptive cursor effects**, then move your mouse.
The cursor shows a ring and a click ripple. When the model detects friction,
the ring and the shared search button light up. Reduced motion hides the cursor
effects without disabling the search hint. The setting follows navigation in
the tab and resets on reload. The reader and model load only after opt-in.
Interaction signals and the baseline stay in memory; search, settings, and the
sign-in form are excluded from the reader.

For an authorized production build, provision the ZIPs privately and set
`NEXT_PUBLIC_ADAPTIVE_HELP=1` when running `pnpm build`. Do not commit the kit
or model, publish the archives, or serve the model as a standalone download.
Before releasing an enabled build, verify that your distribution complies with
the [Libraries.dev Model License](https://github.com/Jakubantalik/Libraries.dev/blob/main/LICENSE-MODEL.md)
and this repository's license. Commercial releases require a qualifying
Libraries.dev plan.

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

## End-to-end checks

After `pnpm build`, run `pnpm test:e2e`. Playwright starts the production
server on `127.0.0.1:3219`; leave that port free. Install its browser with
`pnpm exec playwright install --with-deps --only-shell chromium` if needed.
Coverage includes blog-filter history and Wordle keyboard entry, restarting,
and opening site search without submitting a guess. Code-copy coverage checks
keyboard activation by accessible name and the exact clipboard contents.

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
