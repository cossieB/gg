import { createFileRoute } from "@tanstack/solid-router"
import assert from "node:assert"
import { emailService } from "~/integrations/emailService"
import { ConsoleService } from "~/integrations/emailService/ConsoleService"

export const Route = createFileRoute('/api/testing/verification-token')({
    server: {
        handlers: {
            GET: async () => { 
                assert(emailService instanceof ConsoleService)
                return new Response(emailService.getLatestVerificationLink())
            }
        }
    }
})