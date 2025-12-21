import { createStore } from "solid-js/store";
import { getProfileFn } from "~/services/authService";
import { Form } from "../Forms/Form";
import { FormProvider } from "../Forms/FormContext";
import styles from "./ProfilePage.module.css"
import { ConfirmPopover } from "../Popover/Popover";
import { authClient } from "~/utils/authClient";
import { useToastContext } from "~/hooks/useToastContext";
import { useNavigate } from "@tanstack/solid-router";
import { UploadBox } from "../UploadBox/UploadBox";

export function Profile(props: { user: Awaited<ReturnType<typeof getProfileFn>> }) {
    const { addToast } = useToastContext()
    const navigate = useNavigate()
    async function logout() {
        try {
            await authClient.signOut();
            navigate({ to: "/" })
        }
        catch (error) {
            console.error(error)
            addToast({
                text: "Could not log you out. Please try again later.",
                type: "error"
            })
        }
    }
    const [user, setUser] = createStore(props.user)

    return (
        <div class={`${styles.profile} flexCenter`}>
            <FormProvider>
                <Form onSubmit={async () => { }} disabled>
                    <Form.Input<typeof user>
                        field="name"
                        label='Display Name'
                        setter={val => setUser({ name: val })}
                        value={user.name}
                    />

                    <div class={styles.images}>
                        <UploadBox
                            label="Avatar"
                            onSuccess={src => setUser({ image: src })}
                            maxSize={1}
                        />
                        <UploadBox
                            label="Banner"
                            onSuccess={src => setUser({ banner: src })}
                            maxSize={1}
                        />
                        <div class={styles.preview}>
                            <div><img src={user.image ?? ""} /></div>
                            <div><img src={user.banner ?? ""} /></div>
                        </div>
                    </div>
                    <Form.Textarea<typeof user>
                        field="bio"
                        label='Bio'
                        setter={val => setUser({ bio: val })}
                        value={user.bio}
                        maxLength={255}
                    />
                    <Form.Input<typeof user>
                        field="location"
                        setter={val => setUser({ location: val })}
                        value={user.location ?? ""}
                    />
                </Form>
            </FormProvider>
            <button popoverTarget="autoPopover" data-func="logout">
                Logout
            </button>

            <ConfirmPopover
                text="Are you sure you want to logout?"
                onConfirm={logout}
            />
        </div>
    )
}