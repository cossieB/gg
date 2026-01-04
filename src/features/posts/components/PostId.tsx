import { PostBlock } from "./PostBlock";
import { type getAllPostsFn } from "~/serverFn/posts";
import { createSignal, Show } from "solid-js";
import { StandaloneTextarea } from "~/components/Forms/FormTextarea";
import { SubmitBtn } from "~/components/Forms/SubmitBtn";
import { useServerFn } from "@tanstack/solid-start";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { addComment } from "~/serverFn/comments";
import { authClient } from "~/auth/authClient";
import styles from "./PostId.module.css"
import { CommentList } from "~/features/comments/components/CommentList";

type Props = {
    post: Awaited<ReturnType<typeof getAllPostsFn>>[number]
}

export function PostId(props: Props) {
    const commentOnPost = useServerFn(addComment);
    const queryClient = useQueryClient()
    const [comment, setComment] = createSignal("")
    const session = authClient.useSession()
    const mutation = useMutation(() => ({
        mutationFn: commentOnPost,
        onSuccess(data, variables, onMutateResult, context) {
            setComment("")
            queryClient.invalidateQueries({
                queryKey: ["comments", "byPost", props.post.postId]
            })
        },
        onError(error, variables, onMutateResult, context) {

        },
    }))

    return (
        <div class={styles.container}>
            <PostBlock post={props.post!} />
            <div class={styles.commentArea} classList={{[styles.nonEmpty]: comment().length > 0}}>
                <Show when={session().data?.user.emailVerified}>
                <StandaloneTextarea
                    label="Add your comment..."
                    setter={val => setComment(val)}
                    value={comment()}
                    maxLength={255}
                    id={styles.cmt}
                />
                <div class={styles.btns}>
                    <SubmitBtn
                        disabled={comment().length === 0}
                        isPending={mutation.isPending}
                        onclick={() => {
                            mutation.mutate({
                                data: {
                                    postId: props.post.postId,
                                    text: comment(),
                                }
                            })
                        }}
                    />
                    <button onclick={() => setComment("")}>
                        Cancel
                    </button>
                </div>
                </Show>
            </div>
            <CommentList postId={props.post.postId} />
        </div>
    )
}