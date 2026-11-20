import { expect, test } from "@playwright/test"

test.use({ viewport: { width: 844, height: 390 }, hasTouch: true })

test("players can tap the on-screen keyboard in landscape", async ({
  page,
}) => {
  await page.goto("/misc/wordle")

  const guess = page.getByRole("textbox", { name: "Current Wordle guess" })
  await expect(guess).toBeFocused()
  await page.locator('[data-skbtn="t"]').tap({ timeout: 3000 })
  await expect(guess).toHaveValue("t")
})

test("a narrow phone shows every key in full", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/misc/wordle")

  const guess = page.getByRole("textbox", { name: "Current Wordle guess" })
  const keys = await page.locator(".hg-button").evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect()
      return { left: box.left, right: box.right, width: box.width }
    })
  )
  for (const key of keys) {
    expect(key.left).toBeGreaterThanOrEqual(0)
    expect(key.right).toBeLessThanOrEqual(320)
    expect(key.width).toBeGreaterThanOrEqual(24)
  }

  const p = page.locator('[data-skbtn="p"]')
  await p.tap({ timeout: 3000 })
  await expect(guess).toHaveValue("p")
})
