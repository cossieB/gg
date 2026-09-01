import { useNotifications } from "~/features/notifications/hooks/useNotificationContext";
import { For, Show } from "solid-js";
import { AtSignIcon, MessageCircleIcon, SettingsIcon, ThumbsUpIcon, UserPlusIcon } from "lucide-solid";
import { Dynamic } from "solid-js/web";
import { getRelativeTime } from "~/lib/getRelativeTime";
import styles from "./Notifications.module.css"
import { Link } from "@tanstack/solid-router";
import { Notification } from "~/drizzle/models";
import { authClient } from "~/auth/authClient";

export function NotificationsList() {
    const session = authClient.useSession()
    const notifications = useNotifications()

    return (
        <div class={styles.notifList}>
            <For each={notifications.data}>
                {notification => <Notif notification={notification} />}
            </For>
        </div>
    )
}

const icons = {
    LIKE: ThumbsUpIcon,
    REPLY: MessageCircleIcon,
    MENTION: AtSignIcon,
    FOLLOW: UserPlusIcon,
    SYSTEM: SettingsIcon
}

function Notif(props: { notification: Notification }) {
    return (
        <div class={styles.notification}>
            <Dynamic component={icons[props.notification.type ?? "MENTION"]} />
            <div>
                {props.notification.message}
            </div>
            <span>
                {getRelativeTime(props.notification.createdAt)}
            </span>
            <Show when={props.notification.actionUrl}>
                <Link to={props.notification.actionUrl!} />
            </Show>
        </div>
    )
}