'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface QuoteItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  quantity: number;
  image: string;
  moq: number;
  product_id: string;
}

interface QuoteContextType {
  quoteItems: QuoteItem[];
  loading: boolean;
  addToQuote: (product: any, quantity?: number) => Promise<void>;
  removeFromQuote: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearQuote: () => Promise<void>;
  getTotalItems: () => number;
  getTotalValue: () => number;
  fetchQuoteItems: () => Promise<void>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
          products (
            id,
            name,
            category,
            subcategory,
            price,
            moq,
            images,
            cover_img
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching quote items:', error);
        return;
      }

      const formattedItems: QuoteItem[] = data.map(item => ({
        id: item.product_id,
        product_id: item.product_id,
        name: item.products.name,
        category: item.products.category,
        subcategory: item.products.subcategory || '',
        price: Number(item.unit_price),
        quantity: item.quantity,
        image: item.products.cover_img?.[0] || item.products.images?.[0] || '',
        moq: item.products.moq || 50
      }));

      setQuoteItems(formattedItems);
    } catch (error) {
      console.error('Error fetching quote items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToQuote = async (product: any, quantity: number = product.moq || 50) => {
    if (!user) return;

    try {
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * quantity;

      const { error } = await supabase
        .from('quote_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity,
          unit_price: unitPrice,
          total_price: totalPrice
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        console.error('Error adding to quote:', error);
        return;
      }

      await fetchQuoteItems();
    } catch (error) {
      console.error('Error adding to quote:', error);
    }
  };

  const removeFromQuote = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('quote_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from quote:', error);
        return;
      }

      setQuoteItems(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from quote:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    const item = quoteItems.find(item => item.id === productId);
    if (!item) return;

    const finalQuantity = Math.max(quantity, item.moq);
    const totalPrice = item.price * finalQuantity;

    try {
      const { error } = await supabase
        .from('quote_items')
        .update({
          quantity: finalQuantity,
          total_price: totalPrice
        })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error updating quantity:', error);
        return;
      }

      setQuoteItems(prev =>
        prev.map(item =>
          item.id === productId
            ? { ...item, quantity: finalQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearQuote = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('quote_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing quote:', error);
        return;
      }

      setQuoteItems([]);
    } catch (error) {
      console.error('Error clearing quote:', error);
    }
  };

  const getTotalItems = () => {
    return quoteItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalValue = () => {
    return quoteItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <QuoteContext.Provider value={{
      quoteItems,
      loading,
      addToQuote,
      removeFromQuote,
      updateQuantity,
      clearQuote,
      getTotalItems,
      getTotalValue,
      fetchQuoteItems
    }}>
      {children}
    </QuoteContext.Provider>
  );
};