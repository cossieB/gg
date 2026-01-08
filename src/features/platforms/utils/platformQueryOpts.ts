import { queryOptions } from "@tanstack/solid-query";
import { getPlatformFn } from "~/serverFn/platforms";

export function platformQueryOpts(platformId: number) {
    return queryOptions({
        queryKey: ["platforms", platformId],
        queryFn: () => getPlatformFn({ data: platformId })
    })
}