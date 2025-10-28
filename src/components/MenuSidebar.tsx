import { cn } from '@/lib/utils';
import type { Category } from '@shared/types';
interface MenuSidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (category: string) => void;
}
export function MenuSidebar({ categories, activeCategory, onSelectCategory }: MenuSidebarProps) {
  return (
    <aside className="sticky top-24 h-fit hidden lg:block w-64 pr-8">
      <h2 className="text-lg font-semibold mb-4 font-display">Categories</h2>
      <nav>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <a
                href={`#${category.replace(/\s+/g, '-')}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(category);
                }}
                className={cn(
                  "block w-full text-left px-4 py-2 rounded-md transition-colors text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                  activeCategory === category && "bg-[hsl(var(--primary)_/_0.1)] text-[hsl(var(--primary))] font-semibold"
                )}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}