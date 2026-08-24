import { test as setup } from '@playwright/test';
import { execSync } from 'node:child_process';
import { auth } from '~/auth/server';

setup('create new database', async ({ }) => {
    execSync("npx drizzle-kit push")
    // Create a test user account
    await auth.api.signUpEmail({
        body: {
            email: "testuser@example.com",
            password: "Password123!",
            name: "Test User",
            username: "testuser",
            displayUsername: "testuser",
        },
    });
});