"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Product, ApiResponse, PaginatedResponse } from '@/types';

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, showLowStock]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `/api/products?page=${currentPage}&limit=10`;
      
      if (searchTerm) {
        url = `/api/products?search=${encodeURIComponent(searchTerm)}`;
      } else if (showLowStock) {
        url = `/api/products?lowStock=10`;
      }

      const response = await fetch(url);
      const result: ApiResponse<PaginatedResponse<Product> | Product[]> = await response.json();

      if (result.success && result.data) {
        if (Array.isArray(result.data)) {
          // Search or filter results
          setProducts(result.data);
        } else {
          // Paginated results
          setProducts(result.data.data);
          setTotalPages(result.data.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setShowLowStock(false);
    await fetchProducts();
  };

  const handleToggleLowStock = () => {
    setShowLowStock(!showLowStock);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const result: ApiResponse<boolean> = await response.json();
      
      if (result.success) {
        await fetchProducts();
      } else {
        alert(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products Management
          </CardTitle>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSearch}
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            Search
          </Button>
          <Button 
            onClick={handleToggleLowStock}
            variant={showLowStock ? "default" : "outline"}
            className={showLowStock 
              ? "bg-yellow-600 hover:bg-yellow-700" 
              : "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
            }
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Low Stock
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {product.stock}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStockBadgeColor(product.stock)} border-0`}>
                          {getStockStatus(product.stock)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.categoryId}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!searchTerm && !showLowStock && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gray-200"
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gray-200"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}