import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Review } from '../../../type';
import Link from 'next/link';
import Rating from '@/components/Rating';
import Image from 'next/image';
import { getAllReviews, deleteReview } from '@/services/firebaseService';

const AdminReviews = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Function to check if the user is an admin
  const isAdmin = (email?: string | null) => {
    if (!email) return false;
    return email === 'sugus7215@gmail.com' || email.endsWith('@admin.com');
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (!isAdmin(session?.user?.email)) {
        router.push('/');
      } else {
        fetchReviews();
      }
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  // Filter and sort reviews when reviews, searchTerm, filterRating, or sortOrder changes
  useEffect(() => {
    let result = [...reviews];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(review => 
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply rating filter
    if (filterRating > 0) {
      result = result.filter(review => review.rating === filterRating);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      switch (sortOrder) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    
    setFilteredReviews(result);
  }, [reviews, searchTerm, filterRating, sortOrder]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Get all reviews using the Firebase service
      const reviewsData = await getAllReviews();
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        // Delete the review using the Firebase service
        await deleteReview(reviewId);
        
        // Update state
        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        setReviews(updatedReviews);
        setFilteredReviews(updatedReviews.filter(review => 
          filteredReviews.some(fr => fr.id === review.id)
        ));
        
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const getRatingStats = () => {
    const stats = {
      total: reviews.length,
      average: 0,
      distribution: [0, 0, 0, 0, 0] // For ratings 1-5
    };
    
    if (reviews.length > 0) {
      // Calculate average
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      stats.average = sum / reviews.length;
      
      // Calculate distribution
      reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          stats.distribution[review.rating - 1]++;
        }
      });
    }
    
    return stats;
  };

  const stats = getRatingStats();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading reviews...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <Link 
          href="/admin"
          className="bg-amazon_blue text-white px-4 py-2 rounded hover:bg-amazon_yellow hover:text-black transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">Review Stats</h2>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p>Total Reviews:</p>
              <p className="font-bold">{stats.total}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Average Rating:</p>
              <div className="flex items-center">
                <span className="font-bold mr-2">{stats.average.toFixed(1)}</span>
                <Rating rating={stats.average} size={16} />
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">Rating Distribution</h3>
          {stats.distribution.map((count, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span>{index + 1}</span>
                  <span className="ml-1">⭐</span>
                </div>
                <span>{count} reviews</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-amazon_yellow h-2.5 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by comment or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
                <select
                  id="rating"
                  value={filterRating}
                  onChange={(e) => setFilterRating(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value="0">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full p-2 border rounded"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredReviews.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {reviews.length === 0 ? "No reviews found" : "No reviews match your filters"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReviews.map((review) => (
                      <tr key={review.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            href={`/product/${review.productId}`}
                            className="text-amazon_blue hover:underline"
                          >
                            Product #{review.productId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {review.userImage ? (
                              <Image 
                                src={review.userImage} 
                                alt={review.userName} 
                                width={32} 
                                height={32}
                                style={{height: "auto"}} 
                                className="rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                <span className="text-gray-500 font-bold">{review.userName.charAt(0)}</span>
                              </div>
                            )}
                            <span className="text-sm text-gray-900">{review.userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Rating rating={review.rating} size={18} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {review.comment}
                          </div>
                          {review.reviewImage && review.reviewImage.previewUrl && (
                            <div className="mt-2">
                              <Image 
                                src={review.reviewImage.previewUrl} 
                                alt={`Review by ${review.userName}`}
                                width={64}
                                height={64}
                                style={{height: "auto"}}
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews; 