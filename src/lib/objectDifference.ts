export function objectDifference<T extends Record<string , string | number | boolean | undefined | null>>(newObj: T, oldObj: T) {
    const obj: Partial<T> = {}
    for (const key in newObj) {
        const oldVal = oldObj[key]
        const newVal = newObj[key]
        if (oldVal === newVal) continue
        obj[key] = newVal
    }
    return obj
}