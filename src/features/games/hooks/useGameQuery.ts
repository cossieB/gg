import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/solid-query"
import { createEffect } from "solid-js"
import { type getGamesFn } from "~/serverFn/games"

type Opts = {
    queryKey: readonly ["games", ...(string | number)[]],
    queryFn: () => ReturnType<typeof getGamesFn>
}

export function useGamesQuery(opts: Opts ) {
    const result = useQuery(() => opts)
    const queryClient = useQueryClient()
    
    createEffect(() => {
        if (result.data)
            for (const game of result.data) {
                queryClient.setQueryData(["games", game.gameId], game)
                queryClient.setQueryData(["developers", game.developer.developerId], game.developer)
                queryClient.setQueryData(["publishers", game.publisher.publisherId], game.publisher)
                queryClient.setQueryData(["publishers", game.publisher.publisherId], game.publisher)
            }
    })
    return result
}