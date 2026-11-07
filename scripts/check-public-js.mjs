import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { runInNewContext } from "node:vm"
import { gzipSync } from "node:zlib"

const buildDirectory = resolve(process.argv[2] ?? ".next")
const budgets = [
  { route: "/", entry: "(app)/page", gzipBytes: 200_000 },
  { route: "/projects", entry: "(app)/projects/page", gzipBytes: 150_000 },
  { route: "/projects/[slug]", entry: "(app)/projects/[slug]/page", gzipBytes: 170_000 },
]

let exceeded = false
for (const budget of budgets) {
  const filename = resolve(buildDirectory, "server/app", `${budget.entry}_client-reference-manifest.js`)
  const context = {}
  runInNewContext(await readFile(filename, "utf8"), context, { timeout: 1000 })
  const manifest = context.__RSC_MANIFEST?.[`/${budget.entry}`]
  const chunks = manifest?.entryJSFiles?.[`[project]/src/app/${budget.entry}`]
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error(`Missing Turbopack route-entry scripts for ${budget.route}; run the production compile first.`)
  }

  let gzipBytes = 0
  for (const chunk of new Set(chunks)) {
    gzipBytes += gzipSync(await readFile(resolve(buildDirectory, chunk)), { level: 9 }).length
  }
  const passed = gzipBytes <= budget.gzipBytes
  console.log(`${passed ? "PASS" : "FAIL"} ${budget.route}: ${gzipBytes} / ${budget.gzipBytes} gzip bytes`)
  if (!passed) exceeded = true
}

if (exceeded) process.exitCode = 1
