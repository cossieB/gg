import { test, expect } from '@playwright/test';
import assert from 'node:assert';

test("invalid login", async ({ page }) => {
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

    const response = await page.waitForResponse('http://localhost:1337/api/auth/sign-in/username');
    expect(response.status()).toBe(401);
});

test('valid login', async ({ page }) => {
    await page.goto('http://localhost:1337/auth/signin', {
        waitUntil: 'domcontentloaded'
    });
    await page.waitForSelector("body[data-test-ready]")
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('testuser');
    await page.locator('input[type="text"]').press('Tab');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.locator('input[type="password"]').press('Tab');
    await page.getByRole('button', { name: 'Submit' }).click();
    const response = await page.waitForResponse('http://localhost:1337/api/auth/sign-in/username');    
    expect(response.status()).toBe(200);
    await page.waitForURL("**/profile")    
});

test('signup flow', async ({ page, request }) => {
    const username = 'newuser'
    await page.goto('http://localhost:1337/auth/signup', {
        waitUntil: "domcontentloaded"
    });
    await page.waitForSelector("body[data-test-ready]")    
    await page.getByTestId("email").click();
    await page.getByTestId("email").fill('user@example.com');
    await page.getByTestId("email").press('Tab');
    await page.getByTestId("username").fill(username);
    await page.getByTestId("username").press('Tab');
    await page.getByTestId("password").fill('password');
    await page.getByTestId("password").press('Tab');
    await page.getByTestId("confirmPassword").fill('password');
    await page.getByTestId("confirmPassword").press('Tab');
    await page.getByRole('button', { name: 'Submit' }).click();
    const response = await page.waitForResponse('http://localhost:1337/api/auth/sign-up/email');
    expect(response.ok()).toBe(true)
    await page.waitForURL("**/profile", {
        waitUntil: "domcontentloaded"
    });
    const verificationReminder = page.getByText("Your account is unverified")
    await expect(verificationReminder).toBeVisible()
    
    //verify
    const emailResponse = await request.get("/api/testing/verification-token");
    const verificationLink = await emailResponse.text()
    assert(verificationLink)
    await page.goto(verificationLink)
    await page.waitForSelector("body[data-test-ready]")   
    await expect(verificationReminder).not.toBeVisible()
});