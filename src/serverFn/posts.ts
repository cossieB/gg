import { createServerFn } from "@tanstack/solid-start";
import z from "zod";
import { verifiedOnlyMiddleware } from "~/middleware/authorization";
import * as postRepository from "~/repositories/postRepository"

export const createPostFn = createServerFn({method: "POST"})
    .middleware([verifiedOnlyMiddleware])
    .inputValidator(z.object({
        title: z.string().min(3).max(30),
        text: z.string().max(255),
        media: z.string().array(),
        tags: z.string().toLowerCase().array(),
        gameId: z.number().optional()
    }))
    .handler(async ({data, context: {user}}) => {
        if (data.text.length + data.media.length === 0) throw Response.json({error: "Empty post"})

        const postId = await postRepository.createPost({...data, userId: user.id})
        return postId
    })