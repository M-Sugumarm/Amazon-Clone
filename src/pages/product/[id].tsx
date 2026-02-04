import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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

// Fallback placeholder image for broken images
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23999'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const ProductDetails = ({ product }: { product: ProductProps }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [refreshReviews, setRefreshReviews] = useState(false);
  const db = getFirestore(app);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState(product?.image || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setImgSrc(FALLBACK_IMAGE);
      setHasError(true);
    }
  };

  useEffect(() => {
    // Only fetch ratings if product exists
    if (!product?.id) return;

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
  }, [product?.id, refreshReviews, db]);

  // Early return for loading states
  if (router.isFallback || !product) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
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
    <div className="w-full bg-white h-auto min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Image - Sticky on Desktop */}
          <div className="lg:col-span-1 lg:h-auto lg:sticky lg:top-24 max-h-[500px] flex items-start justify-center">
            <div className="w-full bg-white rounded-lg flex justify-center items-center">
              <img
                src={imgSrc}
                alt={product.title}
                className="object-contain max-h-[400px] hover:scale-105 transition-transform duration-500 cursor-zoom-in w-full"
                style={{ height: "auto" }}
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Column 2: Center Details */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <h1 className="text-2xl font-medium text-gray-900 leading-tight">{product.title}</h1>
            <Link href="/" className="text-sm text-[#007185] hover:underline hover:text-[#C7511F] cursor-pointer">
              Visit the Store
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500 text-sm">
                <Rating rating={avgRating} count={reviewCount} />
              </div>
              <span className="text-sm text-[#007185] hover:underline cursor-pointer hover:text-[#C7511F]">{reviewCount} ratings</span>
            </div>

            <div className="border-t border-b border-gray-200 py-3 my-2">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-600 mt-1">-5%</span>
                <div className="flex items-start">
                  <span className="text-sm relative top-1">₹</span>
                  <span className="text-3xl font-medium">{(product.price * 10).toLocaleString('en-IN').split('.')[0]}</span>
                  <span className="text-sm relative top-1">00</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              <p className="text-sm font-medium text-[#007185] mt-2 flex items-center gap-1 cursor-pointer hover:underline hover:text-[#C7511F]">
                EMI starts at ₹{Math.round(product.price * 10 / 12)}. No Cost EMI available
              </p>
            </div>

            <div className="flex gap-4 p-2">
              <div className="flex flex-col items-center justify-center gap-1 w-20">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-amazon_blue">
                  <img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB484059092_.png" className="w-8 h-8 object-contain" alt="Returns" />
                </div>
                <p className="text-xs text-center text-[#007185] leading-tight">7 days Service Centre Replacement</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 w-20">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-amazon_blue">
                  <img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB485933725_.png" className="w-8 h-8 object-contain" alt="Delivery" />
                </div>
                <p className="text-xs text-center text-[#007185] leading-tight">Free Delivery</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 w-20">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-amazon_blue">
                  <img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-warranty._CB485935626_.png" className="w-8 h-8 object-contain" alt="Warranty" />
                </div>
                <p className="text-xs text-center text-[#007185] leading-tight">1 Year Warranty</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-base mb-2">About this item</h3>
              <ul className="list-disc ml-5 flex flex-col gap-2">
                {product.description.split('.').map((sentence, index) =>
                  sentence.trim().length > 5 && (
                    <li key={index} className="text-sm text-gray-700 leading-snug">
                      {sentence.trim()}.
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Buy Box */}
          <div className="lg:col-span-1">
            <div className="w-full border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <div className="mb-2">
                <div className="flex items-start">
                  <span className="text-sm relative top-1">₹</span>
                  <span className="text-2xl font-medium">{(product.price * 10).toLocaleString('en-IN').split('.')[0]}</span>
                  <span className="text-sm relative top-1">00</span>
                </div>
                <div className="text-sm text-[#007185] hover:underline cursor-pointer flex items-center mt-2">
                  <span className="text-amazon_blue font-bold mr-1">✓prime</span>
                  One-Day
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                FREE delivery <strong>Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong>. Order within <span className="text-green-600">5 hrs 20 mins</span>.
              </p>

              <p className="text-lg text-green-700 font-medium mb-4">In Stock</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full h-8 bg-[#FFD814] border border-[#FCD200] rounded-full hover:bg-[#F7CA00] text-sm text-black shadow-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => window.location.href = '/cart'}
                  className="w-full h-8 bg-[#FFA41C] border border-[#FF8F00] rounded-full hover:bg-[#FA8900] text-sm text-black shadow-sm"
                >
                  Buy Now
                </button>
              </div>

              <div className="text-xs text-gray-600 mt-4 space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Ships from</span>
                  <span>Amazon</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Sold by</span>
                  <span className="text-[#007185] truncate">Appario Retail Private Ltd</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-10 border-t border-gray-300 pt-6">
          <h2 className="text-xl font-bold mb-4">Frequently bought together</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-32 h-32 border border-gray-200 rounded-md p-2 flex items-center justify-center">
              <img src={imgSrc} className="object-contain h-full w-full" alt="main item" onError={handleImageError} />
            </div>
            <span className="text-2xl text-gray-500">+</span>
            <div className="w-32 h-32 border border-gray-200 rounded-md p-2 flex items-center justify-center">
              <Image src="https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" width={100} height={100} className="object-contain h-full" alt="secondary item" />
            </div>
            <div className="ml-4">
              <p className="text-sm">Total price: <span className="text-red-700 font-bold">₹{(product.price * 10 + 500).toLocaleString('en-IN')}</span></p>
              <button className="mt-2 px-3 py-1 bg-[#FFD814] border border-[#FCD200] rounded-md text-xs shadow-sm">Add both to Cart</button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews-section" className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Rating rating={avgRating} count={0} size={20} />
                  <span className="text-lg font-bold">{avgRating > 0 ? avgRating.toFixed(1) : "No rating"} out of 5</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{reviewCount} global ratings</p>
                {/* Mock progress bars */}
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#C7511F] cursor-pointer mb-1">
                    <span className="w-12 whitespace-nowrap">{star} star</span>
                    <div className="w-full h-5 bg-gray-100 rounded-sm border border-gray-200 overflow-hidden">
                      <div className="h-full bg-[#FFA41C]" style={{ width: `${star === 5 ? 60 : star === 4 ? 20 : 5}%` }}></div>
                    </div>
                    <span className="w-8 text-right">{star === 5 ? '60%' : star === 4 ? '20%' : '5%'}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-2 text-sm">Review this product</h3>
                <p className="text-sm mb-4">Share your thoughts with other customers</p>
                <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <Reviews productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await res.json();
    const { additionalProducts } = await import('@/constants/mockData');

    // Combine API products and mock products
    const allProducts = [...products, ...additionalProducts];

    const paths = allProducts.map((product: ProductProps) => ({
      params: { id: product.id.toString() },
    }));

    return { paths, fallback: true };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    // Fallback to just mock products if API fails
    const { additionalProducts } = await import('@/constants/mockData');
    const paths = additionalProducts.map((product: ProductProps) => ({
      params: { id: product.id.toString() },
    }));
    return { paths, fallback: true };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    // Try to fetch from API first
    const res = await fetch(`https://fakestoreapi.com/products/${params.id}`);

    if (res.ok) {
      const product = await res.json();
      return {
        props: {
          product,
        },
        revalidate: 60,
      };
    }

    // If API fails or product not found, check mock data
    const { additionalProducts } = await import('@/constants/mockData');
    const mockProduct = additionalProducts.find(p => p.id.toString() === params.id);

    if (mockProduct) {
      return {
        props: {
          product: mockProduct,
        },
        revalidate: 60,
      };
    }

    // If not found in either source, return notFound
    return {
      notFound: true,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    // Final fallback: try to find in mock data
    try {
      const { additionalProducts } = await import('@/constants/mockData');
      const mockProduct = additionalProducts.find(p => p.id.toString() === params.id);

      if (mockProduct) {
        return {
          props: {
            product: mockProduct,
          },
          revalidate: 60,
        };
      }
    } catch (fallbackError) {
      console.error('Error loading mock data:', fallbackError);
    }

    return {
      notFound: true,
    };
  }
}


export default ProductDetails; 