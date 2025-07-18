// Main dashboard page showcasing the Data Access Layer

"use client";

import { useEffect } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { UsersTable } from '@/components/dashboard/users-table';
import { ProductsTable } from '@/components/dashboard/products-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Code, Layers } from 'lucide-react';
import { DIContainer } from '@/lib/di/container';

export default function Home() {
  useEffect(() => {
    // Initialize the DI container and database connection
    const initializeApp = async () => {
      try {
        const container = DIContainer.getInstance();
        await container.initialize();
        console.log('Application initialized successfully');
      } catch (error) {
        console.error('Failed to initialize application:', error);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      const cleanup = async () => {
        try {
          const container = DIContainer.getInstance();
          await container.cleanup();
        } catch (error) {
          console.error('Failed to cleanup application:', error);
        }
      };
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Data Access Layer Demo
                </h1>
                <p className="text-gray-600">
                  Enterprise-grade Next.js architecture with proper DAL structure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Architecture Overview */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Architecture Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Access Layer</h3>
                <p className="text-sm text-gray-600">
                  Repository pattern with base CRUD operations, database configuration, 
                  and entity-specific methods
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Logic Layer</h3>
                <p className="text-sm text-gray-600">
                  Service classes containing business rules, validation, 
                  and application logic separated from data access
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Presentation Layer</h3>
                <p className="text-sm text-gray-600">
                  React components, API routes, and UI logic with proper 
                  separation from business and data concerns
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Dashboard */}
        <StatsCards />

        {/* Data Management Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-400px">
              <TabsTrigger value="users" className="flex items-center gap-2">
                Users 
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <UsersTable />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <ProductsTable />
            </TabsContent>
          </Tabs>
        </div>

        {/* Technical Details */}
        <Card className="mt-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Implementation Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Access Layer</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Repository pattern implementation</li>
                  <li>• Base repository with common CRUD operations</li>
                  <li>• Entity-specific repository methods</li>
                  <li>• Database connection management</li>
                  <li>• Query options and pagination support</li>
                  <li>• Type-safe database operations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Business & Presentation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Service layer with business logic</li>
                  <li>• Dependency injection container</li>
                  <li>• Input validation and error handling</li>
                  <li>• RESTful API routes following DAL principles</li>
                  <li>• Reactive UI components with real-time updates</li>
                  <li>• Clean separation of concerns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}