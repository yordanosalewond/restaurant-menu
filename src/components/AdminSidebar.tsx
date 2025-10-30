import { LayoutDashboard, UtensilsCrossed, ClipboardList, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeView: 'dashboard' | 'menu' | 'orders';
  onViewChange: (view: 'dashboard' | 'menu' | 'orders') => void;
}

interface NavItem {
  id: 'dashboard' | 'menu' | 'orders';
  label: string;
  icon: LucideIcon;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'View metrics and analytics',
  },
  {
    id: 'menu',
    label: 'Menu Management',
    icon: UtensilsCrossed,
    description: 'Manage menu items',
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: ClipboardList,
    description: 'View and manage orders',
  },
];

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", isActive && "text-primary-foreground")} />
              <div className="flex-1 min-w-0">
                <div className={cn("font-medium", isActive && "text-primary-foreground")}>
                  {item.label}
                </div>
                <div className={cn(
                  "text-xs mt-0.5",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
