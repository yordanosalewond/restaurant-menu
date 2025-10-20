import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { MenuItem } from "@shared/types";
import { useCartStore } from "@/hooks/useCartStore";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
interface MenuItemCardProps {
  item: MenuItem;
}
export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };
  return (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col">
          <CardTitle className="text-xl font-semibold mb-2">{item.name}</CardTitle>
          <p className="text-muted-foreground text-sm flex-1">{item.description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <p className="text-lg font-bold text-foreground">
            ${item.price.toFixed(2)}
          </p>
          <Button onClick={handleAddToCart}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}