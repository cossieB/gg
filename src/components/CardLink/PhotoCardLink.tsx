import { Link, type LinkComponentProps } from "@tanstack/solid-router"
import styles from "./PhotoCardLink.module.css"
import type { Require } from "~/lib/utilityTypes"
import { For } from "solid-js"

type Props = {
    label: string
    picture: string
} & Require<LinkComponentProps, 'to' | 'params'>

export function PhotoCardLink(props: Props) {

    return (
        <div class={styles.card}>
            <div class={styles.imgWrapper}><img src={props.picture} alt="" /></div>
            <label> {props.label} </label>
            <Link class={styles.a} to={props.to} params={props.params} />
        </div>
    )
}

type P<T> = {
    arr: T[]
    getLabel: (item: T) => string
    getPic: (item: T) => string
    getParam: (item: T) => NonNullable<LinkComponentProps['params']>
} & Require<LinkComponentProps, 'to'>

export function PhotoCardGrid<T>(props: P<T>) {
    return (
        <div class={styles.grid} >
            <For each={props.arr}>
                {item => 
                    <PhotoCardLink
                        label={props.getLabel(item)}
                        picture={props.getPic(item)}
                        to={props.to}
                        params={props.getParam(item)}
                    />
                }
            </For>
        </div>
    )
}