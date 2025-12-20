import { createFileRoute } from '@tanstack/solid-router'
import { createStore } from 'solid-js/store'
import { Form } from '~/components/Forms/Form'
import { FormProvider } from '~/components/Forms/FormContext'
import { authClient } from '~/utils/authClient'

export const Route = createFileRoute('/auth/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    const [input, setInput] = createStore({
        username: "",
        password: ""
    })

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        const { data, error } = await authClient.signIn.username({
            username: input.username,
            password: input.password
        })

        console.log(data, error)
    }

    return (
        <div class='page flexCenter'>
            <FormProvider>
                <Form disabled={!input.username || !input.password} onSubmit={handleSubmit}>
                    <Form.Input<typeof input>
                        field="username"
                        setter={val => setInput('username', val)}
                        value={input.username}
                        type="text"
                    />
                    <Form.Input<typeof input>
                        field="password"
                        setter={val => setInput('password', val)}
                        value={input.password}
                        type="password"
                    />
                </Form>
            </FormProvider>
        </div>
    )
}
