import { useQueryClient, useMutation } from "@tanstack/solid-query"
import { useNavigate } from "@tanstack/solid-router"
import { useServerFn } from "@tanstack/solid-start"
import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"
import { useGamesQuery } from "~/features/games/hooks/useGameQuery"
import { useAbortController } from "~/hooks/useAbortController"
import { useToastContext } from "~/hooks/useToastContext"
import { getGamesFn } from "~/serverFn/games"
import { createPostFn } from "~/serverFn/posts"
import { getPostSignedUrl } from "~/services/uploadService"
import { uploadToSignedUrl } from "~/utils2/uploadToSignedUrl"

export function useCreatePost() {
    const { addToast } = useToastContext()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const result = useGamesQuery({
        queryKey: ["games"],
        queryFn: () => getGamesFn()
    })
    
    const abortController = useAbortController()

    const createAction = useServerFn(createPostFn)
    const getSignedUrls = useServerFn(getPostSignedUrl)

    const mutation = useMutation(() => ({
        mutationFn: createAction
    }))

    const [input, setInput] = createStore({
        title: "",
        text: "",
        media: [] as string[],
        game: null as { gameId: number, title: string } | null,
        tags: [] as string[],
    })

    let files: { file: File, signedUrl: string, key: string }[] = []
    const [isUploading, setIsUploading] = createSignal(false)
    const [preview, setPreview] = createSignal("")

    const setFiles = (f: typeof files) => (files = f)

    async function handleSubmit(e: SubmitEvent) {
        const { game, ...rest } = input
        e.preventDefault();
        try {
            setIsUploading(true)
            await Promise.all(files.map(file => uploadToSignedUrl(file.signedUrl, file.file, { signal: abortController.signal })))
            setIsUploading(false)
            mutation.mutate({
                data: {
                    ...rest,
                    gameId: input.game?.gameId,
                    media: files.map(f => ({
                        contentType: f.file.type,
                        key: f.key
                    })),
                },
                signal: abortController.signal
            }, {
                onError(error, variables, onMutateResult, context) {
                    addToast({ text: error.message, type: "error" })
                },
                onSuccess(response, variables) {
                    queryClient.invalidateQueries({ queryKey: ["posts"] })
                    navigate({ to: "/posts/$postId", params: { postId: response.postId } })
                },
            })
        }
        catch (error) {
            addToast({ text: "Something went wrong. Please try again later", type: "error" })
        }
    }

    return {
        input,
        setInput,
        handleSubmit,
        isUploading,
        abortController,
        files,
        setPreview,
        mutation,
        getSignedUrls,
        preview,
        result,
        setFiles
    }
}