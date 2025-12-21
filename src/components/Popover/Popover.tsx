import type { JSXElement } from "solid-js";
import styles from "./Popover.module.css"

export function Popover(props: {children: JSXElement}) {
    return (
        <div class={styles.popover + " cutout"} popover id="autoPopover">
            {props.children}
        </div>
    )
}

export function ConfirmPopover(props: {text: string, onConfirm: () => void}) {
    return (
        <Popover>
            <span>{props.text}</span>
            <button onclick={props.onConfirm} >Confirm</button>
        </Popover>
    )
}