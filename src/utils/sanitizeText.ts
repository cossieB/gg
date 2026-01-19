import {marked} from "marked"
import DOMPurify, { Config } from "isomorphic-dompurify"

export function sanitizeText(str: string) {
    const m = marked(str) as string
    return DOMPurify.sanitize(m, config)
}

const config: Config = {
    ALLOWED_ATTR: ["src", "href", "alt"],
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'img']
}