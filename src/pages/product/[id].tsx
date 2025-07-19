import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { HiShoppingCart } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/nextSlice';
import { ProductProps } from '../../../type';
import FormattedPrice from '@/components/FormattedPrice';
import Rating from '@/components/Rating';
import Reviews from '@/components/Reviews';
import ReviewForm from '@/components/ReviewForm';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import app from '@/firebase';

const ProductDetails = ({ product }: { product: ProductProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [refreshReviews, setRefreshReviews] = useState(false);
  const db = getFirestore(app);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('productId', '==', product.id)
        );
        const querySnapshot = await getDocs(q);
        const reviews: any[] = [];
        querySnapshot.forEach((doc) => {
          reviews.push(doc.data());
        });
        
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          setAvgRating(totalRating / reviews.length);
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, [product.id, refreshReviews, db]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        quantity: 1,
        rating: { rate: avgRating, count: reviewCount }
      })
    );
  };

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => !prev);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-white p-8 rounded-lg flex justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300">
          <Image
            src={product.image}
            alt={product.title}
            width={400}
            height={400}
            style={{height: "auto"}}
            className="object-contain max-h-80"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          
          <div className="flex items-center gap-2 mb-2">
            <Rating rating={avgRating} count={reviewCount} />
            <span className="text-sm text-blue-600 underline cursor-pointer" 
                  onClick={() => document.getElementById('reviews-section')?.scrollIntoView({behavior: 'smooth'})}>
              {reviewCount > 0 ? `See all ${reviewCount} reviews` : "Be the first to review"}
            </span>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-amazon_blue">
              <FormattedPrice amount={product.price * 10} />
            </h2>
            <p className="text-sm text-green-600 mt-1">In Stock & Ready to Ship</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">About this item:</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>

          <div className="border-b pb-4 flex flex-wrap gap-2">
            <p className="text-sm font-bold">Category: </p>
            <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">{product.category}</span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="h-12 flex items-center justify-center gap-2 bg-amazon_blue text-white rounded-md hover:bg-amazon_yellow hover:text-black duration-300"
            >
              <HiShoppingCart className="text-xl" />
              Add to Cart
            </button>
            
            <button
              onClick={() => window.location.href = '/cart'}
              className="h-12 flex items-center justify-center gap-2 bg-amazon_yellow text-black rounded-md hover:bg-yellow-500 duration-300"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section with ID for scrolling */}
      <div id="reviews-section" className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Customer Reviews & Ratings</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">Write a Review</h3>
              <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Rating Summary</h3>
              <div className="flex items-center gap-2 mb-2">
                <Rating rating={avgRating} count={0} size={24} />
                <span className="text-lg font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Reviews productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const res = await fetch('https://fakestoreapi.com/products');
  const products = await res.json();

  const paths = products.map((product: ProductProps) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);
  const product = await res.json();

  return {
    props: {
      product,
    },
    revalidate: 60,
  };
}

export default ProductDetails; 