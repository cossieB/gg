import { createServerFn } from "@tanstack/solid-start";
import z from "zod";
import { verifiedOnlyMiddleware } from "~/middleware/authorization";
import * as commentsRepository from "~/repositories/commentRepository"

export const addComment = createServerFn({method: "POST"})
    .middleware([verifiedOnlyMiddleware])
    .inputValidator(z.object({
        text: z.string(),
        postId: z.number(),
        replyTo: z.number().nullish()
    }))
    .handler(async ({data, context: {user}}) => {
        const p = await commentsRepository.addComment({...data, userId: user.id})
    })