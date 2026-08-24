import { test, expect } from '@playwright/test';

test("init", async ({ page }) => {
    await page.goto('http://localhost:1337/auth/signin', {
        waitUntil: 'domcontentloaded'
    });
    await page.waitForSelector("body[data-test-ready]")
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(submitBtn).toBeDisabled();

    await usernameInput.click();
    await usernameInput.fill('hacker');
    await expect(submitBtn).toBeDisabled();

    await usernameInput.press('Tab');
    await passwordInput.fill('P4$$w0rD');
    await passwordInput.press('Tab');

    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    const response = await page.waitForResponse(
        'http://localhost:1337/api/auth/sign-in/username'
    );
    expect(response.status()).toBe(401);
});