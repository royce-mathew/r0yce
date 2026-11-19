import { expect, test } from "@playwright/test"

test("a missing project shows the site 404 and offers a way home", async ({ page }) => {
  const response = await page.goto("/projects/no-such-project-afk")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible()
  await page.getByRole("link", { name: "Return home" }).click()
  await expect(page).toHaveURL("/")
})
