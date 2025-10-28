import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}
export function CategoryFilters({ categories, selectedCategory, onSelectCategory }: CategoryFiltersProps) {
  const allCategories = ['All', ...categories];
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {allCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "rounded-full transition-all duration-200",
            selectedCategory === category ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-transparent"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}