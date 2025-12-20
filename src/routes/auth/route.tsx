import { createFileRoute, Outlet, redirect } from '@tanstack/solid-router'
import { createIsomorphicFn, createServerFn } from '@tanstack/solid-start'
import { getRequestHeaders } from '@tanstack/solid-start/server'
import { auth } from '~/utils/auth'
import { authClient } from '~/utils/authClient'

const checkUser = createIsomorphicFn().server(async () => {
    console.log("SERVER")
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({
        headers
    })
    if (session) throw redirect({ to: "/profile" })
}).client(async () => {
        console.log("CLIENT")
    const session = authClient.useSession()
    if (session()?.data?.session) throw redirect({to: "/profile"})
})

export const Route = createFileRoute('/auth')({
    component: RouteComponent,
    loader: ({location, context}) => checkUser()
})

function RouteComponent() {
    return <Outlet />
}
