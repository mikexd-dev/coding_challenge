import { test, expect } from '@playwright/test'

test.beforeEach(async ({ request }) => {
  const res = await request.post('/api/candidates/reset')
  expect(res.ok()).toBeTruthy()
})

/** Wait for the sheet to open and the decision form to be ready */
async function waitForDecisionForm(page: import('@playwright/test').Page) {
  const sheet = page.locator('[data-slot="sheet-content"]')
  await expect(sheet).toBeVisible()
  const combobox = page.getByRole('combobox')
  await expect(combobox).toBeVisible()
  return { sheet, combobox }
}

/** Wait for the sheet to open (for any candidate, including terminal states) */
async function waitForSheet(page: import('@playwright/test').Page) {
  const sheet = page.locator('[data-slot="sheet-content"]')
  await expect(sheet).toBeVisible()
  return sheet
}

/** Submit a decision for a candidate */
async function submitDecision(
  page: import('@playwright/test').Page,
  candidateName: string,
  decision: 'Shortlist' | 'Reject',
  reason: string
) {
  await page.getByText(candidateName).click()
  const { combobox } = await waitForDecisionForm(page)
  await combobox.click()
  await page.getByRole('option', { name: decision }).click()
  await page.getByLabel(/reason/i).fill(reason)
  await page.getByRole('button', { name: 'Submit Decision' }).click()
  // Wait for sheet to close
  await expect(page.locator('[data-slot="sheet-content"]')).not.toBeVisible()
}

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

    await submitDecision(
      page,
      'Alice Johnson',
      'Shortlist',
      'Excellent qualifications and experience'
    )

    const shortlistedColumn = page.locator('[data-status="SHORTLISTED"]')
    await expect(shortlistedColumn.getByText('Alice Johnson')).toBeVisible()
  })

  test('reject a candidate with valid reason', async ({ page }) => {
    await page.goto('/live-session')

    await submitDecision(
      page,
      'Bob Williams',
      'Reject',
      'Does not meet minimum requirements for the role'
    )

    const rejectedColumn = page.locator('[data-status="REJECTED"]')
    await expect(rejectedColumn.getByText('Bob Williams')).toBeVisible()
  })

  test('rejected candidate cannot be shortlisted', async ({ page }) => {
    await page.goto('/live-session')

    // First reject Alice
    await submitDecision(
      page,
      'Alice Johnson',
      'Reject',
      'Does not meet the requirements for this position'
    )

    // Wait for card to move
    await expect(page.locator('[data-status="REJECTED"]').getByText('Alice Johnson')).toBeVisible()

    // Click on the now-rejected Alice
    await page.locator('[data-status="REJECTED"]').getByText('Alice Johnson').click()
    const sheet = await waitForSheet(page)

    // Decision form should NOT be shown — instead see "already been rejected" message
    await expect(sheet.getByText(/already been rejected/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Decision' })).not.toBeVisible()
  })

  test('shortlisted candidate cannot be rejected', async ({ page }) => {
    await page.goto('/live-session')

    // Shortlist Bob
    await submitDecision(
      page,
      'Bob Williams',
      'Shortlist',
      'Strong technical skills and great culture fit'
    )

    await expect(
      page.locator('[data-status="SHORTLISTED"]').getByText('Bob Williams')
    ).toBeVisible()

    // Click on the now-shortlisted Bob
    await page.locator('[data-status="SHORTLISTED"]').getByText('Bob Williams').click()
    const sheet = await waitForSheet(page)

    await expect(sheet.getByText(/already been shortlisted/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Decision' })).not.toBeVisible()
  })

  test('reason under 10 characters shows validation error', async ({ page }) => {
    await page.goto('/live-session')

    await page.getByText('Alice Johnson').click()
    const sheet = await waitForSheet(page)

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
