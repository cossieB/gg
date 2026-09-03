import { RedisNotificationService } from "./RedisNotificationService.server";
import '@tanstack/solid-start/server-only'

export const notificationsService = new RedisNotificationService()