import { test as teardown } from '@playwright/test';
import { execSync } from 'node:child_process';

teardown('stop containers', async ({ }) => {
    execSync("docker compose down -v")
});