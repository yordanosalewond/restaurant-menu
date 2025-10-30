import { createFileRoute } from '@tanstack/react-router';
import { PaymentErrorPage } from '@/pages/PaymentErrorPage';

export const Route = createFileRoute('/payment/error')({
  component: PaymentErrorPage,
});
