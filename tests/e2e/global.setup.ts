import { test as setup } from '@playwright/test';
import { execSync } from 'node:child_process';

setup('create new database', async ({ }) => {
    execSync("npx drizzle-kit push", { stdio: "inherit" })
});