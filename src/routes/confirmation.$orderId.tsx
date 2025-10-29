import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage'

export const Route = createFileRoute('/confirmation/$orderId')({
  component: OrderConfirmationPage,
})
