import React, { useState, useEffect } from 'react';
import { Review } from '../../type';
import Rating from './Rating';
import Image from 'next/image';
import { getReviewsByProductId } from '@/services/firebaseService';

interface ReviewsProps {
  productId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews using the Firebase service
        const reviewsData = await getReviewsByProductId(productId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div className="flex justify-center p-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center p-4 text-gray-500">No reviews yet. Be the first to review this product!</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2">
              {review.userImage ? (
                <Image 
                  src={review.userImage} 
                  alt={review.userName} 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-bold">{review.userName.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="font-medium">{review.userName}</p>
                <div className="flex items-center gap-2">
                  <Rating rating={review.rating} />
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{review.comment}</p>
            
            {/* Display review image if available */}
            {review.reviewImage && review.reviewImage.previewUrl && (
              <div className="mt-3">
                <Image 
                  src={review.reviewImage.previewUrl} 
                  alt={`Review by ${review.userName}`}
                  width={300}
                  height={200}
                  style={{height: "auto"}}
                  className="max-w-xs max-h-48 rounded-md object-contain"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews; 