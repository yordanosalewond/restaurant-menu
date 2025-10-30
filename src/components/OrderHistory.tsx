import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
  onOrderUpdate: () => void;
}

export function OrderHistory({ orders, isLoading, onOrderUpdate }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      await api(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success('Order status updated successfully!');
      onOrderUpdate();
    } catch (error) {
      toast.error('Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      default:
        return '';
    }
  };
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredAndSortedOrders = useMemo(() => {
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      switch (dateFilter) {
        case 'today': {
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return orderDate >= startOfDay;
        }
        case 'week': {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - 7);
          return orderDate >= startOfWeek;
        }
        case 'month': {
          const startOfMonth = new Date(now);
          startOfMonth.setDate(now.getDate() - 30);
          return orderDate >= startOfMonth;
        }
        default:
          return true;
      }
    });
    
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [orders, dateFilter]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-display">Order History</CardTitle>
          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as typeof dateFilter)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right pr-8">Total</TableHead>
                  <TableHead className="pl-8">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-right pr-8"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                      <TableCell className="pl-8"><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedOrders.length > 0 ? (
                  filteredAndSortedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{order.customer.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right font-semibold pr-8">
                        Br{order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="pl-8">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}
                          disabled={updatingOrderId === order.id}
                        >
                          <SelectTrigger className={`w-[130px] ${getStatusColor(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-mono font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">Br{selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer.name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer.email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer.phone}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Br{item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          Br{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
