import { createMiddleware } from "@tanstack/solid-start"
import { getCurrentUser } from "~/serverFn/auth"
import { AppError } from "~/utils/AppError"

export const authedMiddleware = createMiddleware()
    .server(async ({ next }) => {
        const user = await getCurrentUser()
        if (!user) throw new AppError("Please login.", 401)
        return next({ context: { user } })
    })

export const verifiedOnlyMiddleware = createMiddleware()
    .middleware([authedMiddleware])
    .server(async ({ next, context }) => {
        if (!context.user.emailVerified) throw new AppError("Please verify your email first.", 403)
        return next()
    })

export const adminOnlyMiddleware = createMiddleware()
    .middleware([authedMiddleware])
    .server(async ({ next, context }) => {
        const { user } = context
        if (user.role !== "admin") throw new AppError("Forbidden", 403)
        return next()
    })

    