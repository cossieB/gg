import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/platforms/$platformId')({
  params: {
    parse: params => ({
      platformId: Number(params.platformId)
    })
  },
})
