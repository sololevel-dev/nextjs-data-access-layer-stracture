// Product repository with specific product-related operations

import { BaseRepository } from '../database/base-repository';
import { Product, CreateProductDto, UpdateProductDto } from '@/types';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products');
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize with some sample data
    this.data = [
      {
        id: '1',
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        categoryId: 'cat1',
        stock: 50,
        isAvailable: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 29.99,
        categoryId: 'cat2',
        stock: 100,
        isAvailable: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical gaming keyboard',
        price: 149.99,
        categoryId: 'cat2',
        stock: 25,
        isAvailable: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];
  }

  // Product-specific methods
  public async findByCategory(categoryId: string): Promise<Product[]> {
    try {
      const products = this.data.filter(product => product.categoryId === categoryId);
      console.log(`Found ${products.length} products in category: ${categoryId}`);
      return products;
    } catch (error) {
      console.error('Error finding products by category:', error);
      throw new Error('Failed to find products by category');
    }
  }

  public async findAvailableProducts(): Promise<Product[]> {
    try {
      const availableProducts = this.data.filter(product => 
        product.isAvailable && product.stock > 0
      );
      console.log(`Found ${availableProducts.length} available products`);
      return availableProducts;
    } catch (error) {
      console.error('Error finding available products:', error);
      throw new Error('Failed to find available products');
    }
  }

  public async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    try {
      const products = this.data.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
      console.log(`Found ${products.length} products in price range: $${minPrice} - $${maxPrice}`);
      return products;
    } catch (error) {
      console.error('Error finding products by price range:', error);
      throw new Error('Failed to find products by price range');
    }
  }

  public async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const term = searchTerm.toLowerCase();
      const products = this.data.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
      console.log(`Found ${products.length} products matching search: ${searchTerm}`);
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  public async updateStock(id: string, quantity: number): Promise<Product | null> {
    try {
      const product = await this.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      const newStock = product.stock + quantity;
      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }

      return await this.update(id, { 
        stock: newStock,
        isAvailable: newStock > 0 
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock');
    }
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const newProduct: Omit<Product, keyof import('@/types').BaseEntity> = {
      ...productData,
      isAvailable: productData.stock > 0,
    };

    return await this.create(newProduct);
  }

  public async updateProduct(id: string, productData: UpdateProductDto): Promise<Product | null> {
    // Auto-update availability based on stock
    const updates = { ...productData };
    if (updates.stock !== undefined) {
      updates.isAvailable = updates.stock > 0;
    }

    return await this.update(id, updates);
  }

  public async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    try {
      const lowStockProducts = this.data.filter(product => 
        product.stock <= threshold && product.isAvailable
      );
      console.log(`Found ${lowStockProducts.length} low stock products (threshold: ${threshold})`);
      return lowStockProducts;
    } catch (error) {
      console.error('Error finding low stock products:', error);
      throw new Error('Failed to find low stock products');
    }
  }
}