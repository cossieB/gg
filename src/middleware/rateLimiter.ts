import { createMiddleware } from "@tanstack/solid-start"
import { AppError } from "~/utils/AppError"
import { redis } from "~/utils/redis"

export function rateLimiter(prefix: string, user: string, limit: number, window: number) {
    return createMiddleware()
        .server(async ({ next, }) => {
            const key = `${prefix}:${user}`
            const count = await redis.incr(key)
            void redis.expire(key, window, 'NX')
            if (count > limit)
                throw new AppError("You're doing that too much", 429)
            return next()
        })
}