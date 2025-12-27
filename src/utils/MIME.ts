const IMAGE_MIME_TYPES: readonly string[] = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const VIDEO_MIME_TYPES: readonly string[] = ["video/mp4", "video/mpeg", "video/ogg", "video/webm"]
const AUDIO_MIME_TYPES: readonly string[] = ["audio/aac", "audio/mpeg", "audio/midi", "audio/ogg", "audio/wav", "audio/webm"]

export const MIME_TYPES = {
    image: IMAGE_MIME_TYPES,
    video: VIDEO_MIME_TYPES,
    audio: AUDIO_MIME_TYPES
}