// API routes for user operations

import { NextRequest, NextResponse } from 'next/server';
import { getUserService } from '@/lib/di/container';
import { CreateUserDto, PaginationParams } from '@/types';

const userService = getUserService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Handle search query
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      const result = await userService.searchUsers(searchTerm);
      return NextResponse.json(result);
    }

    // Handle role filter
    const role = searchParams.get('role') as any;
    if (role) {
      const result = await userService.getUsersByRole(role);
      return NextResponse.json(result);
    }

    // Handle pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const params: PaginationParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await userService.getAllUsers(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData: CreateUserDto = {
      email: body.email,
      name: body.name,
      role: body.role,
    };

    const result = await userService.createUser(userData);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}