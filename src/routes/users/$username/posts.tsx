import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { PostList } from '~/features/posts/components/PostList'
import { postQueryOpts } from '~/features/posts/utils/postQueryOpts'

export const Route = createFileRoute('/users/$username/posts')({
    component: RouteComponent,
    loader: async ({params, context: {queryClient} }) => {
        await queryClient.ensureQueryData(postQueryOpts({ username: params.username }))
    }
})

function RouteComponent() {
    const params = Route.useParams()
    const postResult = useQuery(() => (postQueryOpts({ username: params().username })))
    return (
        <Suspense>
            <PostList posts={postResult.data!} />
        </Suspense>
    )
}

