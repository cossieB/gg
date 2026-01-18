import { notFound } from "@tanstack/solid-router"
import { createServerFn } from "@tanstack/solid-start"
import z from "zod"
import { adminOnlyMiddleware } from "~/middleware/authorization"
import { staticDataMiddleware } from "~/middleware/static"
import * as platformRepository from "~/repositories/platformRepository"

export const getPlatformsFn = createServerFn()
    .middleware([staticDataMiddleware])
    .handler(() => platformRepository.findAll())

export const getPlatformFn = createServerFn()
    .middleware([staticDataMiddleware])
    .inputValidator((id: number) => {
        if (Number.isNaN(id) || id < 1) throw notFound()
        return id
    })
    .handler(async ({ data }) => {
        const dev = await platformRepository.findById(data)
        if (!dev) throw notFound()
        return dev
    })

const platformCreateSchema = z.object({
    name: z.string(),
    logo: z.string(),
    releaseDate: z.string(),
    summary: z.string().optional()
})

const platformEditSchema = platformCreateSchema.partial().extend({platformId: z.number()})

export const createPlatformFn = createServerFn({method: "POST"})    
    .middleware([adminOnlyMiddleware])
    .inputValidator(platformCreateSchema)
    .handler(async ({data}) => {
        return (await platformRepository.createPlatform(data))[0]
    })

export const editPlatformFn = createServerFn({method: "POST"})    
    .middleware([adminOnlyMiddleware])
    .inputValidator(platformEditSchema)
    .handler(async ({data}) => {
        const {platformId, ...rest} = data
        return await platformRepository.editPlatform(platformId, rest)
    })