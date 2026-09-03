import { RedisService } from "./RedisService.server";
import '@tanstack/solid-start/server-only'

export const cacheService = new RedisService()