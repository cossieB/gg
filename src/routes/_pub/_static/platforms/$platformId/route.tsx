import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_pub/_static/platforms/$platformId')({
  params: {
    parse: params => ({
      platformId: Number(params.platformId)
    })
  },
})
