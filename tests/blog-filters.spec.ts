import { expect, test } from "@playwright/test"

test("unmatched search shows empty results and clearing is reversible", async ({ page }) => {
  await page.goto("/blog")
  const articles = page.getByRole("article")
  const search = page.getByRole("searchbox", { name: "Search blogs" })
  await expect(articles.first()).toBeVisible()

  await search.pressSequentially("zz-no-results")
  await expect(page).toHaveURL("/blog?q=zz-no-results")
  await expect(search).toHaveValue("zz-no-results")
  await expect(page.getByRole("status")).toHaveText("0 blogs found")
  await expect(page.getByRole("heading", { name: "No blogs found." })).toBeVisible()
  await expect(articles).toHaveCount(0)

  await page.getByRole("button", { name: /^Clear filters/ }).click()
  await expect(page).toHaveURL("/blog")
  await expect(search).toHaveValue("")
  await expect(articles.first()).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL("/blog?q=zz-no-results")
  await expect(search).toHaveValue("zz-no-results")
  await expect(page.getByRole("status")).toHaveText("0 blogs found")

  await page.goForward()
  await expect(page).toHaveURL("/blog")
  await expect(search).toHaveValue("")
  await expect(articles.first()).toBeVisible()
})

test("topic selections survive Back and Forward without leaving the blog", async ({ page }) => {
  await page.goto("/projects")
  await page.getByRole("button", { name: "Open site index Index" }).click()
  await page.getByRole("link", { name: "03 Blog", exact: true }).click()
  await expect(page).toHaveURL("/blog")

  const topics = page.getByRole("group", { name: "Filter blogs by topic" })
  const ai = topics.getByRole("button", { name: "AI", exact: true })
  const software = topics.getByRole("button", { name: "Software", exact: true })
  const all = topics.getByRole("button", { name: "All blogs", exact: true })

  await ai.click()
  await expect(page).toHaveURL("/blog?tag=AI")
  await expect(ai).toHaveAttribute("aria-pressed", "true")
  await software.click()
  await expect(page).toHaveURL("/blog?tag=Software")
  await expect(software).toHaveAttribute("aria-pressed", "true")

  await page.goBack()
  await expect(page).toHaveURL("/blog?tag=AI")
  await expect(ai).toHaveAttribute("aria-pressed", "true")
  await page.goBack()
  await expect(page).toHaveURL("/blog")
  await expect(all).toHaveAttribute("aria-pressed", "true")
  await page.goBack()
  await expect(page).toHaveURL("/projects")

  await page.goForward()
  await expect(page).toHaveURL("/blog")
  await expect(all).toHaveAttribute("aria-pressed", "true")
  await page.goForward()
  await expect(page).toHaveURL("/blog?tag=AI")
  await expect(ai).toHaveAttribute("aria-pressed", "true")
  await page.goForward()
  await expect(page).toHaveURL("/blog?tag=Software")
  await expect(software).toHaveAttribute("aria-pressed", "true")
})
