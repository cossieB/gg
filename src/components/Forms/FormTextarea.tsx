import { ComponentProps, Setter, Show, splitProps } from "solid-js"
import styles from "./Forms.module.css"
import titleCase from "~/lib/titleCase"

type Props<T = any> = ({
    field: string & keyof T
    value: string
    setter: (val: string) => void
    label?: string
}) & ComponentProps<"textarea">

export function Formtextarea<T>(props: Props<T>) {
    const [p, rest] = splitProps(props, ["setter", "label"])
    const max = Number(props.maxLength) ?? Number.POSITIVE_INFINITY

    return (
        <div class={styles.formControl}>
            <textarea
                {...rest}
                value={props.value}
                placeholder=" "
                oninput={e => props.setter(e.currentTarget.value)}
            >
                {props.value}
            </textarea>
            <label> {p.label ?? titleCase(props.field)} </label>
            <Show when={max != Number.POSITIVE_INFINITY}>
                <div style={{ width: props.value.length / max * 100 + "%" }} class={styles.charIndicator} />
            </Show>
        </div>
    )
}

export function StandaloneTextarea(props: Required<Pick<Props, 'label' | 'value' | 'setter'>> & ComponentProps<"textarea">) {
    const [p, rest] = splitProps(props, ["setter", "label"])
    return (
        <div class={styles.formControl}>
            <textarea
                {...rest}
                value={props.value}
                placeholder=" "
                oninput={e => props.setter(e.currentTarget.value)}
            >
                {props.value}
            </textarea>
            <label> {titleCase(props.label)} </label>
            <Show when={props.maxLength && props.maxLength != Number.POSITIVE_INFINITY}>
                <div style={{ width: props.value.length / Number(props.maxLength) * 100 + "%" }} class={styles.charIndicator} />
            </Show>
        </div>
    )
} 