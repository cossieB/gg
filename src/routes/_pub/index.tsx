import { createFileRoute, redirect } from '@tanstack/solid-router'

export const Route = createFileRoute('/_pub/')({
  beforeLoad: async ({context}) => {
    throw redirect({to: "/posts", statusCode: 308})
  }
})