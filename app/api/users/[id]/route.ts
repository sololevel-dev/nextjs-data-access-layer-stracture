// API routes for individual user operations

import { NextRequest, NextResponse } from 'next/server';
import { getUserService } from '@/lib/di/container';
import { UpdateUserDto } from '@/types';

const userService = getUserService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await userService.getUserById(params.id);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const userData: UpdateUserDto = {
      email: body.email,
      name: body.name,
      role: body.role,
      isActive: body.isActive,
    };

    const result = await userService.updateUser(params.id, userData);
    
    if (!result.success) {
      return NextResponse.json(result, { status: result.error === 'User not found' ? 404 : 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await userService.deleteUser(params.id);
    
    if (!result.success) {
      return NextResponse.json(result, { status: result.error === 'User not found' ? 404 : 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}