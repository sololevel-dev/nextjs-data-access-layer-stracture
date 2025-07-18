// Dependency injection container for managing services

import { UserService } from '../services/user-service';
import { ProductService } from '../services/product-service';
import { DatabaseConnection } from '../database/config';

export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Initialize database connection
    const dbConnection = DatabaseConnection.getInstance();
    this.services.set('DatabaseConnection', dbConnection);

    // Initialize services
    this.services.set('UserService', new UserService());
    this.services.set('ProductService', new ProductService());
  }

  public getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  public registerService<T>(serviceName: string, service: T): void {
    this.services.set(serviceName, service);
  }

  public hasService(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  public async initialize(): Promise<void> {
    try {
      console.log('Initializing DI Container...');
      
      // Initialize database connection
      const dbConnection = this.getService<DatabaseConnection>('DatabaseConnection');
      await dbConnection.connect();
      
      console.log('DI Container initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DI Container:', error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      console.log('Cleaning up DI Container...');
      
      // Cleanup database connection
      const dbConnection = this.getService<DatabaseConnection>('DatabaseConnection');
      await dbConnection.disconnect();
      
      this.services.clear();
      console.log('DI Container cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup DI Container:', error);
    }
  }
}

// Utility functions to get services
export const getService = <T>(serviceName: string): T => {
  return DIContainer.getInstance().getService<T>(serviceName);
};

export const getUserService = (): UserService => {
  return getService<UserService>('UserService');
};

export const getProductService = (): ProductService => {
  return getService<ProductService>('ProductService');
};