import { queryOptions } from "@tanstack/solid-query";
import { getActorFn, getActorsFn, getActorsWithCharacters } from "~/serverFn/actors";

export function actorQueryOpts(actorId: number) {
    return queryOptions({
        queryKey: ["actor", actorId],
        queryFn: () => getActorFn({ data: actorId })
    })
}

export function actorsQueryOpts() {
    return queryOptions({
        queryKey: ["actors"],
        queryFn: () => getActorsFn()
    })
}

export function actorWithGamesQueryOpts(actorId: number) {
    return queryOptions({
        queryKey: ["actor", actorId, 'withGames'],
        queryFn: () => getActorsWithCharacters({data: actorId})
    })
}