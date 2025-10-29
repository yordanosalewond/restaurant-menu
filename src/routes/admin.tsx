import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminPage } from '@/pages/AdminPage'
import { useAuthStore } from '@/hooks/useAuthStore'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: AdminPage,
})
