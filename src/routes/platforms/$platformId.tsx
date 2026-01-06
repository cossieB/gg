import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, notFound } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { CompanyPage } from '~/components/CompanyPage/CompanyPage'
import { GamesList } from '~/features/games/components/GamesList'
import { NotFound } from '~/components/NotFound/NotFound'
import { getGamesByPlatformFn } from '~/serverFn/games'
import { getPlatformFn } from '~/serverFn/platforms'
import { STORAGE_DOMAIN } from '~/utils/env'

export const Route = createFileRoute('/platforms/$platformId')({
    component: RouteComponent,
    params: {
        parse: params => ({
            platformId: Number(params.platformId)
        })
    },
    loader: async ({ context, params }) => {
        if (Number.isNaN(params.platformId)) throw notFound()
        context.queryClient.ensureQueryData({
            queryKey: ["games", "byPlatform", params.platformId],
            queryFn: () => getGamesByPlatformFn({ data: params.platformId })
        })
        return await context.queryClient.ensureQueryData({
            queryKey: ["platforms", params.platformId],
            queryFn: () => getPlatformFn({ data: params.platformId })
        })
    },
    head: ({ loaderData }) => ({
        meta: loaderData ? [{ title: loaderData.name + " :: GG" }] : undefined,
    }),
    notFoundComponent: () => <NotFound message="These Aren't The Platforms You're Looking For" />
})

function RouteComponent() {
    const params = Route.useParams()
    const platformResult = useQuery(() => ({
        queryKey: ["platforms", params().platformId],
        queryFn: () => getPlatformFn({ data: params().platformId })
    }))

    return (
        <>
            <Suspense>
                <CompanyPage
                    id={platformResult.data!.platformId}
                    logo={STORAGE_DOMAIN + platformResult.data!.logo}
                    name={platformResult.data!.name}
                    summary={platformResult.data!.summary}
                    type="platform"
                />
            </Suspense>
            <GamesList
                opts={{
                    queryKey: ["games", "byPlatform", params().platformId],
                    queryFn: () => getGamesByPlatformFn({ data: params().platformId })
                }}
            />
        </>
    )
}
