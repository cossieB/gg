export function debounce<T extends (...args: any[]) => any>(cb: T,  delay = 300, signal?: AbortSignal) {
    let timerId = -1

    return function (...args: Parameters<T>): void {
        clearTimeout(timerId);
        if (signal?.aborted) return;
        timerId = window.setTimeout(() => {
            cb(...args)
        }, delay)
    }
}