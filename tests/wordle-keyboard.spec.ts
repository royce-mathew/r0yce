import { expect, test } from "@playwright/test"

test("keyboard users can start a new Wordle game", async ({ page }) => {
  await page.goto("/misc/wordle")
  const guess = page.getByRole("textbox", { name: "Current Wordle guess" })
  await guess.pressSequentially("cat")
  await expect(guess).toHaveValue("cat")

  await page.getByRole("button", { name: "New game", exact: true }).focus()
  await page.keyboard.press("Enter")
  await expect(guess).toHaveValue("")
  await expect(guess).toBeFocused()

  await guess.pressSequentially("dog")
  await guess.press("Backspace")
  await expect(guess).toHaveValue("do")
})

test("Wordle does not intercept keyboard activation of site navigation", async ({ page }) => {
  await page.goto("/misc/wordle")
  const guess = page.getByRole("textbox", { name: "Current Wordle guess", includeHidden: true })
  await guess.pressSequentially("crane")
  await expect(guess).toHaveValue("crane")
  await page.getByRole("button", { name: "Search pages, projects, and blogs" }).focus()
  await page.keyboard.press("Enter")

  const search = page.getByRole("dialog", { name: "Search pages, projects, and blogs" })
  await expect(search).toBeVisible()
  await expect(guess).toHaveValue("crane")
  await search.getByRole("combobox").fill("Projects")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL("/projects")
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible()
})
