import { createFileRoute } from '@tanstack/solid-router'
import { notificationsService } from '~/integrations/notificationService'
import { getCurrentUser } from '~/serverFn/auth'

export const Route = createFileRoute('/api/notifications')({
    server: {
        handlers: {
            GET: async () => {
                const user = await getCurrentUser();
                if (!user) return new Response(null, { status: 401 });
                const encoder = new TextEncoder()
                let intervalId: NodeJS.Timeout
                const stream = new ReadableStream({
                    async start(controller) {
                        controller.enqueue(encoder.encode(":\n\n"))
                        intervalId = setInterval(() => {
                            controller.enqueue(encoder.encode(":\n\n"))
                        }, 30000)
                        notificationsService.subscribe(user.id, () => {
                            controller.enqueue(encoder.encode("data: newNotification\n\n"))
                        })                        
                    },
                    async cancel() {
                        clearInterval(intervalId);
                        notificationsService.unsubscribe(user.id)
                    }
                })

                return new Response(stream, {
                    headers: {
                        "Content-Type": "text/event-stream; charset=utf-8",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    },
                })
            }
        }
    }
})