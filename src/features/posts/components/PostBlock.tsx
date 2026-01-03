import { getPostFn, reactToPost } from '~/serverFn/posts'
import styles from "./Post.module.css"
import { For, Show } from 'solid-js'
import { MessageCircleIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-solid'
import { getRelativeTime } from '~/lib/getRelativeTime'
import { formatDate } from '~/lib/formatDate'
import { Link } from '@tanstack/solid-router'
import { useServerFn } from '@tanstack/solid-start'
import { useMutation, useQueryClient } from '@tanstack/solid-query'
import { Carousel } from '~/components/Carousel/Carousel'
import { modifyCache } from '../utils/modifyCache'
import { STORAGE_DOMAIN } from '~/utils/env'
import { useToastContext } from '~/hooks/useToastContext'
import { authClient } from '~/auth/authClient'

type Props = {
    post: Awaited<ReturnType<typeof getPostFn>>
}

export function PostBlock(props: Props) {
    const react = useServerFn(reactToPost);
    const {addToast} = useToastContext()
    const queryClient = useQueryClient()
    const mutation = useMutation(() => ({
        mutationFn: react,
    }))
    const session = authClient.useSession()

    function fn(reaction: "like" | "dislike") {
        return function () {
            if (!session().data) return addToast({text: "Please login first", type: "warning"})
            if (!session().data?.user.emailVerified) return addToast({text: "Please verify your account", type: "warning"})
            mutation.mutate({
                data: {
                    postId: props.post.postId,
                    reaction
                }
            }, {
                onSuccess(data, variables, onMutateResult, context) {
                    modifyCache(queryClient, props.post.postId, reaction)
                },
                onError(error, variables, onMutateResult, context) {
                    addToast({text: error.message, type: "error"})
                },
            })
        }
    }

    return (
        <div class={styles.container}>
            <div class={styles.user}>
                <div>
                <img src={STORAGE_DOMAIN + props.post.user.image} />
                {props.post.user.displayUsername}
                <Link to='/users/$username' params={{username: props.post.user.username!}} />
                </div>
            </div>

            <div class={styles.content}>
                <div class={styles.header}>
                    <h2> {props.post.title} </h2>
                    <span title={formatDate(props.post.createdAt)}>
                        {getRelativeTime(props.post.createdAt)}
                    </span>
                </div>
                <Show when={props.post.media.length > 0}>
                    <Carousel
                        media={props.post.media.map(m => ({
                            contentType: m.contentType,
                            url: STORAGE_DOMAIN + m.key
                        }))}
                        showNextBtn
                        showPrevBtn
                    />
                </Show>
                <div class={styles.main} innerHTML={props.post.text} />
                <Show when={props.post.tags.length > 0}>
                    <div class={styles.tags} >
                        <For each={props.post.tags}>
                            {tag =>
                                <div class="cutout">
                                    {tag}
                                    <Link to='/posts/tags/$tag' params={{ tag }} />
                                </div>}
                        </For>
                    </div>
                </Show>
                <div class={styles.buttons}>
                    <div>
                        <button><MessageCircleIcon /></button>
                        {props.post.comments}
                    </div>
                    <div class={styles.react} >
                        <button onclick={fn('like')}
                            classList={{ [styles.liked]: props.post.yourReaction === "like" }}
                        >
                            <ThumbsUpIcon />
                        </button>
                        <button
                            onclick={fn('dislike')}
                            classList={{ [styles.disliked]: props.post.yourReaction === "dislike" }}
                        >
                            <ThumbsDownIcon />
                        </button>
                        {props.post.reactions.likes - props.post.reactions.dislikes}
                    </div>
                </div>
                <Link class={styles.a} to='/posts/$postId' params={{ postId: props.post.postId }} />
            </div>
        </div>
    )
}