import { createFileRoute, Outlet } from '@tanstack/solid-router'
import { Show } from 'solid-js'
import { authClient } from '~/auth/authClient'
import { NavTabs } from '~/components/NavTabs/NavTabs'

export const Route = createFileRoute('/_pub/posts/_feed')({
    headers: () => ({
        "Cache-Control": "max-age=3600, private"
    }),
    component: RouteComponent
})

function RouteComponent() {
    const session = authClient.useSession()
    return (
        <>
            <Show when={session().data}>
                <NavTabs
                    tabs={[{ to: "/posts", label: "All" }, { to: "/posts/for-you", label: "For You" }]}
                />
            </Show>
            <Outlet />
        </>
    )
}