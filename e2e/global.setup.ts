import { test as setup } from '@playwright/test';

setup('create new database', async ({ request }) => {
  const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:1337';

  await request.post(`${baseURL}/api/auth/sign-up/email`, {
    data: {
      email: "testuser@example.com",
      password: "Password123!",
      name: "Test User",
      username: "testuser",
      displayUsername: "testuser",
    },
  });
});