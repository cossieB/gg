import { createMiddleware } from "@tanstack/solid-start";
import { setResponseHeader } from "@tanstack/solid-start/server";

export const staticDataMiddleware = createMiddleware({type: "function"})
    .server(async ({next}) => {
        setResponseHeader("Cache-Control", "max-age=3600, public")
        return next()
    })