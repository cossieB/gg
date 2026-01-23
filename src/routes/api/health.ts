import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
        GET: async () => {
            return new Response("OK", {
                headers: {
                    "Cache-Control": "no-store"
                }
            })
        }
    }
  }
})

