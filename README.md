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

## Blog design prototype

Run `pnpm prototype:blog`, then open `/prototype/blog`. This is a design-review
prototype, not the production blog. Three layouts share the same Markdown essay:

- `/prototype/blog?variant=editorial&view=article` — oversized typography and a quiet reading column.
- `/prototype/blog?variant=fieldnotes&view=article` — warm paper, serif text, and a notebook contents rail.
- `/prototype/blog?variant=visual&view=article` — split poster opening and an illustrated argument.

Use the floating controls to switch styles or preview the writing index. Left and
right arrow keys cycle styles outside editable fields. The URL preserves the
selection. Controls are development-only; the route has `noindex` metadata and is
not linked from the production navigation.

The first essay lives in
`src/content/blog-prototype/ai-is-not-replacing-us.md`. Velite compiles its
frontmatter, Markdown, reading time, and contents using the existing MDX pipeline.
The illustration expresses a concept, not a measured distribution.

Design question: which reading experience best fits Royce’s writing? Selection is
pending. Keep these alternatives on `prototype/markdown-blog-styles`; after review,
implement the selected direction as the production blog rather than merging the
throwaway route and switcher into the main branch.

## Development Environment

To set up the development environment, follow these steps:

1. Create a `.env.local` file in the root directory. Use the `.env.example` file as a template.
2. Create a Firebase project and enable Google and Github authentication.
3. Add your Firebase configuration to the `.env.local` file.
4. Add Google OAuth and Github OAuth credentials to the `.env.local` file.

### Commits

Husky runs `pnpm lint` before commits and enforces [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with commitlint.

## Performance checks

Run the public-route JavaScript budget check:

```sh
pnpm build:content
pnpm exec next build --experimental-build-mode compile
pnpm perf:check
```

CI runs the same check. Route-entry gzip budgets are defined in
`scripts/check-public-js.mjs`; they do not measure total page transfer or load time.

Production Web Vitals reporting uses the existing Google Analytics configuration
(`NEXT_PUBLIC_ANALYTICS_ID`).

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
