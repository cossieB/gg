import { createServerFn } from "@tanstack/solid-start"
import { ConsoleService } from "./ConsoleService"
import { EmailService } from "./emailService.interface"
import { NodemailService } from "./NodeMailerService"
import assert from "node:assert"

export const emailService = (function (): EmailService {
    if (process.env.NODE_ENV == 'production')
        return new NodemailService()
    else
        return new ConsoleService()
})()

export const getLatestVerificationLink = createServerFn()
    .handler(() => {
        assert(emailService instanceof ConsoleService)
        return emailService.getLatestVerificationLink()
    })
