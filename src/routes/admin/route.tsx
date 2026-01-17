import { createFileRoute, Outlet, redirect } from '@tanstack/solid-router'
import { AdminLayout } from '~/components/AdminLayout/AdminLayout'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({context: {user}}) => {
    if (!user || user.role != "admin") throw redirect({to: "/"})
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
