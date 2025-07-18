// Product service layer containing business logic

import { ProductRepository } from '../repositories/product-repository';
import { Product, CreateProductDto, UpdateProductDto, PaginationParams, PaginatedResponse, ApiResponse } from '@/types';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async createProduct(productData: CreateProductDto): Promise<ApiResponse<Product>> {
    try {
      // Business rules validation
      if (!this.isValidPrice(productData.price)) {
        return {
          success: false,
          error: 'Price must be greater than 0',
        };
      }

      if (!this.isValidStock(productData.stock)) {
        return {
          success: false,
          error: 'Stock must be a non-negative number',
        };
      }

      if (!this.isValidName(productData.name)) {
        return {
          success: false,
          error: 'Product name must be at least 2 characters long',
        };
      }

      const product = await this.productRepository.createProduct(productData);
      
      return {
        success: true,
        data: product,
        message: 'Product created successfully',
      };
    } catch (error) {
      console.error('ProductService.createProduct error:', error);
      return {
        success: false,
        error: 'Failed to create product',
      };
    }
  }

  public async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const product = await this.productRepository.findById(id);
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      console.error('ProductService.getProductById error:', error);
      return {
        success: false,
        error: 'Failed to retrieve product',
      };
    }
  }

  public async getAllProducts(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const result = await this.productRepository.findWithPagination(params);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('ProductService.getAllProducts error:', error);
      return {
        success: false,
        error: 'Failed to retrieve products',
      };
    }
  }

  public async getAvailableProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const products = await this.productRepository.findAvailableProducts();
      
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.error('ProductService.getAvailableProducts error:', error);
      return {
        success: false,
        error: 'Failed to retrieve available products',
      };
    }
  }

  public async updateProduct(id: string, productData: UpdateProductDto): Promise<ApiResponse<Product>> {
    try {
      // Business rules validation
      if (productData.price !== undefined && !this.isValidPrice(productData.price)) {
        return {
          success: false,
          error: 'Price must be greater than 0',
        };
      }

      if (productData.stock !== undefined && !this.isValidStock(productData.stock)) {
        return {
          success: false,
          error: 'Stock must be a non-negative number',
        };
      }

      if (productData.name && !this.isValidName(productData.name)) {
        return {
          success: false,
          error: 'Product name must be at least 2 characters long',
        };
      }

      const product = await this.productRepository.updateProduct(id, productData);
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      return {
        success: true,
        data: product,
        message: 'Product updated successfully',
      };
    } catch (error) {
      console.error('ProductService.updateProduct error:', error);
      return {
        success: false,
        error: 'Failed to update product',
      };
    }
  }

  public async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      const deleted = await this.productRepository.delete(id);
      
      return {
        success: true,
        data: deleted,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      console.error('ProductService.deleteProduct error:', error);
      return {
        success: false,
        error: 'Failed to delete product',
      };
    }
  }

  public async searchProducts(searchTerm: string): Promise<ApiResponse<Product[]>> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: false,
          error: 'Search term must be at least 2 characters long',
        };
      }

      const products = await this.productRepository.searchProducts(searchTerm.trim());
      
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.error('ProductService.searchProducts error:', error);
      return {
        success: false,
        error: 'Failed to search products',
      };
    }
  }

  public async getProductsByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    try {
      const products = await this.productRepository.findByCategory(categoryId);
      
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.error('ProductService.getProductsByCategory error:', error);
      return {
        success: false,
        error: 'Failed to retrieve products by category',
      };
    }
  }

  public async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<ApiResponse<Product[]>> {
    try {
      if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
        return {
          success: false,
          error: 'Invalid price range',
        };
      }

      const products = await this.productRepository.findByPriceRange(minPrice, maxPrice);
      
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.error('ProductService.getProductsByPriceRange error:', error);
      return {
        success: false,
        error: 'Failed to retrieve products by price range',
      };
    }
  }

  public async updateStock(id: string, quantity: number): Promise<ApiResponse<Product>> {
    try {
      const product = await this.productRepository.updateStock(id, quantity);
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      return {
        success: true,
        data: product,
        message: 'Stock updated successfully',
      };
    } catch (error) {
      console.error('ProductService.updateStock error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stock',
      };
    }
  }

  public async getLowStockProducts(threshold: number = 10): Promise<ApiResponse<Product[]>> {
    try {
      if (threshold < 0) {
        return {
          success: false,
          error: 'Threshold must be a non-negative number',
        };
      }

      const products = await this.productRepository.getLowStockProducts(threshold);
      
      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.error('ProductService.getLowStockProducts error:', error);
      return {
        success: false,
        error: 'Failed to retrieve low stock products',
      };
    }
  }

  // Private validation methods
  private isValidPrice(price: number): boolean {
    return price > 0;
  }

  private isValidStock(stock: number): boolean {
    return stock >= 0 && Number.isInteger(stock);
  }

  private isValidName(name: string): boolean {
    return name.trim().length >= 2;
  }
}