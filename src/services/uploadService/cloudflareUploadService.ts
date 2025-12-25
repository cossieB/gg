import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createServerFn } from "@tanstack/solid-start";
import z from "zod";
import { adminOnlyMiddleware } from "~/middleware/authorization";
import { join } from "node:path/posix";

const S3 = new S3Client({
    region: "auto", // Required by SDK but not used by R2
    // Provide your Cloudflare account ID
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
});

export function uploadFromServer(file: File, ...pathSegments: string[]) {
    const ext = file.name.slice(file.name.lastIndexOf("."))
    const filename = join(...pathSegments, crypto.randomUUID())
    const upload = new Upload({
        client: S3,
        params: {
            Bucket: "clipz",
            Key: filename + ext,
            Body: file,
            ContentType: file.type
        }
    })
    return upload.done()
}

export const generateSignedUrl = createServerFn()
    .inputValidator(z.object({
        filename: z.string(),
        contentType: z.string(),
        pathSegments: z.string().array().min(1)
    }))
    .middleware([
        adminOnlyMiddleware
    ])
    .handler(async ({ data }) => {
        const { filename, contentType, pathSegments } = data;
        const prefix = join(...pathSegments)
        const ext = filename.slice(filename.lastIndexOf("."))
        const signedUrl = getSignedUrl(
            S3,
            new PutObjectCommand({
                Bucket: "clipz",
                Key: prefix + crypto.randomUUID() + ext,
                ContentType: contentType,
            }), {
            expiresIn: 600,
        })
        return {signedUrl}
    })