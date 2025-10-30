import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatedPage } from '@/components/AnimatedPage';
import { useCartStore } from '@/hooks/useCartStore';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    
    // Get order ID from session storage
    const orderId = sessionStorage.getItem('pendingOrderId');
    if (orderId) {
      sessionStorage.removeItem('pendingOrderId');
    }
  }, [clearCart]);

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-green-600">
                  Payment Successful!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  Your payment has been processed successfully. Thank you for your order!
                </p>
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation email shortly with your order details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button onClick={() => navigate({ to: '/' })} size="lg">
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate({ to: '/admin' })} 
                    size="lg"
                  >
                    View Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
