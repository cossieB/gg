import { useQuery } from "@tanstack/solid-query"
import type { getGamesFn } from "~/serverFn/games"
import { PhotoCardGrid } from "../../../components/CardLink/PhotoCardLink"
import { useGamesQuery } from "~/features/games/hooks/useGameQuery"

type Opts = {
    queryKey: readonly ["games", ...(string | number)[]],
    queryFn: () => ReturnType<typeof getGamesFn>
}

export function GamesList(props: {opts: Opts}) {
    const result = useGamesQuery(props.opts)

    return <PhotoCardGrid
        arr={result.data!}
        getLabel={game => game.title}
        getPic={game => game.cover}
        getParam={game => ({
            gameId: game.gameId
        })}
        to='/games/$gameId'
    />
}