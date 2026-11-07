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

## Development Environment

To set up the development environment, follow these steps:

1. Create a `.env.local` file in the root directory. Use the `.env.example` file as a template.
2. Create a Firebase project and enable Google and Github authentication.
3. Add your Firebase configuration to the `.env.local` file.
4. Add Google OAuth and Github OAuth credentials to the `.env.local` file.

### Commits

Husky runs `pnpm lint` before commits and enforces [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with commitlint.

## Performance

The shared session provider loads Firebase Auth and the Firebase client only when
a non-null NextAuth session needs synchronization. Anonymous portfolio visits do
not load those SDKs through the provider. Authenticated editor routes still load
their Firebase dependencies and retain custom-token synchronization.

Run the same public-route payload gate used in CI:

```sh
pnpm build:content
pnpm exec next build --experimental-build-mode compile
pnpm perf:check
```

The gate reads Turbopack's route-entry manifests, deduplicates each route's script
dependencies, and sums their individual gzip sizes at level 9. It excludes
separately bootstrapped Next runtime scripts, asynchronous chunks, CSS, fonts,
images, and RSC payloads; it is not a total network-transfer or load-time budget.
A missing manifest or exceeded budget fails the command. Compile mode permits
this check without Firebase service-account credentials, but does not replace a
configured full production build or authenticated persistence verification.

### Optimization ledger

The Firebase deferral is kept. In the controlled comparison, both sides include
the Web Vitals reporter and use the same analytics-enabled production compile,
Next.js 16.3.4, Node 24.21.0, pnpm 12.3.4, and generated content. The only
experimental difference is eager versus deferred Firebase imports in the shared
session provider.

| Route | Eager Firebase, gzip bytes | Deferred Firebase, gzip bytes | CI budget, gzip bytes |
| --- | ---: | ---: | ---: |
| `/` | 377,866 | 184,496 | 200,000 |
| `/projects` | 328,483 | 135,113 | 150,000 |
| `/projects/[slug]` | 344,761 | 151,391 | 170,000 |

Five measurements per side with `node scripts/check-public-js.mjs` produced
identical sizes within each set. These are deterministic asset measurements on
one compiled artifact per side, not five independent builds or timing samples.
The gate rejected all three routes with eager imports and passed with deferred
imports. The reduction comes from removing the Firebase SDK dependencies from
the initial route-entry graph, not from caching or omitting authentication.
No LCP, INP, or real-user speed improvement is inferred from these byte counts.

### Field metrics

When production analytics is configured with `NEXT_PUBLIC_ANALYTICS_ID`,
`WebVitals` reports `web_vitals` events through the existing Google Analytics
integration. Parameters include `metric_name`, `metric_id`, `metric_value`,
`metric_delta`, `metric_rating`, and `navigation_type`. Values remain in Web
Vitals' native units: milliseconds for timing metrics and a unitless CLS score.
No additional analytics service or credentials are introduced.

Local Chromium verification observed real LCP, FCP, and TTFB events in the
analytics data layer with outbound Google requests blocked. This proves event
collection, not ingestion into a live property. GA4 custom reporting, p75 alerts,
and representative field Core Web Vitals remain deployment-side verification.
Targets are p75 LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1.

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
