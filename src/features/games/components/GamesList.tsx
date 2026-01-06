import type { getGamesFn } from "~/serverFn/games"
import { PhotoCardGrid } from "../../../components/CardLink/PhotoCardLink"
import { useGamesQuery } from "~/features/games/hooks/useGameQuery"
import { STORAGE_DOMAIN } from "~/utils/env"

type Opts = {
    queryKey: readonly ["games", ...(string | number)[]],
    queryFn: () => ReturnType<typeof getGamesFn>
}

export function GamesList(props: {opts: Opts}) {
    const result = useGamesQuery(props.opts)

    return <PhotoCardGrid
        arr={result.data!}
        getLabel={game => game.title}
        getPic={game => STORAGE_DOMAIN + game.cover}
        getParam={game => ({
            gameId: game.gameId
        })}
        to='/games/$gameId'
    />
}