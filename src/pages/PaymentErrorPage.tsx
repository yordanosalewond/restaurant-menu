import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatedPage } from '@/components/AnimatedPage';

export function PaymentErrorPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <CardTitle className="text-3xl font-display font-bold text-red-600">
                  Payment Failed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  We encountered an error processing your payment.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your payment details and try again. If the problem persists, contact support.
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
                    Back to Home
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
