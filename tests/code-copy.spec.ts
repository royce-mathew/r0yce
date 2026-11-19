import { expect, test } from "@playwright/test"

test.use({ permissions: ["clipboard-read", "clipboard-write"] })

test("code can be copied by keyboard using its accessible button name", async ({ page }) => {
  await page.goto("/projects/spyder")
  const copy = page.getByRole("button", { name: "Copy code", exact: true }).first()
  await copy.focus()
  await expect(copy).toBeVisible()
  await page.keyboard.press("Enter")

  await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("python3 setup.py\n")
  await expect(copy).toBeVisible()
})
