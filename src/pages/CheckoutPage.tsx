import { useCartStore } from "@/hooks/useCartStore";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerInfoSchema, type CustomerInfo } from "@shared/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api-client";
import type { Order } from "@shared/types";
import { toast } from "sonner";
import { useEffect, useState, useMemo, useCallback } from "react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Trash2, Plus, Minus } from "lucide-react";
export function CheckoutPage() {
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const { totalPrice, totalItems } = useMemo(() => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return { totalPrice, totalItems };
  }, [items]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate({ to: '/' });
    }
  }, [items, navigate, isSubmitting]);
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const onSubmit = useCallback(async (values: CustomerInfo) => {
    setIsSubmitting(true);
    
    try {
      // Initiate payment with ArifPay
      const paymentData = {
        phone: values.phone,
        email: values.email,
        nonce: crypto.randomUUID(), // Unique transaction ID
        paymentMethods: ["TELEBIRR"],
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        lang: "EN",
      };

      const paymentResponse = await api<{ checkoutId: string; checkoutUrl: string }>('/api/payments/checkout', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });

      // Create order in database
      const orderData = {
        items: items,
        total: totalPrice,
        customer: values,
      };

      const createdOrder = await api<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      // Store order ID for later reference
      sessionStorage.setItem('pendingOrderId', createdOrder.id);
      
      toast.success("Redirecting to payment...");
      
      // Redirect to ArifPay payment page
      window.location.href = paymentResponse.checkoutUrl;
      
    } catch (error) {
      toast.error("Failed to initiate payment. Please try again.");
      console.error(error);
      setIsSubmitting(false);
    }
  }, [items, totalPrice]);
  if (items.length === 0) {
    return null; // Render nothing while redirecting
  }
  return (
    <AppLayout>
      <AnimatedPage>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Checkout</h1>
              <p className="mt-4 text-lg text-muted-foreground">Complete your order by providing your details below.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Customer Information Form */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold font-display">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? 'Placing Order...' : `Place Order - Br${totalPrice.toFixed(2)}`}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              {/* Order Summary */}
              <div className="lg:col-span-2 lg:sticky lg:top-24">
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold font-display">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64 pr-4 -mr-4">
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="space-y-2 pb-4 border-b last:border-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Br{item.price.toFixed(2)} each</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">Br{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  removeItem(item.id);
                                  toast.success(`${item.name} removed from cart`);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 pt-4">
                    <Separator />
                    <div className="w-full flex justify-between text-lg font-bold">
                      <span>Total ({totalItems} items)</span>
                      <span>Br{totalPrice.toFixed(2)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}