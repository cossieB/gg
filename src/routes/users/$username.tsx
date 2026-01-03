import { useQuery } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense } from 'solid-js'
import { getUserByUsernameFn } from '~/serverFn/users'

export const Route = createFileRoute('/users/$username')({
    component: RouteComponent,
    loader: async ({params, context: {queryClient}}) => queryClient.ensureQueryData({
        queryKey: ["users", params.username],
        queryFn: () => getUserByUsernameFn({data: params.username})
    })
})

function RouteComponent() {
    const params = Route.useParams()
    const result = useQuery(() => ({
        queryKey: ["users", params().username],
        queryFn: () => getUserByUsernameFn({data: params().username})
    }))
    return (
        <Suspense>
            {result.data?.displayName}
        </Suspense>
    )
}
