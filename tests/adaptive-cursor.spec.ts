import { expect, test } from "@playwright/test"

test.skip(process.env.NEXT_PUBLIC_ADAPTIVE_HELP !== "1", "Requires the licensed build")

test("cursor brackets attach to a control and leave its click behavior intact", async ({ page }) => {
  await page.goto("/misc/wordle")
  await page.getByRole("button", { name: "Open settings" }).click()
  await page.getByRole("checkbox", { name: "Show adaptive cursor effects" }).check()
  await page.keyboard.press("Escape")

  const button = page.getByRole("button", { name: "New game" })
  const reticle = page.locator(".adaptive-cursor-reticle")
  const readout = page.locator("[data-cursor-target]")
  await button.hover({ position: { x: 20, y: 12 } })
  await expect(readout).toContainText("New game")

  async function expectAttached() {
    await expect.poll(async () => {
      const bounds = (await button.boundingBox())!
      const frame = (await reticle.boundingBox())!
      return Math.max(
        Math.abs(frame.x - bounds.x + 4),
        Math.abs(frame.y - bounds.y + 4),
        Math.abs(frame.width - bounds.width - 8)
      )
    }).toBeLessThan(0.5)
  }

  await expectAttached()
  const position = page.locator("[data-cursor-position]")
  const initialPosition = (await position.textContent())!
  await button.hover({ position: { x: 55, y: 12 } })
  await expect(position).not.toHaveText(initialPosition)
  await expectAttached()

  const guess = page.getByRole("textbox", { name: "Current Wordle guess" })
  await guess.pressSequentially("cat")
  await expect(guess).toHaveValue("cat")
  await button.click()
  await expect(guess).toHaveValue("")

  await page.mouse.move(32, 230)
  await expect.poll(async () => (await reticle.boundingBox())?.width ?? Infinity).toBeCloseTo(32, 0)
  await expect(readout).toBeHidden()
  await page.getByRole("button", { name: "Open settings" }).hover()
  await expect(reticle).toBeHidden()
})

test("cursor identifies disabled controls and respects reduced motion", async ({ page }) => {
  await page.route("**/images/comic-sample-ameyoko.jpg", (route) => route.abort())
  await page.goto("/misc/image-to-comic")
  await page.getByRole("button", { name: "Open settings" }).click()
  await page.getByRole("checkbox", { name: "Show adaptive cursor effects" }).check()
  await page.keyboard.press("Escape")

  const download = page.getByRole("button", { name: "Download PNG" })
  const readout = page.locator("[data-cursor-target]")
  await expect(download).toBeDisabled()
  await download.hover()
  await expect(readout).toBeVisible()
  await expect(readout).toContainText("Download PNG · disabled")

  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(readout).toBeHidden()
})
