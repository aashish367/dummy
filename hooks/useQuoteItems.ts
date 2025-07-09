import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Product } from '../lib/supabase';

export interface QuoteItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export const useQuoteItems = () => {
  const { user } = useAuth();
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQuoteItems();
    } else {
      setQuoteItems([]);
    }
  }, [user]);

  const fetchQuoteItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const items = data?.map(item => ({
        id: item.id,
        product: item.products,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })) || [];

      setQuoteItems(items as QuoteItem[]);
    } catch (error) {
      console.error('Error fetching quote items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToQuote = async (product: Product, quantity: number, unitPrice?: number) => {
    if (!user) return { error: 'User not authenticated' };

    const price = unitPrice || product.price;
    const totalPrice = price * quantity;

    try {
      const { data, error } = await supabase
        .from('quote_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity,
          unit_price: price,
          total_price: totalPrice,
        }, {
          onConflict: 'user_id,product_id'
        })
        .select();

      if (error) throw error;

      await fetchQuoteItems();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const updateQuoteItem = async (itemId: string, quantity: number) => {
    if (!user) return { error: 'User not authenticated' };

    const item = quoteItems.find(item => item.id === itemId);
    if (!item) return { error: 'Item not found' };

    const totalPrice = item.unit_price * quantity;

    try {
      const { error } = await supabase
        .from('quote_items')
        .update({
          quantity,
          total_price: totalPrice,
        })
        .eq('id', itemId);

      if (error) throw error;

      await fetchQuoteItems();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const removeFromQuote = async (itemId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('quote_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setQuoteItems(prev => prev.filter(item => item.id !== itemId));
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const clearQuote = async () => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('quote_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setQuoteItems([]);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const getTotalItems = () => {
    return quoteItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return quoteItems.reduce((total, item) => total + item.total_price, 0);
  };

  return {
    quoteItems,
    loading,
    addToQuote,
    updateQuoteItem,
    removeFromQuote,
    clearQuote,
    getTotalItems,
    getTotalAmount,
    refetch: fetchQuoteItems,
  };
};