import { onCleanup } from "solid-js"

export function useAbortController() {
    const abortController = new AbortController()

    onCleanup(() => abortController.abort())
    return abortController
}