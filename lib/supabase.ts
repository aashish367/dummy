import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  moq: number;
  category: string;
  subcategory: string;
  brand?: string;
  model?: string;
  rating: number;
  reviews: number;
  tags: string[];
  inStock: boolean;
  cover_img: string | string[]; // Updated to handle both string and array
  images: string[];
  specifications?: Record<string, string>;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

// Helper function to normalize cover_img to string
export const normalizeCoverImage = (cover_img: string | string[]): string => {
  if (Array.isArray(cover_img)) {
    return cover_img[0] || '';
  }
  return cover_img || '';
};

// Helper function to get categories with error handling
export const getCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    const categories = Array.from(new Set(data?.map(item => item.category) || []));
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get category details for metadata
export async function getCategoryDetails(categorySlug: string) {
  try {
    // First check if category exists in products
    const { data: products, error } = await supabase
      .from('products')
      .select('category, name')
      .eq('category', categorySlug)
      .limit(1);

    if (error) {
      console.error('Error fetching category details:', error);
      return null;
    }

    if (!products || products.length === 0) {
      return null;
    }

    // Return basic category info
    return {
      slug: categorySlug,
      name: categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      exists: true
    };
  } catch (error) {
    console.error('Error fetching category details:', error);
    return null;
  }
}

// Function to revalidate category cache
export async function revalidateCategory(category: string) {
  try {
    // This would be used with Next.js revalidation API
    if (typeof window === 'undefined') {
      // Server-side revalidation logic
      console.log(`Revalidating category: ${category}`);
    }
  } catch (error) {
    console.error('Error revalidating category:', error);
  }
}