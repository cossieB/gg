import { createMiddleware } from "@tanstack/solid-start"
import { getCurrentUser } from "~/services/authService"

export const adminOnlyMiddleware = createMiddleware()
    .server(async ({ next }) => {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") throw new Response(null, { status: 401 })
        return next()
    })