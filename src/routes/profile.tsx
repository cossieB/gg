import { createFileRoute, Navigate } from '@tanstack/solid-router'
import { Show, Suspense } from 'solid-js'
import { authClient } from '~/utils/authClient'

export const Route = createFileRoute('/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    const session = authClient.useSession()
    return (
        <Suspense>
            <Show
                when={session().data}
                fallback={<Navigate to='/auth/signup' />}
            >
                {data =>
                    <Show
                        when={data().user.emailVerified}
                        fallback={<div>Please click the link in your email to verify your account</div>}
                    >
                        <ProfilePage user={data().user} />
                    </Show>
                }
            </Show>
        </Suspense>
    )
}

type Props = {
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        username?: string | null | undefined;
        displayUsername?: string | null | undefined;
    };
}

function ProfilePage(props: Props) {
    return (
        <div></div>
    )
}