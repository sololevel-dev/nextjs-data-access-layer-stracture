// API routes for individual product operations

import { NextRequest, NextResponse } from 'next/server';
import { getProductService } from '@/lib/di/container';
import { UpdateProductDto } from '@/types';

const productService = getProductService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await productService.getProductById(params.id);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
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
    const productData: UpdateProductDto = {
      name: body.name,
      description: body.description,
      price: body.price,
      categoryId: body.categoryId,
      stock: body.stock,
      isAvailable: body.isAvailable,
    };

    const result = await productService.updateProduct(params.id, productData);
    
    if (!result.success) {
      return NextResponse.json(result, { status: result.error === 'Product not found' ? 404 : 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
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
    const result = await productService.deleteProduct(params.id);
    
    if (!result.success) {
      return NextResponse.json(result, { status: result.error === 'Product not found' ? 404 : 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}