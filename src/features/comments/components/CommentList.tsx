import { useQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";
import { getCommentsByPostId } from "~/serverFn/comments";
import { CommentBlock } from "./CommentBlock";

export function CommentList(props: { postId: number }) {
    const result = useQuery(() => ({
        queryKey: ["comments", "byPost", props.postId],
        queryFn: () => getCommentsByPostId({ data: props.postId })
    }))
    return (
        <Suspense>
            <div>
                <For each={result.data!}>
                    {comment => <CommentBlock comment={comment} postId={props.postId} />}
                </For>
            </div>
        </Suspense>
    )
}

