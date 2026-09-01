import { BellIcon } from "lucide-solid"
import { createMemo, Show } from "solid-js"
import { useNotifications } from "~/features/notifications/hooks/useNotificationContext"
import { NavItem } from "./NavItem"
import styles from "./MainLayout.module.css"

export function NavNotifications() {
    const {notifications} = useNotifications()
    const stream = new EventSource("/api/notifications")
        
    stream.onmessage = (event: MessageEvent) => {
        notifications.refetch()
    }
    const numUnread = createMemo(() => (notifications.data ?? []).filter(n => !n.readAt).length)

    return (
        <div class={styles.notifs}>
            <NavItem
                to="/notifications"
                icon={<BellIcon />}
                label="Notifications"
            />
            <Show when={numUnread() > 0}>
                <span class={styles.notifNum}>
                    {Math.min(numUnread(), 99)}                    
                </span>
            </Show>
        </div>
    )
}