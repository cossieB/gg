import { AppError } from "./AppError.server"
import { redis } from "./redis.server"
import { HttpStatusCode } from "./statusCodes"
import '@tanstack/solid-start/server-only'

export async function rateLimiter(prefix: string, user: string, limit: number, window: number) {
    const key = `${prefix}:${user}`
    const count = await redis.incr(key)
    void redis.expire(key, window, 'NX')
    if (count > limit)
        throw new AppError("You're doing that too much", HttpStatusCode.TOO_MANY_REQUESTS)    
}