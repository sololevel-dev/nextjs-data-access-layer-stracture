// Base repository class with common CRUD operations

import { BaseEntity, QueryOptions, PaginatedResponse, PaginationParams } from '@/types';
import { DatabaseUtils } from './config';

 abstract class BaseRepository<T extends BaseEntity> {
  protected tableName: string;
  protected data: T[] = []; // In-memory storage for demo purposes

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Create operation
  public async create(entity: Omit<T, keyof BaseEntity>): Promise<T> {
    try {
      const newEntity: T = {
        ...entity,
        id: DatabaseUtils.generateId(),
        createdAt: DatabaseUtils.getCurrentTimestamp(),
        updatedAt: DatabaseUtils.getCurrentTimestamp(),
      } as T;

      this.data.push(newEntity);
      console.log(`Created ${this.tableName} with ID: ${newEntity.id}`);
      return newEntity;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw new Error(`Failed to create ${this.tableName}`);
    }
  }

  // Read operations
  public async findById(id: string): Promise<T | null> {
    try {
      const entity = this.data.find(item => item.id === id) || null;
      console.log(`Found ${this.tableName} with ID: ${id}`, !!entity);
      return entity;
    } catch (error) {
      console.error(`Error finding ${this.tableName} by ID:`, error);
      throw new Error(`Failed to find ${this.tableName}`);
    }
  }

  public async findAll(options?: QueryOptions): Promise<T[]> {
    try {
      let result = [...this.data];

      // Apply where conditions
      if (options?.where) {
        result = result.filter(item => {
          return Object.entries(options.where!).every(([key, value]) => {
            return (item as any)[key] === value;
          });
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0];
        result.sort((a, b) => {
          const aVal = (a as any)[field];
          const bVal = (b as any)[field];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return direction === 'desc' ? -comparison : comparison;
        });
      }

      // Apply limit and offset
      if (options?.offset) {
        result = result.slice(options.offset);
      }
      if (options?.limit) {
        result = result.slice(0, options.limit);
      }

      console.log(`Found ${result.length} ${this.tableName} records`);
      return result;
    } catch (error) {
      console.error(`Error finding all ${this.tableName}:`, error);
      throw new Error(`Failed to find ${this.tableName} records`);
    }
  }

  public async findWithPagination(params: PaginationParams, options?: QueryOptions): Promise<PaginatedResponse<T>> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Get total count before applying pagination
      const allRecords = await this.findAll(options);
      const total = allRecords.length;

      // Apply pagination
      const paginatedOptions = {
        ...options,
        limit,
        offset,
      };

      const data = await this.findAll(paginatedOptions);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(`Error paginating ${this.tableName}:`, error);
      throw new Error(`Failed to paginate ${this.tableName}`);
    }
  }

  // Update operation
  public async update(id: string, updates: Partial<Omit<T, keyof BaseEntity>>): Promise<T | null> {
    try {
      const index = this.data.findIndex(item => item.id === id);
      
      if (index === -1) {
        return null;
      }

      const updatedEntity: T = {
        ...this.data[index],
        ...updates,
        updatedAt: DatabaseUtils.getCurrentTimestamp(),
      };

      this.data[index] = updatedEntity;
      console.log(`Updated ${this.tableName} with ID: ${id}`);
      return updatedEntity;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw new Error(`Failed to update ${this.tableName}`);
    }
  }

  // Delete operation
  public async delete(id: string): Promise<boolean> {
    try {
      const index = this.data.findIndex(item => item.id === id);
      
      if (index === -1) {
        return false;
      }

      this.data.splice(index, 1);
      console.log(`Deleted ${this.tableName} with ID: ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw new Error(`Failed to delete ${this.tableName}`);
    }
  }

  // Utility methods
  public async count(options?: QueryOptions): Promise<number> {
    try {
      const records = await this.findAll(options);
      return records.length;
    } catch (error) {
      console.error(`Error counting ${this.tableName}:`, error);
      throw new Error(`Failed to count ${this.tableName}`);
    }
  }

  public async exists(id: string): Promise<boolean> {
    try {
      const entity = await this.findById(id);
      return entity !== null;
    } catch (error) {
      console.error(`Error checking existence of ${this.tableName}:`, error);
      return false;
    }
  }
}

export { BaseRepository }