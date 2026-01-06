import { useQuery, useQueryClient } from '@tanstack/solid-query'
import { createFileRoute } from '@tanstack/solid-router'
import { Suspense, For, createEffect } from 'solid-js'
import { LogoLink } from '~/components/LogoLink/LogoLink'
import { getPublishersFn } from '~/serverFn/publishers'
import styles from "~/lists.module.css"
import { STORAGE_DOMAIN } from '~/utils/env'

export const Route = createFileRoute('/publishers/')({
    component: RouteComponent,
    loader: async ({ context }) => {
        return context.queryClient.ensureQueryData({
            queryKey: ["publishers"],
            queryFn: () => getPublishersFn()
        })
    },
    head: () => ({
        meta: [{ title: "Publishers :: GG" }],
    }),
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const result = useQuery(() => ({
        queryKey: ["publishers"],
        queryFn: () => getPublishersFn()
    }))

    createEffect(() => {
        if (result.data) {
            for (const item of result.data) {
                queryClient.setQueryData(["publishers", item.publisherId], item)
            }
        }
    })

    return (
        <Suspense>
            <div class={"grid300"}>
                <For each={result.data}>
                    {pub =>
                        <LogoLink
                            href='publisher'
                            item={{
                                id: pub.publisherId,
                                logo: STORAGE_DOMAIN + pub.logo,
                                name: pub.name
                            }}
                        />
                    }
                </For>
            </div>
        </Suspense>
    )
}
