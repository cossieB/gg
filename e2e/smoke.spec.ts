import { test, expect } from '@playwright/test';

test.describe("smoke", () => {
    test("loads home page", async ({ page }) => {
        await page.goto("/")
        await page.waitForSelector("body[data-test-ready]")
    });

    test("gets 200 health endpoint response", async ({request}) => {
        const response = await request.get("/api/health");
        expect(response.status()).toBe(200)
    })
})