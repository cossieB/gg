import { createMemo, Show, type JSXElement } from "solid-js";
import { createStore } from "solid-js/store";
import styles from "./Forms.module.css"
import { FormInput } from "./FormInput";
import { Formtextarea } from "./FormTextarea";
import { FormSelect } from "./Select";
import { TagsInput } from "./TagsInput";
import { FormContext } from "./FormContext";
import { SubmitBtn } from "./SubmitBtn";

type Props = {
    children: JSXElement;
    onSubmit: (e: SubmitEvent) => Promise<unknown>
    disabled?: boolean
    isPending: boolean
};

export function Form(props: Props) {
    const [errors, setErrors] = createStore<Record<string, string[]>>({})
    const allErrors = createMemo(() => {
        return Object.values(errors).flat(1)
    })
    return (
        <FormContext.Provider value={{ errors, setErrors }}>
            <form class={styles.form} onsubmit={props.onSubmit}>
                {props.children}
                <SubmitBtn 
                    disabled={props.disabled || allErrors().length > 0}
                    isPending={props.isPending}
                />
            </form>
        </FormContext.Provider>
    )
}

Form.Input = FormInput
Form.Textarea = Formtextarea
Form.FormSelect = FormSelect
Form.TagsInput = TagsInput

