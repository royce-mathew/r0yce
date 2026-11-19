import { expect, test } from "@playwright/test"

test("a manually started demo keeps playing when pointer and focus leave the card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/projects")

  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Fotoland" }) })
  const play = card.getByRole("button", { name: "Preview Fotoland demo" })
  const pause = card.getByRole("button", { name: "Pause Fotoland demo" })
  const video = card.locator("video")

  await play.click()
  await expect(pause).toBeFocused()
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
  await page.getByRole("heading", { name: "Projects", exact: true }).hover()
  await expect(pause).toBeVisible()

  await page.keyboard.press("Tab")
  await expect(page.getByRole("link", { name: /^Axelot/ })).toBeFocused()
  await expect(pause).toBeVisible()
  await expect(video).toHaveJSProperty("paused", false)

  await pause.press("Space")
  await expect(play).toBeFocused()
  await expect(video).toHaveCount(0)
})
