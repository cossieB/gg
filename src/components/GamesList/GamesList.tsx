import { For } from "solid-js"
import type { findAll } from "~/repositories/gamesRepository"
import styles from "./GamesList.module.css"
import { Link } from "@tanstack/solid-router"
import { PhotoCardGrid, PhotoCardLink } from "../CardLink/PhotoCardLink"

type Props = {
    games: Awaited<ReturnType<typeof findAll>>
}

export function GamesList(props: Props) {
    return (
        <div class={styles.grid} >
            <PhotoCardGrid
                arr={props.games}
                getLabel={game => game.title}
                getPic={game => game.cover}
                getParam={game => ({gameId: game.gameId})}
                to="/games/$gameId"
            />
            {/* <For each={props.games}>
                {game =>
                    <PhotoCardLink
                        label={game.title}
                        picture={game.cover}
                        to="/games/$gameId"
                        params={{
                            gameId: game.gameId
                        }}
                    />}
            </For> */}
        </div>
    )
}

function GameCard(props: { game: Props["games"][number] }) {
    return (
        <div class={styles.card}>
            <div class={styles.imgWrapper}><img src={props.game.cover} alt="" /></div>
            <label> {props.game.title} </label>
            <Link class={styles.a} to={`/games/$gameId`} params={{ gameId: props.game.gameId }} />
        </div>
    )
}