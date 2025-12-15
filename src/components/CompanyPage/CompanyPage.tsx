import { Show } from "solid-js"
import styles from "./CompanyPage.module.css"

type Props = {
    id: number,
    name: string,
    logo: string | null,
    summary: string
    showName?: boolean
}

export function CompanyPage(props: Props) {
    return (
        <div>
            <div class={styles.header} >
                <Show when={props.showName}>
                    <h1>{props.name}</h1>
                </Show>
                <img classList={{[styles.isActor]: props.showName}} src={props.logo ?? ""} alt="" />
            </div>
            <div class={`${styles.main} paras`} innerHTML={props.summary} />
        </div>
    )
}