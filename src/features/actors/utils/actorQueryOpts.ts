import { queryOptions } from "@tanstack/solid-query";
import { getActorFn } from "~/serverFn/actors";

export function actorQueryOpts(actorId: number) {
    return queryOptions({
        queryKey: ["actors", actorId],
        queryFn: () => getActorFn({ data: actorId })
    })
}