import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { PhotoCardGrid } from '~/components/CardLink/PhotoCardLink'
import { CompanyPage } from '~/components/CompanyPage/CompanyPage'
import { getActorFn } from '~/services/actorService'
import { getGamesByActorFn } from '~/services/gamesService'

export const Route = createFileRoute('/actors/$actorId')({
    component: RouteComponent,
    params: {
        parse: params => ({
            actorId: Number(params.actorId)
        })
    },
    loader: async ({ context, params: { actorId } }) => {
        return await context.queryClient.ensureQueryData({
            queryKey: ["actors", actorId],
            queryFn: () => getActorFn({ data: actorId })
        })
    },
    head: ({ loaderData }) => ({
        meta: loaderData ? [{ title: loaderData.name + " :: GG" }] : undefined,
    }),
})

function RouteComponent() {
    const params = Route.useParams()
    const devResult = useQuery(() => ({
            queryKey: ["actors", params().actorId],
            queryFn: () => getActorFn({ data: params().actorId })
        }))

    const gamesResult = useQuery(() => ({
        queryKey: ["games", "withActor", params().actorId],
        queryFn: () => getGamesByActorFn({ data: params().actorId })
    }))

    return (
        <>
            <Suspense>
                <CompanyPage
                    id={devResult.data!.actorId}
                    logo={devResult.data!.photo}
                    name={devResult.data!.name}
                    summary={devResult.data!.bio}
                    showName
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
