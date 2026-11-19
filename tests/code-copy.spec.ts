import { expect, test } from "@playwright/test"

test.use({ permissions: ["clipboard-read", "clipboard-write"] })

test("code can be copied by keyboard using its accessible button name", async ({ page }) => {
  await page.goto("/projects/spyder")
  const copy = page.locator("figure").filter({ hasText: "python3 setup.py" }).getByRole("button")
  await expect(copy).toHaveAccessibleName("Copy code")
  const focusedCopy = copy.and(page.locator(":focus"))
  for (let tab = 0; tab < 30 && (await focusedCopy.count()) === 0; tab++) {
    await page.keyboard.press("Tab")
  }
  await expect(copy).toBeFocused()
  await expect(copy).toHaveCSS("opacity", "1")
  await page.keyboard.press("Enter")

  await expect(copy).toHaveAccessibleName("Copied")
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("python3 setup.py\n")
  await expect(copy).toHaveAccessibleName("Copy code")
})
