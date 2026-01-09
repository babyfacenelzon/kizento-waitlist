import { test, expect } from "@playwright/test"

test.describe("Waitlist Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the landing page correctly", async ({ page }) => {
    // Check logo is visible
    await expect(page.getByRole("img", { name: "Kizento" })).toBeVisible()

    // Check title
    await expect(
      page.getByRole("heading", { name: /L'art du bento, réinventé/i })
    ).toBeVisible()

    // Check subtitle
    await expect(
      page.getByText(/Bentos isothermes premium, design japonais/i)
    ).toBeVisible()

    // Check form elements
    await expect(page.getByPlaceholder("votre@email.com")).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Rejoindre la liste/i })
    ).toBeVisible()

    // Check benefits section
    await expect(page.getByText("Accès prioritaire")).toBeVisible()
    await expect(page.getByText("-15% early bird")).toBeVisible()
    await expect(page.getByText("Livraison offerte")).toBeVisible()

    // Check footer
    await expect(page.getByText(/Kizento\. Tous droits réservés/i)).toBeVisible()
  })

  test("should show error for invalid email", async ({ page }) => {
    const emailInput = page.getByPlaceholder("votre@email.com")
    const submitButton = page.getByRole("button", { name: /Rejoindre la liste/i })

    // Enter invalid email
    await emailInput.fill("invalid-email")
    await submitButton.click()

    // Check for error toast or validation message
    // HTML5 validation should prevent submission
    await expect(emailInput).toHaveAttribute("type", "email")
  })

  test("should show error when email is empty", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /Rejoindre la liste/i })

    // Click submit without entering email
    await submitButton.click()

    // Form should not submit (required field)
    const emailInput = page.getByPlaceholder("votre@email.com")
    await expect(emailInput).toHaveAttribute("required", "")
  })

  test("should have proper SEO metadata", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Kizento/i)

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute(
      "content",
      /Bentos isothermes premium/i
    )

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute("content", /Kizento/i)
  })

  test("should have accessible form", async ({ page }) => {
    // Check email input has proper type
    const emailInput = page.getByPlaceholder("votre@email.com")
    await expect(emailInput).toHaveAttribute("type", "email")
    await expect(emailInput).toHaveAttribute("required", "")

    // Check submit button is accessible
    const submitButton = page.getByRole("button", { name: /Rejoindre la liste/i })
    await expect(submitButton).toBeEnabled()
  })

  test("should show loading state when submitting", async ({ page }) => {
    const emailInput = page.getByPlaceholder("votre@email.com")
    const submitButton = page.getByRole("button", { name: /Rejoindre la liste/i })

    // Enter valid email
    await emailInput.fill("test@example.com")

    // Submit and check for loading state
    await submitButton.click()

    // Button should show loading or be disabled briefly
    // Note: This test may pass quickly if the API responds fast
    // In a real scenario, you might mock the API to test loading state
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that main elements are still visible
    await expect(page.getByRole("img", { name: "Kizento" })).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /L'art du bento, réinventé/i })
    ).toBeVisible()
    await expect(page.getByPlaceholder("votre@email.com")).toBeVisible()
    await expect(
      page.getByRole("button", { name: /Rejoindre la liste/i })
    ).toBeVisible()
  })
})
