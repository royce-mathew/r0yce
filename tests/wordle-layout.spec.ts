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
