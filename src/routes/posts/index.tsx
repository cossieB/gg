import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { PostList } from '~/features/posts/components/PostList'
import { usePostCache } from '~/features/posts/hooks/usePostCache'
import { postQueryOpts } from '~/features/posts/utils/postQueryOpts'
import { getPostsFn } from '~/serverFn/posts'

export const Route = createFileRoute('/posts/')({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(postQueryOpts())
    },
    head: () => ({
        meta: [{ title: "Posts :: GG" }],
    }),
})

function RouteComponent() {
    const result = useQuery(() => (postQueryOpts()))

    usePostCache(result)

    return (
        <Suspense>
            <PostList posts={result.data!} />
        </Suspense>
    )
}