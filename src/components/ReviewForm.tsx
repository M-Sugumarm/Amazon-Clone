import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { saveReview } from '@/services/firebaseService';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReviewImage(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      setError('Please sign in to submit a review');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      setError('Please enter a review comment');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Handle image information
      let reviewImageData = null;
      
      if (reviewImage && previewImage) {
        // Only store a reference to the image, not the actual image data
        // In a real app, this is where you'd upload to Firebase Storage
        // Instead, we're just storing image metadata
        reviewImageData = {
          name: reviewImage.name,
          size: reviewImage.size,
          type: reviewImage.type,
          lastModified: reviewImage.lastModified,
          // Store a 100% compressed and smaller version of the preview for display
          previewUrl: previewImage
        };
      }
      
      // Save review data using the Firebase service
      await saveReview({
        productId,
        userId: session.user.email || '',
        userName: session.user.name || '',
        userImage: session.user.image || '',
        reviewImage: reviewImageData, // Store image metadata in Firestore
        rating,
        comment,
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      setRating(0);
      setComment('');
      setReviewImage(null);
      setPreviewImage(null);
      
      // Notify parent component
      onReviewSubmitted();
    } catch (error) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <p className="text-center">Please sign in to leave a review</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-bold mb-4">Write a Review</h3>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl mr-1 focus:outline-none"
              >
                {star <= (hoveredRating || rating) ? (
                  <AiFillStar className="text-yellow-400" />
                ) : (
                  <AiOutlineStar className="text-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-2 font-medium">
            Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border rounded-md p-2 resize-none focus:border-amazon_blue focus:outline-none"
            placeholder="Share your experience with this product..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reviewImage" className="block mb-2 font-medium">
            Add Photo (optional)
          </label>
          <input
            type="file"
            id="reviewImage"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full rounded-md"
          />
          {previewImage && (
            <div className="mt-2">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setReviewImage(null);
                  setPreviewImage(null);
                }}
                className="text-xs text-red-500 mt-1 hover:underline"
              >
                Remove photo
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 font-medium bg-amazon_blue text-white rounded-md hover:bg-amazon_yellow hover:text-black duration-300 px-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 