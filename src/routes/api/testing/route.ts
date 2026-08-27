import { createFileRoute, notFound } from "@tanstack/solid-router"

export const Route = createFileRoute('/api/testing')({
    beforeLoad: () => {
        if (process.env.NODE_ENV != "test") throw notFound()

    },
})