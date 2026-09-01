import { createServerFn } from "@tanstack/solid-start";
import { authedMiddleware } from "~/middleware/authorization";
import * as notificationsRepository from "~/repositories/notificationsRepository"

export const getNotifications = createServerFn()
    .middleware([authedMiddleware])
    .handler(async({context}) => {
        return notificationsRepository.getNotifications({userId: context.user.id})
    })