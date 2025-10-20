import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@shared/types";
import { useCartStore } from "@/hooks/useCartStore";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden h-full flex flex-col group">
        <div className="relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle className="font-display text-xl">{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4">
          <p className="text-xl font-bold text-foreground">
            ${item.price.toFixed(2)}
          </p>
          <Button onClick={handleAddToCart} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}