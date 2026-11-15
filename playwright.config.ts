import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:3219",
  },
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 3219",
    url: "http://127.0.0.1:3219/",
  },
})
