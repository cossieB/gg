import { useMutation, useQueryClient } from "@tanstack/solid-query"
import { useServerFn } from "@tanstack/solid-start"
import { createStore } from "solid-js/store"
import { useToastContext } from "~/hooks/useToastContext"
import { useUpload } from "~/hooks/useUpload"
import { createActorFn, editActorFn, getActorFn } from "~/serverFn/actors"
import { actorQueryOpts } from "../utils/actorQueryOpts"
import { Form } from "~/components/Forms/Form"
import { UploadBox } from "~/components/UploadBox/UploadBox"
import { mediaSrc } from "~/utils/mediaSrc"
import { ContentEditable } from "~/components/Forms/ContentEditable"
import styles from "~/styles/F.module.css"

type Actor = Awaited<ReturnType<typeof getActorFn>>

export function ActorForm(props: { actor?: Actor }) {
    const { addToast } = useToastContext()
    const queryClient = useQueryClient()
    const createActorMutation = useMutation(() => ({
        mutationFn: useServerFn(createActorFn)
    }))
    const editActorMutation = useMutation(() => ({
        mutationFn: useServerFn(editActorFn)
    }))
    const [actor, setActor] = createStore(props.actor ?? {
        name: "",
        bio: "",
        photo: ""
    })
    const { isUploading, setFiles, upload } = useUpload(["people"])

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        const files = await upload()
        const f = files.at(0)
        if (f) setActor({ photo: f.key })
        if ('actorId' in actor) {
            return editActorMutation.mutate({ data: actor }, {
                onSuccess(data, variables, onMutateResult, context) {
                    addToast({ text: "Successfully edited actor, " + actor.actorId, type: "info" })
                    queryClient.setQueryData(actorQueryOpts(actor.actorId).queryKey, actor)
                },
                onError(error, variables, onMutateResult, context) {
                    addToast({ text: "Failed", type: "error" })
                },
            })
        }
        createActorMutation.mutate({ data: actor }, {
            onSuccess(data, variables, onMutateResult, context) {
                addToast({ text: "Successfully created actor, " + data.actorId, type: "info" })
                queryClient.setQueryData(actorQueryOpts(data.actorId).queryKey, data)
            },
            onError(error, variables, onMutateResult, context) {
                addToast({ text: "Failed", type: "error" })
            },
        })
    }


    return (
        <div class={styles.container}>
            <Form
                isPending={isUploading() || createActorMutation.isPending || editActorMutation.isPending}
                disabled={
                    !actor.name
                }
                onSubmit={handleSubmit}
            >
                <Form.Input<typeof actor>
                    field="name"
                    setter={name => setActor({ name })}
                    value={actor.name}
                />
                <div class={styles.upload}>
                    <UploadBox
                        accept={{
                            image: true,
                            video: false,
                            audio: false
                        }}
                        label="photo"
                        limit={1}
                        maxSize={5}
                        onSuccess={data => {
                            const a = data[0]
                            setActor({ photo: a.objectUrl })
                            setFiles([{ ...a, field: "photo" }])
                        }}
                    />
                    <div class={styles.preview}>
                        <img src={mediaSrc(actor.photo ?? "")} />
                    </div>
                </div>

                <ContentEditable
                    html={actor.bio}
                    setter={bio => setActor({ bio })}
                />
            </Form>
        </div>
    )
}