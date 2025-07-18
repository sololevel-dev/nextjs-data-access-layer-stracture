"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { ApiResponse, PaginatedResponse, User, Product } from '@/types';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  lowStockProducts: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const usersResponse = await fetch('/api/users?page=1&limit=1000');
      const usersResult: ApiResponse<PaginatedResponse<User>> = await usersResponse.json();

      // Fetch product stats
      const productsResponse = await fetch('/api/products?page=1&limit=1000');
      const productsResult: ApiResponse<PaginatedResponse<Product>> = await productsResponse.json();

      // Fetch low stock products
      const lowStockResponse = await fetch('/api/products?lowStock=10');
      const lowStockResult: ApiResponse<Product[]> = await lowStockResponse.json();

      if (usersResult.success && productsResult.success && lowStockResult.success) {
        const users = usersResult.data?.data || [];
        const products = productsResult.data?.data || [];
        const lowStockProducts = lowStockResult.data || [];

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(user => user.isActive).length,
          totalProducts: products.length,
          lowStockProducts: lowStockProducts.length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (
                card.value.toLocaleString()
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}