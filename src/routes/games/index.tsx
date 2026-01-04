import { createFileRoute } from '@tanstack/solid-router'
import { GamesList } from '~/features/games/components/GamesList'
import { getGamesFn } from '~/serverFn/games'

export const Route = createFileRoute('/games/')({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData({
            queryKey: ["games"],
            queryFn: () => getGamesFn()
        })
    },
    head: () => ({
        meta: [{ title: "Games :: GG" }],
    }),
})

function RouteComponent() {

    return (
        <GamesList
            opts={{
                queryKey: ["games"],
                queryFn: () => getGamesFn(),
            }}
        />
    )
}
