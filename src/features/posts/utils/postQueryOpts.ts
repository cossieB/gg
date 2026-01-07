import { queryOptions } from "@tanstack/solid-query";
import { getPostsFn } from "~/serverFn/posts";

type Filters = {
    username?: string
    authorId?: string,
    likerUsername?: string,
    dislikerUsername?: string
    tag?: string
    limit?: number
    cursor?: number
}

export function postQueryOpts(filters?: Filters) {
    return queryOptions({
        queryKey: ["posts", filters],
        queryFn: () => getPostsFn({data: filters})
    })
}