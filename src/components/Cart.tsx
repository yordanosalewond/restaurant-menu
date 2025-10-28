import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/hooks/useCartStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
interface CartProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function Cart({ isOpen, onOpenChange }: CartProps) {
  const items = useCartStore((state) => state.items);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-display">Your Cart</SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-[hsl(var(--muted-foreground))]" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-[hsl(var(--muted-foreground)_/_0.5)] mb-4" />
            <p className="text-xl font-semibold">Your cart is empty</p>
            <p className="text-[hsl(var(--muted-foreground))]">Add some delicious items from the menu!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}