import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Order } from '@shared/types';
import { CheckCircle2 } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const fetchedOrder = await api<Order>(`/api/orders/${orderId}`);
        setOrder(fetchedOrder);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-3xl font-display font-bold">Thank You For Your Order!</CardTitle>
                <p className="text-muted-foreground">Your order has been placed successfully.</p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Separator className="my-6" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-2/3" />
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500">
                    <p>Error: {error}</p>
                  </div>
                ) : order ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono text-lg">{order.id}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Items Ordered</h3>
                      <ul className="space-y-2">
                        {order.items.map(item => (
                          <li key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="text-center bg-muted/50 p-4 rounded-md">
                      <p className="font-semibold">Estimated Preparation Time</p>
                      <p className="text-2xl font-bold text-primary">20-30 Minutes</p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link to="/">Back to Menu</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}