// User repository with specific user-related operations

import { BaseRepository } from '../database/base-repository';
import { User, CreateUserDto, UpdateUserDto, QueryOptions } from '@/types';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize with some sample data
    this.data = [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user',
        isActive: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'moderator',
        isActive: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];
  }

  // User-specific methods
  public async findByEmail(email: string): Promise<User | null> {
    try {
      const user = this.data.find(user => user.email === email) || null;
      console.log(`Found user by email: ${email}`, !!user);
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user by email');
    }
  }

  public async findByRole(role: User['role']): Promise<User[]> {
    try {
      const users = this.data.filter(user => user.role === role);
      console.log(`Found ${users.length} users with role: ${role}`);
      return users;
    } catch (error) {
      console.error('Error finding users by role:', error);
      throw new Error('Failed to find users by role');
    }
  }

  public async findActiveUsers(): Promise<User[]> {
    try {
      const activeUsers = this.data.filter(user => user.isActive);
      console.log(`Found ${activeUsers.length} active users`);
      return activeUsers;
    } catch (error) {
      console.error('Error finding active users:', error);
      throw new Error('Failed to find active users');
    }
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    // Validate email uniqueness
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: Omit<User, keyof import('@/types').BaseEntity> = {
      email: userData.email,
      name: userData.name,
      role: userData.role || 'user',
      isActive: true,
    };

    return await this.create(newUser);
  }

  public async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    // Validate email uniqueness if email is being updated
    if (userData.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('User with this email already exists');
      }
    }

    return await this.update(id, userData);
  }

  public async deactivateUser(id: string): Promise<User | null> {
    return await this.update(id, { isActive: false });
  }

  public async activateUser(id: string): Promise<User | null> {
    return await this.update(id, { isActive: true });
  }

  public async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const term = searchTerm.toLowerCase();
      const users = this.data.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
      console.log(`Found ${users.length} users matching search: ${searchTerm}`);
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }
}