import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { path, type } = await request.json();
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Revalidate the specific path
    revalidatePath(path, type || 'page');
    
    // Also revalidate related paths
    if (path.includes('/products/')) {
      revalidatePath('/products', 'page');
      revalidatePath('/', 'page'); // Home page might show products
    }

    return NextResponse.json({ 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ 
      error: 'Failed to revalidate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add GET method for manual testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to revalidate',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}