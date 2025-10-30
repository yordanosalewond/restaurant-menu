import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatedPage } from '@/components/AnimatedPage';

export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-10 h-10 text-yellow-600" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-yellow-600">
                  Payment Cancelled
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  Your payment was cancelled. No charges have been made.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your items are still in your cart. You can try again when you're ready.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button onClick={() => navigate({ to: '/checkout' })} size="lg">
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate({ to: '/' })} 
                    size="lg"
                  >
                    Continue Shopping
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
