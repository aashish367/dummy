'use client';

import { useState, useEffect} from 'react';
import { Star, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  currentRating: number;
  reviewCount: number;
  onAuthRequired: (mode: 'login' | 'signup') => void;
}

const ProductReviews = ({ 
  productId, 
  currentRating, 
  reviewCount,
  onAuthRequired
}: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews and setup real-time updates
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // First, fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, user_id')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        
        if (!reviewsData || reviewsData.length === 0) {
          setReviews([]);
          return;
        }

        // Get unique user IDs
        const userIds = [...new Set(reviewsData.map(review => review.user_id))];
        
        // Fetch user profiles separately
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.warn('Could not fetch user profiles:', profilesError);
        }

        // Create a map of user profiles for easy lookup
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }
        
        // Combine reviews with profile data
        const transformedData = reviewsData.map(review => ({
          ...review,
          profiles: profilesMap.get(review.user_id) || undefined
        }));
        
        setReviews(transformedData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Real-time subscription for instant updates
    const channel = supabase
      .channel(`reviews:${productId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reviews',
        filter: `product_id=eq.${productId}`
      }, () => {
        fetchReviews(); // Refresh on any review change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  const submitReview = async () => {
    if (!user) {
      onAuthRequired('login');
      return;
    }
    if (newReview.rating === 0) return;

    try {
      setFormLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment,
        }])
        .select();

      if (error) throw error;

      // Optimistic UI update
      if (data?.[0]) {
        setReviews(prev => [{
          ...data[0],
          profiles: {
            username: user.user_metadata?.full_name || 'You',
            avatar_url: user.user_metadata?.avatar_url || ''
          }
        }, ...prev]);
      }

      await updateProductRating();
      setNewReview({ rating: 0, comment: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const updateProductRating = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) throw error;
      if (!reviewsData?.length) return;

      const totalRatings = reviewsData.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / reviewsData.length;

      await supabase
        .from('products')
        .update({
          rating: parseFloat(averageRating.toFixed(1)),
          reviews: reviewsData.length
        })
        .eq('id', productId);
    } catch (error) {
      console.error('Error updating product rating:', error);
    }
  };

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Customer Reviews
      </h3>

      {(currentRating > 0 || reviewCount > 0) && (
        <div className="flex items-center mb-8">
          <div className="flex items-center mr-4">
            <span className="text-3xl font-bold mr-2">
              {currentRating > 0 ? currentRating : 'No ratings'}
            </span>
            {currentRating > 0 && (
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
            )}
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {reviewCount > 0 
                ? `Based on ${reviewCount} review${reviewCount !== 1 ? 's' : ''}`
                : 'No reviews yet'}
            </p>
          </div>
        </div>
      )}

      {!user ? (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            Please <button 
              onClick={() => onAuthRequired('login')}
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              sign in
            </button> to write a review
          </p>
        </div>
      ) : showForm ? (
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Your Review</h4>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
              disabled={formLoading}
            >
            </button>
          </div>
          
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setNewReview({...newReview, rating: star})}
                className="mr-1 focus:outline-none"
                disabled={formLoading}
              >
                <Star
                  className={`h-6 w-6 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
          
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            placeholder="Share your experience with this product..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={4}
            disabled={formLoading}
          />
          
          <div className="flex justify-end">
            <button
              onClick={submitReview}
              disabled={newReview.rating === 0 || formLoading}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {formLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Review'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Write a Review
        </button>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-1"></div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center mb-2">
                {review.profiles?.avatar_url ? (
                  <img
                    src={review.profiles.avatar_url}
                    alt={review.profiles.username}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {review.profiles?.username || 'Anonymous'}
                  </p>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(review.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 py-4">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
};

export default ProductReviews;