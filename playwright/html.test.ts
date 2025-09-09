import { test, Page, expect, TestInfo } from '@playwright/test';
import { locators } from '../pages/locators'

async function fullScreenShot(page: Page, testInfo: TestInfo, filename?: string): Promise<void> {
  filename = filename ? filename : testInfo.title.replace('/\s+/g','_')
  filename = `${filename}.png`
  const screenshot = await page.screenshot({ path: `reports/playwright/screenshots/${filename}`, fullPage: true })
  await testInfo.attach(filename, {
    body: screenshot,
    contentType: 'image/png',
  });
}

test.describe.configure({ mode: 'serial' });
test.describe('Playwright Simple HTML Test', () => {

  test.beforeEach(async ({ page }) => {
    const htmlPath = `file://${__dirname}/../html/index.html`;
    await page.goto(htmlPath);
  });

  test('should load the example page and verify the title', async ({ page }, testInfo) => {
    const title = await page.locator('title').textContent();
    expect(title).toBe('Test HTML Page');
    await fullScreenShot(page, testInfo);
  });

  test('Validate table exists', async ({ page }) => {
    const table = page.locator(locators.table);
    expect(table).toBeTruthy();
  });

  test('Validate user name is bold when role is admin', async ({ page }) => {
    const rows = page.locator(locators.rows);
    for (let i = 0; i < await rows.count(); i++) {
      const role = await rows.nth(i).locator(locators.roleCell).textContent();
      const fontWeight = rows.nth(i).locator(locators.usernameCell)
      await expect(fontWeight).toHaveCSS('font-weight', role === 'admin' ? '700' : '400');
    }
  })

  test('Validate columns sequence is correct', async ({ page }) => {
    const headers = page.locator(`${locators.table} thead tr th`)
    const expectedHeaders = ['User Id', 'Name', 'Email', 'Role'];
    await expect(headers).toHaveCount(expectedHeaders.length)
    for (let i = 0; i < expectedHeaders.length; i++) {
      expect(await headers.nth(i).textContent()).toBe(expectedHeaders[i])
    }
  })

  test('Validate email, name and role columns exist', async ({ page }) => {
    const headers = page.locator(`${locators.table} thead tr th`)
    await expect(headers.nth(0)).toBeVisible()
    await expect(headers.nth(1)).toBeVisible()
    await expect(headers.nth(2)).toBeVisible()
    await expect(headers.nth(3)).toBeVisible()
  })

  test('Checks if the "N° Records found" information is presented', async ({ page }) => {
    const totalRecords = page.locator(locators.totalRecords)
    await expect(totalRecords).toBeVisible()
  })

  test('Checks if the "Records found" number is correct', async ({ page }) => {
    const rows = page.locator(locators.rows);
    const totalRecords = page.locator(locators.totalRecords)
    expect(await totalRecords.textContent()).toBe(`Records found: ${await rows.count()}`);
  })

})