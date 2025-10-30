import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, BarChart } from "lucide-react";
interface AdminDashboardProps {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  isLoading: boolean;
}
export function AdminDashboard({
  totalOrders,
  totalRevenue,
  avgOrderValue,
  isLoading,
}: AdminDashboardProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `Br${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Avg. Order Value",
      value: `Br${avgOrderValue.toFixed(2)}`,
      icon: BarChart,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}