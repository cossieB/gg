import { BellIcon } from "lucide-solid"
import { Show } from "solid-js"
import { useNotifications } from "~/features/notifications/hooks/useNotificationContext"
import { NavItem } from "./NavItem"
import styles from "./MainLayout.module.css"

export function NavNotifications() {
    const notifications = useNotifications()
    const stream = new EventSource("/api/notifications")
        
    stream.onmessage = (event: MessageEvent) => {
        notifications.refetch()
    }
    return (
        <div class={styles.notifs}>
            <NavItem
                to="/notifications"
                icon={<BellIcon />}
                label="Notifications"
            />
            <Show when={notifications.data?.length > 0}>
                <span class={styles.notifNum}>
                    {Math.min(notifications.data?.length, 9)}
                    {notifications.data?.length > 10 && "+"}
                </span>
            </Show>
        </div>
    )
}