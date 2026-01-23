import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_pub/posts')({
    headers: () => ({
        "Cache-Control": "max-age=3600, private"
    })
})
