import { useQuery } from '@tanstack/solid-query'
import { createFileRoute, notFound } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { CompanyPage } from '~/components/CompanyPage/CompanyPage'
import { GamesList } from '~/features/games/components/GamesList'
import { NotFound } from '~/components/NotFound/NotFound'
import { getDeveloperFn } from '~/serverFn/developers'
import { getGamesByDeveloperFn } from '~/serverFn/games'
import { STORAGE_DOMAIN } from '~/utils/env'

export const Route = createFileRoute('/developers/$developerId')({
    component: RouteComponent,
    params: {
        parse: params => ({
            developerId: Number(params.developerId)
        })
    },
    loader: async ({ context, params }) => {
        if (Number.isNaN(params.developerId)) throw notFound();
        context.queryClient.ensureQueryData({
            queryKey: ["games", "byDev", params.developerId],
            queryFn: () => getGamesByDeveloperFn({ data: params.developerId })
        })
        return await context.queryClient.ensureQueryData({
            queryKey: ["developers", params.developerId],
            queryFn: () => getDeveloperFn({ data: params.developerId })
        })
    },
    head: ({ loaderData }) => ({
        meta: loaderData ? [{ title: loaderData.name + " :: GG" }] : undefined,
    }),
    notFoundComponent: () => <NotFound message="These Aren't The Devs You're Looking For" />
})

function RouteComponent() {
    const params = Route.useParams()
    const devResult = useQuery(() => ({
        queryKey: ["developers", params().developerId],
        queryFn: () => getDeveloperFn({ data: params().developerId })
    }))

    return (
        <>
            <Suspense>
                <CompanyPage
                    id={devResult.data!.developerId}
                    logo={STORAGE_DOMAIN + devResult.data!.logo}
                    name={devResult.data!.name}
                    summary={devResult.data!.summary}
                    type='developer'
                />
            </Suspense>
            <GamesList
                opts={{
                    queryKey: ["games", "byDev", params().developerId],
                    queryFn: () => getGamesByDeveloperFn({ data: params().developerId })
                }}
            />
        </>
    )
}
