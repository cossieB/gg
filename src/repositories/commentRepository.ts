import { InferInsertModel } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { comments } from "~/drizzle/schema";

export function findCommentsByPostId(postId: number) {
    return db.query.comments.findMany({
        where: {
            postId
        }
    })
}

export function addComment(comment: InferInsertModel<typeof comments>) {
    return db.insert(comments).values(comment)
}