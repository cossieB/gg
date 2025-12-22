import { createMemo, Show, type JSXElement } from "solid-js";
import styles from "./Forms.module.css"
import { FormInput } from "./FormInput";
import { useFormContext } from "~/hooks/useFormContext";
import { Formtextarea } from "./FormTextarea";

type Props = {
    children: JSXElement;
    onSubmit: (e: SubmitEvent) => Promise<unknown>
    disabled?: boolean
    isPending: boolean
};

export function Form(props: Props) {
        const {errors} = useFormContext()
        const allErrors = createMemo(() => {
            return Object.values(errors).flat(1)
        })
    return (
        <form class={styles.form} onsubmit={props.onSubmit}>
            {props.children}
            <button disabled={props.isPending || props.disabled || allErrors().length > 0} type="submit">
                <Show when={props.isPending} fallback={"Submit"}>
                    <div class={styles.dot} style={{"--delay": "0.5s"}} />
                    <div class={styles.dot} style={{"--delay": "1s"}} />
                    <div class={styles.dot} style={{"--delay": "1.5s"}} />
                </Show>
            </button>
        </form>
    )
}

Form.Input = FormInput
Form.Textarea = Formtextarea