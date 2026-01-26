import { createFileRoute, redirect } from '@tanstack/solid-router'
import { Show } from 'solid-js'
import { authClient } from '~/auth/authClient'
import { PostList } from '~/features/posts/components/PostList'
import { postsQueryOpts } from '~/features/posts/utils/postQueryOpts'

export const Route = createFileRoute('/_pub/posts/_feed/for-you')({
    component: RouteComponent,
    loader: async ({ context }) => {
        if (!context.user) throw redirect({ to: "/posts", replace: true })
        await context.queryClient.ensureInfiniteQueryData(postsQueryOpts({ followerId: context.user.id }))
    },
})

function RouteComponent() {
    const session = authClient.useSession()
    return (
        <Show when={session().data}>
            <PostList
                filters={{
                    followerId: session().data!.user.id
                }}
            />
        </Show>
    )
}
