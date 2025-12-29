import { db } from "~/drizzle/db";
import { posts, postTags } from "~/drizzle/schema";

type PostInsert = {
    title: string;
    userId: string;
    gameId?: number;
    media: string[];
    text: string;
    tags: string[]
};

export function createPost(obj: PostInsert) {
    return db.transaction(async tx => {
        const insert = await tx.insert(posts).values(obj).returning({postId: posts.postId})
        const postId = insert[0].postId
        if (obj.tags.length > 0)
            await tx.insert(postTags).values(obj.tags.map(tag => ({postId, tag})))
        return postId
    })
}

export function findAll() {
    return db.select({

    })
    .from(posts)
}