import { expect, test } from "@playwright/test"

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" })

test("keyboard users reach project contents before the article", async ({ page }) => {
  await page.goto("/projects/spyder")
  const contents = page.getByRole("complementary", { name: "On this page" })
  const overview = contents.getByRole("link", { name: "Overview", exact: true })
  await expect(overview).toBeVisible()

  await page.getByRole("link", { name: "Read the story" }).focus()
  await page.keyboard.press("Tab")
  await expect(overview).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#overview$/)
})

test("the Back to top link is visible and works from the contents", async ({ page }) => {
  await page.goto("/projects/spyder")
  const contents = page.getByRole("complementary", { name: "On this page" })
  const back = contents.getByRole("link", { name: "Back to top" })
  await expect(back).toBeVisible()

  const links = contents.getByRole("link")
  await links.nth((await links.count()) - 2).focus()
  await page.keyboard.press("Tab")
  await expect(back).toBeFocused()
  await expect(back).toHaveCSS("opacity", "1")
  await page.keyboard.press("Enter")
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
