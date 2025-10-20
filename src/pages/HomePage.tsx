import { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from '@/components/MenuItemCard';
import { api } from '@/lib/api-client';
import type { MenuItem, Category } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
const categories: Category[] = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
export function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  useEffect(() => {
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
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);
  return (
    <AppLayout>
      <AnimatedPage>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center p-4 animate-fade-in">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight"
            >
              Experience Culinary Excellence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-pretty"
            >
              Discover a world of flavor crafted with passion and the finest ingredients. Your next favorite dish awaits.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button size="lg" className="mt-8 btn-gradient" asChild>
                <a href="#menu">View Our Menu</a>
              </Button>
            </motion.div>
          </div>
        </section>
        {/* Menu Section */}
        <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold">Our Menu</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                A curated selection of dishes to delight your senses.
              </p>
            </div>
            {/* Category Filters */}
            <div className="flex justify-center flex-wrap gap-2 mt-12">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            {/* Menu Grid */}
            <div className="mt-12">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-[225px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16 text-red-500">
                  <p>Error loading menu: {error}</p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredItems.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </AnimatedPage>
    </AppLayout>
  );
}