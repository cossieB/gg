import { createFileRoute, redirect } from '@tanstack/solid-router'
import { CreatePostPage } from '~/features/posts/components/CreatePostPage';
import { getCurrentUser } from '~/serverFn/auth'
import { getGamesFn } from '~/serverFn/games'

export const Route = createFileRoute('/posts/create')({
    component: RouteComponent,
    beforeLoad: async () => {
        const user = await getCurrentUser();
        if (!user) throw redirect({ to: "/auth/signin", search: { redirect: "/create" }, })
    },

    loader: async ({ context }) => {
        return await context.queryClient.ensureQueryData({
            queryKey: ["games"],
            queryFn: () => getGamesFn()
        })
    },
    head: () => ({
        meta: [{ title: "Create Post :: GG" }],
    }),
})

function RouteComponent() {
    return <CreatePostPage />
}
