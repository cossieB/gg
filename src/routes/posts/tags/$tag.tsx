import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { PostList } from '~/features/posts/components/PostList'
import { usePostCache } from '~/features/posts/hooks/usePostCache'
import { postQueryOpts } from '~/features/posts/utils/postQueryOpts'
import { getPostsFn } from '~/serverFn/posts'

export const Route = createFileRoute('/posts/tags/$tag')({
    component: RouteComponent,
    loader: async ({ context, params: { tag } }) => {
        await context.queryClient.ensureQueryData(postQueryOpts({tag}))
    }
})

function RouteComponent() {
    const params = Route.useParams()
    const result = useQuery(() => (postQueryOpts({tag: params().tag})))

    usePostCache(result)

    return (
        <Suspense>
            <PostList posts={result.data!} />
        </Suspense>
    )
}
