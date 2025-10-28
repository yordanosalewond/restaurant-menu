import { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from '@/lib/api-client';
import type { MenuItem, Order, Category } from '@shared/types';
import { CATEGORIES } from '@shared/types';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { MenuItemForm } from '@/components/MenuItemForm';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from 'zod';
import { menuItemSchema } from '@shared/types';
import { AdminDashboard } from '@/components/AdminDashboard';
type MenuItemFormValues = z.infer<typeof menuItemSchema>;
export function AdminPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [menuData, orderData] = await Promise.all([
        api<MenuItem[]>('/api/menu'),
        api<Order[]>('/api/orders'),
      ]);
      setMenuItems(menuData);
      setOrders(orderData);
    } catch (error) {
      toast.error('Failed to fetch admin data.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalOrders, totalRevenue, avgOrderValue };
  }, [orders]);
  const filteredMenuItems = useMemo(() => {
    if (filterCategory === 'All') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === filterCategory);
  }, [menuItems, filterCategory]);
  const handleFormSubmit = async (data: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        const updatedItem = await api<MenuItem>(`/api/menu/${selectedItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        toast.success('Menu item updated successfully!');
      } else {
        const newItem = await api<MenuItem>('/api/menu', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        setMenuItems([...menuItems, newItem]);
        toast.success('Menu item created successfully!');
      }
      setIsFormOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error('Failed to save menu item.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await api(`/api/menu/${selectedItem.id}`, { method: 'DELETE' });
      setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
      toast.success('Menu item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete menu item.');
    } finally {
      setIsConfirmOpen(false);
      setSelectedItem(null);
    }
  };
  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };
  const openDeleteDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setIsConfirmOpen(true);
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 space-y-12">
          <div>
            <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your restaurant and view key metrics.</p>
          </div>
          <AdminDashboard {...dashboardStats} isLoading={isLoading} />
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-display">Menu Management</CardTitle>
                <CardDescription className="mt-1">Add, edit, or remove menu items.</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as Category | 'All')}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isFormOpen} onOpenChange={(open) => {
                  if (!open) setSelectedItem(null);
                  setIsFormOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                      <DialogDescription>
                        {selectedItem ? 'Update the details of the menu item.' : 'Fill in the details to add a new item to the menu.'}
                      </DialogDescription>
                    </DialogHeader>
                    <MenuItemForm
                      onSubmit={handleFormSubmit}
                      initialData={selectedItem}
                      isSubmitting={isSubmitting}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredMenuItems.length > 0 ? (
                      filteredMenuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">{item.category}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                                <Trash2 className="h-4 w-4 text-[hsl(var(--destructive))]" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No menu items found for this category.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {selectedItem && (
        <DeleteConfirmationDialog
          isOpen={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleDelete}
          itemName={selectedItem.name}
        />
      )}
    </AppLayout>
  );
}