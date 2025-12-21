import { UploadIcon } from "lucide-solid"
import { useToastContext } from "~/hooks/useToastContext"
import styles from "./UploadBox.module.css"

type P = {
    label: string
    onSuccess: (src: string) => void
    /**in MB */
    maxSize: number
}

export function UploadBox(props: P) {
    const { addToast } = useToastContext()
    return (
        <div
            class={styles.uploadBox}            
            onDragOver={e => {
                e.preventDefault()
                if (!e.dataTransfer) return
                const file = e.dataTransfer.files.item(0)
                if (!file) return
                console.log(file.type)
            }}
            ondrop={e => {
                e.preventDefault()
                if (!e.dataTransfer) return
                const file = e.dataTransfer.files.item(0)
                if (!file) return
                if (!file.type.startsWith("image"))
                    return addToast({ text: "Invalid Image", type: "error" })
                if (file.size > props.maxSize * 1024 * 1024)
                    return addToast({ text: "Image too large", type: "error" })
                const url = e.dataTransfer.getData("URL")
                if (url) return props.onSuccess(url)
            }}
        >
            <label>{props.label}</label>
            <UploadIcon />
            <span>MAX: {props.maxSize} MB</span>
        </div>
    )
}