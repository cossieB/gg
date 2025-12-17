import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { PhotoCardGrid } from '~/components/CardLink/PhotoCardLink'
import { CompanyPage } from '~/components/CompanyPage/CompanyPage'
import { NotFound } from '~/components/NotFound'
import { getGamesByPlatformFn } from '~/services/gamesService'
import { getPlatformFn } from '~/services/platformService'

export const Route = createFileRoute('/platforms/$platformId')({
    component: RouteComponent,
    params: {
        parse: params => ({
            platformId: Number(params.platformId)
        })
    },
    loader: async ({ context, params: { platformId } }) => {
        return await context.queryClient.ensureQueryData({
            queryKey: ["platforms", platformId],
            queryFn: () => getPlatformFn({ data: platformId })
        })
    },
    notFoundComponent: () => <NotFound message="These Aren't The Platforms You're Looking For" />
})

function RouteComponent() {
    const params = Route.useParams()
    const platformResult = useQuery(() => ({
        queryKey: ["platforms", params().platformId],
        queryFn: () => getPlatformFn({ data: params().platformId })
    }))

    const gamesResult = useQuery(() => ({
        queryKey: ["games", "byPlatform", params().platformId],
        queryFn: () => getGamesByPlatformFn({ data: params().platformId })
    }))

    return (
        <>
            <Suspense>
                <CompanyPage
                    id={platformResult.data!.platformId}
                    logo={platformResult.data!.logo}
                    name={platformResult.data!.name}
                    summary={platformResult.data!.summary}
                />
            </Suspense>
            <PhotoCardGrid
                arr={gamesResult.data!}
                getLabel={game => game.title}
                getPic={game => game.cover}
                getParam={game => ({
                    gameId: game.gameId
                })}
                to='/games/$gameId'
            />
        </>
    )
}
