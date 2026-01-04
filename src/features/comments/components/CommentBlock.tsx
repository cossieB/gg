import { getRelativeTime } from "~/lib/getRelativeTime";
import { getCommentsByPostId, reactToComment } from "~/serverFn/comments";
import { STORAGE_DOMAIN } from "~/utils/env";
import styles from "./Comments.module.css"
import { MessageCircleIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-solid";
import { useServerFn } from "@tanstack/solid-start";
import { useQueryClient, useMutation } from "@tanstack/solid-query";
import { authClient } from "~/auth/authClient";
import { useToastContext } from "~/hooks/useToastContext";
import { modifyCommentCache } from "../utils/modifyCommentCache";

export function CommentBlock(props: { comment: Awaited<ReturnType<typeof getCommentsByPostId>>[number], postId: number }) {
    const react = useServerFn(reactToComment);
    const { addToast } = useToastContext()
    const queryClient = useQueryClient()
    const mutation = useMutation(() => ({
        mutationFn: react,
    }))
    const session = authClient.useSession()
    function fn(reaction: "like" | "dislike") {
        return function () {
            if (!session().data) return addToast({ text: "Please login first", type: "warning" })
            if (!session().data?.user.emailVerified) return addToast({ text: "Please verify your account", type: "warning" })
            mutation.mutate({
                data: {
                    commentId: props.comment.commentId,
                    reaction
                }
            }, {
                onSuccess(data, variables, onMutateResult, context) {
                    modifyCommentCache(queryClient, props.postId, props.comment.commentId, reaction)
                },
                onError(error, variables, onMutateResult, context) {
                    addToast({ text: error.message, type: "error" })
                },
            })
        }
    }

    return (
        <div class={styles.comment}>
            <div class={styles.user}>
                <img
                    src={STORAGE_DOMAIN + props.comment.user.image}
                    alt={`Avatar of ${props.comment.user.username}`}
                />
                <span>{props.comment.user.username}</span>
                <span class={styles.createdAt}>{getRelativeTime(props.comment.createdAt)}</span>
            </div>
            <div class={styles.text}> {props.comment.text} </div>
            <div class={styles.buttons}>
                <div>
                    <button><MessageCircleIcon /></button>
                    {props.comment.replies}
                </div>
                <div class={styles.react} >
                    <button onclick={fn('like')}
                        classList={{ [styles.liked]: props.comment.yourReaction === "like" }}
                    >
                        <ThumbsUpIcon />
                    </button>
                    <button
                        onclick={fn('dislike')}
                        classList={{ [styles.disliked]: props.comment.yourReaction === "dislike" }}
                    >
                        <ThumbsDownIcon />
                    </button>
                    {props.comment.reactions.likes - props.comment.reactions.dislikes}
                </div>
            </div>
        </div>
    )
}