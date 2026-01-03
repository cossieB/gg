import { PostBlock } from "./PostBlock";
import { type getAllPostsFn } from "~/serverFn/posts";
import { createSignal } from "solid-js";
import styles from "./PostId.module.css"
import { StandaloneTextarea } from "~/components/Forms/FormTextarea";
import { SubmitBtn } from "~/components/Forms/SubmitBtn";
import { useServerFn } from "@tanstack/solid-start";
import { useMutation } from "@tanstack/solid-query";
import { addComment } from "~/serverFn/comments";

type Props = {
    post: Awaited<ReturnType<typeof getAllPostsFn>>[number]
}

export function PostId(props: Props) {
    const commentOnPost = useServerFn(addComment);
    const [comment, setComment] = createSignal("")

    const mutation = useMutation(() => ({
        mutationFn: commentOnPost,
        onSuccess(data, variables, onMutateResult, context) {
            setComment("")
        },
        onError(error, variables, onMutateResult, context) {
            
        },
    }))

    return (
        <div class={styles.container}>
            <PostBlock post={props.post!} />
            <div class={styles.commentArea}>
                <StandaloneTextarea
                    label="Add your comment..."
                    setter={val => setComment(val)}
                    value={comment()}
                    maxLength={255}
                />
                <SubmitBtn
                    disabled={comment().length === 0}
                    isPending={mutation.isPending}
                    onclick={() => {
                        mutation.mutate({data: {
                            postId: props.post.postId,
                            text: comment(),
                        }})
                    }}
                />
            </div>
        </div>
    )
}