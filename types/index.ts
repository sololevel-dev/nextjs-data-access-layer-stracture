// Core types and interfaces for the application

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  isAvailable: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  description: string;
  parentId?: string;
}

export interface Order extends BaseEntity {
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Database operation types
export interface QueryOptions {
  select?: string[];
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role?: 'admin' | 'user' | 'moderator';
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: 'admin' | 'user' | 'moderator';
  isActive?: boolean;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  isAvailable?: boolean;
}