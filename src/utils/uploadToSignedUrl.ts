
export async function uploadToSignedUrl(url: string, file: File, obj?: { signal?: AbortSignal; }) {
    const res = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
        signal: obj?.signal
    });
}
