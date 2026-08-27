import { test as teardown } from '@playwright/test';
import { eq } from 'drizzle-orm';
import { db } from '~/drizzle/db';
import { users } from '~/drizzle/schema';
import { redis } from '~/utils/redis';

teardown('reset data', async ({ }) => {
    await db.delete(users)
    await redis.flushAll()
});