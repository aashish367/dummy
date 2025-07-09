import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Product } from '../lib/supabase';

type SupabaseWishlistResponse = {
  product_id: string;
  products: Product[] | null;
}[];

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          product_id,
          products (
            id,
            name,
            category,
            subcategory,
            brand,
            model,
            price,
            original_price,
            moq,
            rating,
            reviews,
            images,
            tags,
            inStock,
            description,
            specifications,
            highlights,
            created_at,
            updated_at,
            cover_img
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Handle the array response properly
      const responseData = data as unknown as SupabaseWishlistResponse;
      
      // Extract products from the response
      const products = responseData
        .flatMap(item => item.products) // Flatten the array of arrays
        .filter((product): product is Product => product !== null);
      
      setWishlistItems(products);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the code remains the same ...
  const addToWishlist = async (product: Product) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: product.id,
        });

      if (error) throw error;

      setWishlistItems(prev => [...prev, product]);
      return { error: null };
    } catch (error: any) {
      if (error.code === '23505') {
        return { error: 'Product already in wishlist' };
      }
      return { error: error.message };
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlist,
  };
};