import { useQuery } from "@tanstack/solid-query";
import { authClient } from "~/auth/authClient";
import { getNotifications } from "~/serverFn/notifications";

export function useNotifications() {
    const session = authClient.useSession()

    const notifications = useQuery(() => ({
        queryKey: ["notifications"],
        queryFn: () => getNotifications(),
        enabled: !!session().data?.user.id,
        initialData: [],
        staleTime: 0,
    }))

    return notifications
}