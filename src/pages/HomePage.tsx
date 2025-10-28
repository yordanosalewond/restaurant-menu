import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MenuItemCard } from '@/components/MenuItemCard';
import { api } from '@/lib/api-client';
import type { MenuItem } from '@shared/types';
import { CATEGORIES } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { CategoryFilters } from '@/components/CategoryFilters';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const items = await api<MenuItem[]>('/api/menu');
        setMenuItems(items);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);
  const filteredMenuItems = React.useMemo(() => {
    if (selectedCategory === 'All') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);
  const uniqueCategories = React.useMemo(() => {
    return CATEGORIES.filter(cat => menuItems.some(item => item.category === cat));
  }, [menuItems]);
  return (
    <AppLayout>
      <AnimatedPage>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold animate-fade-in">Welcome to CuisineCanvas</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl animate-slide-up">
              Experience the art of flavor. Fresh ingredients, expertly crafted dishes, delivered to you.
            </p>
            <Button size="lg" className="mt-8 animate-scale-in" asChild>
              <a href="#menu">View Our Menu</a>
            </Button>
          </div>
        </section>
        {/* Menu Section */}
        <section id="menu" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Our Menu</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Explore our wide range of dishes, from classic favorites to new culinary creations.
              </p>
            </div>
            {!isLoading && !error && (
              <div className="mb-12">
                <CategoryFilters
                  categories={uniqueCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            )}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-[hsl(var(--destructive))]">
                <p>Error loading menu: {error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMenuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      </AnimatedPage>
    </AppLayout>
  );
}