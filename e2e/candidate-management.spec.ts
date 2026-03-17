import { test, expect } from '@playwright/test'

test.beforeEach(async ({ request }) => {
  await request.post('/api/candidates/reset')
})

test.describe('Candidate Management', () => {
  test('page loads with seeded candidates in NEW column', async ({ page }) => {
    await page.goto('/live-session')

    const newColumn = page.locator('[data-status="NEW"]')
    await expect(newColumn).toBeVisible()
    await expect(newColumn.getByText('Alice Johnson')).toBeVisible()
    await expect(newColumn.getByText('Bob Williams')).toBeVisible()
  })

  test('create a new candidate', async ({ page }) => {
    await page.goto('/live-session')

    await page.getByLabel('Candidate Name').fill('Charlie Brown')
    await page.getByRole('button', { name: 'Create' }).click()

    const newColumn = page.locator('[data-status="NEW"]')
    await expect(newColumn.getByText('Charlie Brown')).toBeVisible()
  })

  test('shortlist a candidate with valid reason', async ({ page }) => {
    await page.goto('/live-session')

    // Click on Alice's card to open the sheet
    await page.getByText('Alice Johnson').click()

    // Sheet should open — select SHORTLIST decision
    await page.getByRole('combobox', { name: /decision/i }).click()
    await page.getByRole('option', { name: 'Shortlist' }).click()

    // Enter a valid reason (>=10 chars)
    await page.getByLabel(/reason/i).fill('Excellent qualifications and experience')

    // Submit
    await page.getByRole('button', { name: 'Submit Decision' }).click()

    // Card should move to SHORTLISTED column
    const shortlistedColumn = page.locator('[data-status="SHORTLISTED"]')
    await expect(shortlistedColumn.getByText('Alice Johnson')).toBeVisible()
  })

  test('reject a candidate with valid reason', async ({ page }) => {
    await page.goto('/live-session')

    await page.getByText('Bob Williams').click()

    await page.getByRole('combobox', { name: /decision/i }).click()
    await page.getByRole('option', { name: 'Reject' }).click()

    await page.getByLabel(/reason/i).fill('Does not meet minimum requirements for the role')

    await page.getByRole('button', { name: 'Submit Decision' }).click()

    const rejectedColumn = page.locator('[data-status="REJECTED"]')
    await expect(rejectedColumn.getByText('Bob Williams')).toBeVisible()
  })

  test('rejected candidate cannot be shortlisted', async ({ page }) => {
    await page.goto('/live-session')

    // First reject Alice
    await page.getByText('Alice Johnson').click()
    await page.getByRole('combobox', { name: /decision/i }).click()
    await page.getByRole('option', { name: 'Reject' }).click()
    await page.getByLabel(/reason/i).fill('Does not meet the requirements for this position')
    await page.getByRole('button', { name: 'Submit Decision' }).click()

    // Wait for sheet to close and card to move
    await expect(page.locator('[data-status="REJECTED"]').getByText('Alice Johnson')).toBeVisible()

    // Click on the now-rejected Alice
    await page.locator('[data-status="REJECTED"]').getByText('Alice Johnson').click()

    // Decision form should NOT be shown — instead see "already been rejected" message
    await expect(page.getByText(/already been rejected/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Decision' })).not.toBeVisible()
  })

  test('shortlisted candidate cannot be rejected', async ({ page }) => {
    await page.goto('/live-session')

    // Shortlist Bob
    await page.getByText('Bob Williams').click()
    await page.getByRole('combobox', { name: /decision/i }).click()
    await page.getByRole('option', { name: 'Shortlist' }).click()
    await page.getByLabel(/reason/i).fill('Strong technical skills and great culture fit')
    await page.getByRole('button', { name: 'Submit Decision' }).click()

    await expect(
      page.locator('[data-status="SHORTLISTED"]').getByText('Bob Williams')
    ).toBeVisible()

    // Click on the now-shortlisted Bob
    await page.locator('[data-status="SHORTLISTED"]').getByText('Bob Williams').click()

    await expect(page.getByText(/already been shortlisted/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Decision' })).not.toBeVisible()
  })

  test('reason under 10 characters shows validation error', async ({ page }) => {
    await page.goto('/live-session')

    await page.getByText('Alice Johnson').click()

    const sheet = page.getByLabel('Candidate Details')

    // Type a short reason and blur to trigger validation
    const reasonField = sheet.getByLabel(/reason/i)
    await reasonField.fill('short')
    await reasonField.blur()

    // Validation error should appear within the sheet
    await expect(sheet.getByText(/at least 10 characters/i)).toBeVisible()

    // Submit button should be disabled
    await expect(sheet.getByRole('button', { name: 'Submit Decision' })).toBeDisabled()
  })

  test('empty candidate name shows validation error', async ({ page }) => {
    await page.goto('/live-session')

    // Type spaces then blur to trigger validation
    const nameInput = page.getByLabel('Candidate Name')
    await nameInput.fill('   ')
    await nameInput.blur()

    await expect(page.getByText(/cannot be empty/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create' })).toBeDisabled()
  })
})
