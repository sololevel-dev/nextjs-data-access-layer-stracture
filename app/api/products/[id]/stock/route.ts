// API route for product stock management

import { NextRequest, NextResponse } from 'next/server';
import { getProductService } from '@/lib/di/container';

const productService = getProductService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a number' },
        { status: 400 }
      );
    }

    const result = await productService.updateStock(params.id, quantity);
    
    if (!result.success) {
      return NextResponse.json(result, { status: result.error === 'Product not found' ? 404 : 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PATCH /api/products/[id]/stock error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}