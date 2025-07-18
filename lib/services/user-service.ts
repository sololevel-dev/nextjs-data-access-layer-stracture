// User service layer containing business logic

import { UserRepository } from '../repositories/user-repository';
import { User, CreateUserDto, UpdateUserDto, PaginationParams, PaginatedResponse, ApiResponse } from '@/types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Business logic methods
  public async createUser(userData: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      // Business rules validation
      if (!this.isValidEmail(userData.email)) {
        return {
          success: false,
          error: 'Invalid email format',
        };
      }

      if (!this.isValidName(userData.name)) {
        return {
          success: false,
          error: 'Name must be at least 2 characters long',
        };
      }

      const user = await this.userRepository.createUser(userData);
      
      return {
        success: true,
        data: user,
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('UserService.createUser error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      };
    }
  }

  public async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      return {
        success: false,
        error: 'Failed to retrieve user',
      };
    }
  }

  public async getAllUsers(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const result = await this.userRepository.findWithPagination(params);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('UserService.getAllUsers error:', error);
      return {
        success: false,
        error: 'Failed to retrieve users',
      };
    }
  }

  public async updateUser(id: string, userData: UpdateUserDto): Promise<ApiResponse<User>> {
    try {
      // Business rules validation
      if (userData.email && !this.isValidEmail(userData.email)) {
        return {
          success: false,
          error: 'Invalid email format',
        };
      }

      if (userData.name && !this.isValidName(userData.name)) {
        return {
          success: false,
          error: 'Name must be at least 2 characters long',
        };
      }

      const user = await this.userRepository.updateUser(id, userData);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('UserService.updateUser error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      };
    }
  }

  public async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    try {
      // Business rule: Check if user exists
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Business rule: Admin users cannot be deleted
      if (user.role === 'admin') {
        return {
          success: false,
          error: 'Admin users cannot be deleted',
        };
      }

      const deleted = await this.userRepository.delete(id);
      
      return {
        success: true,
        data: deleted,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error('UserService.deleteUser error:', error);
      return {
        success: false,
        error: 'Failed to delete user',
      };
    }
  }

  public async searchUsers(searchTerm: string): Promise<ApiResponse<User[]>> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: false,
          error: 'Search term must be at least 2 characters long',
        };
      }

      const users = await this.userRepository.searchUsers(searchTerm.trim());
      
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      console.error('UserService.searchUsers error:', error);
      return {
        success: false,
        error: 'Failed to search users',
      };
    }
  }

  public async getUsersByRole(role: User['role']): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.userRepository.findByRole(role);
      
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      console.error('UserService.getUsersByRole error:', error);
      return {
        success: false,
        error: 'Failed to retrieve users by role',
      };
    }
  }

  public async deactivateUser(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.deactivateUser(id);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
        message: 'User deactivated successfully',
      };
    } catch (error) {
      console.error('UserService.deactivateUser error:', error);
      return {
        success: false,
        error: 'Failed to deactivate user',
      };
    }
  }

  // Private validation methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidName(name: string): boolean {
    return name.trim().length >= 2;
  }
}