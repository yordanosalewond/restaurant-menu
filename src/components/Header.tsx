import { Utensils, ShoppingCart, LogOut, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/useCartStore';
import { Cart } from '@/components/Cart';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';
import { toast } from 'sonner';
import { useScrollPosition } from '@/hooks/useScrollPosition';
export function Header() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollPosition = useScrollPosition();
  useEffect(() => {
    setHydrated(true);
  }, []);
  const handleLogout = () => {
    logout();
    toast.info("You have been logged out.");
    navigate('/');
  };
  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-background/80 backdrop-blur-sm",
        scrollPosition > 10 ? "shadow-md" : ""
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="h-7 w-7 text-[hsl(var(--primary))]" />
              <span className="text-xl font-bold font-display tracking-wider">CuisineCanvas</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <nav className="flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">Menu</Link>
                </Button>
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin">
                        <UserCog className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </nav>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {hydrated && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-bold text-[hsl(var(--primary-foreground))]">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <Cart isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}