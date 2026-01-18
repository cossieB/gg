import { createFileRoute } from '@tanstack/solid-router'
import { GamesList } from '~/features/games/components/GamesList'

export const Route = createFileRoute('/_pub/_static/games/')({
    component: RouteComponent,

    head: () => ({
        meta: [{ title: "Games :: 1Clip" }],
    }),
})

function RouteComponent() {

    return (
        <GamesList
            filters={{}}
        />
    )
}
