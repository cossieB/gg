import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, notFound } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { PostId } from '~/features/posts/components/PostId'
import { getPostFn } from '~/serverFn/posts'

export const Route = createFileRoute('/posts/$postId')({
    params: {
        parse: params => ({
            postId: Number(params.postId)
        })
    },
    loader: async ({ context, params: { postId }, }) => {        
        if (Number.isNaN(postId)) throw notFound()
        return await context.queryClient.ensureQueryData({
            queryKey: ["post", postId],
            queryFn: () => getPostFn({ data: postId })
        })
    },
    head: ({ loaderData }) => ({
        meta: loaderData ? [{ title: loaderData.title + " :: GG" }] : undefined,
    }),
    component: RouteComponent,
})

function RouteComponent() {
    const params = Route.useParams()
    const result = useQuery(() => ({
        queryKey: ["post", params().postId],
        queryFn: () => getPostFn({ data: params().postId })
    }))


    return (
        <Suspense>
            <PostId post={result.data!} />
        </Suspense>
    )
}
