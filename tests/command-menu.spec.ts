import { expect, test } from "@playwright/test"

test("closing site search from a shortcut returns focus to where it opened", async ({ page }) => {
  await page.goto("/blog")
  const name = "Search pages, projects, and blogs"
  const trigger = page.getByRole("button", { name })
  const search = page.getByRole("dialog", { name })
  const query = search.getByRole("combobox")

  await trigger.click()
  await expect(query).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()

  const topics = page.getByRole("group", { name: "Filter blogs by topic" })
  const all = topics.getByRole("button", { name: "All blogs", exact: true })
  await topics.getByRole("button", { name: "AI", exact: true }).click()
  await expect(page).toHaveURL("/blog?tag=AI")
  await all.focus()
  await page.keyboard.press("/")

  await expect(query).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(all).toBeFocused()
  await expect(search).toBeHidden()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL("/blog")
})
