import { setResponseStatus } from "@tanstack/solid-start/server";

export class AppError extends Error {
    constructor(
        message: string, 
        private status: number
    ) {
        super(message);
        setResponseStatus(status)
    }
}