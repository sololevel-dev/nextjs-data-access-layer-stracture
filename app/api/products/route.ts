// API routes for product operations

import { NextRequest, NextResponse } from 'next/server';
import { getProductService } from '@/lib/di/container';
import { CreateProductDto, PaginationParams } from '@/types';

const productService = getProductService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Handle search query
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      const result = await productService.searchProducts(searchTerm);
      return NextResponse.json(result);
    }

    // Handle category filter
    const categoryId = searchParams.get('category');
    if (categoryId) {
      const result = await productService.getProductsByCategory(categoryId);
      return NextResponse.json(result);
    }

    // Handle price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      const result = await productService.getProductsByPriceRange(
        parseFloat(minPrice),
        parseFloat(maxPrice)
      );
      return NextResponse.json(result);
    }

    // Handle available products only
    const availableOnly = searchParams.get('available') === 'true';
    if (availableOnly) {
      const result = await productService.getAvailableProducts();
      return NextResponse.json(result);
    }

    // Handle low stock filter
    const lowStock = searchParams.get('lowStock');
    if (lowStock) {
      const threshold = parseInt(lowStock);
      const result = await productService.getLowStockProducts(threshold);
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

    const result = await productService.getAllProducts(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productData: CreateProductDto = {
      name: body.name,
      description: body.description,
      price: body.price,
      categoryId: body.categoryId,
      stock: body.stock,
    };

    const result = await productService.createProduct(productData);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}