import React, { useState } from "react";
import { ProductProps } from "../../type";
import { HiShoppingCart } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart, addToFavorite } from "@/store/nextSlice";
import Link from "next/link";

// Fallback placeholder image for broken images
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23999'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }: { product: ProductProps }) => {
    const { id, title, price, description, category, image, rating = { rate: 0, count: 0 } } = product;
    const dispatch = useDispatch();
    const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);
    const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
        if (!hasError) {
            setImgSrc(FALLBACK_IMAGE);
            setHasError(true);
        }
    };

    return (
        <div className="w-full bg-white text-black p-4 border border-gray-200
            rounded-sm group overflow-hidden hover:shadow-lg transition-shadow duration-300 relative z-30">
            <div className="w-full h-[260px] relative mb-2 flex items-center justify-center bg-white p-2">
                <Link href={`/product/${id}`} className="w-full h-full flex items-center justify-center">
                    <img
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        src={imgSrc}
                        alt={title || "Product"}
                        onError={handleImageError}
                    />
                </Link>

                {/* Hover Actions */}
                <div className="w-12 h-20 absolute bottom-10 right-0 border-[1px] border-gray-400 bg-white rounded-md flex flex-col translate-x-20 group-hover:translate-x-0 transition-transform duration-300 shadow-md">
                    <span onClick={() => dispatch(
                        addToCart({
                            id: id,
                            title: title,
                            price: price,
                            description: description,
                            category: category,
                            image: image,
                            quantity: 1,
                            rating: rating
                        })
                    )} className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center 
                        text-xl bg-transparent hover:bg-amazon_yellow cursor-pointer duration-300
                        " title="Add to Cart"><HiShoppingCart /></span>
                    <span onClick={() => dispatch(
                        addToFavorite({
                            id: id,
                            title: title,
                            price: price,
                            description: description,
                            category: category,
                            image: image,
                            quantity: 1,
                            rating: rating
                        })
                    )} className="w-full h-full flex items-center justify-center 
                        text-xl bg-transparent hover:bg-amazon_yellow cursor-pointer duration-300
                        " title="Add to Wishlist"><FaHeart /></span>
                </div>
            </div>

            <div className="px-1 flex flex-col gap-1">
                <Link href={`/product/${id}`}>
                    <h2 className="text-base font-medium text-black hover:text-[#C7511F] cursor-pointer line-clamp-2 h-12 leading-tight">
                        {title}
                    </h2>
                </Link>

                {/* Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.round(rating.rate) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{rating.count}</span>
                </div>

                <p className="flex items-start text-sm mt-1">
                    <span className="text-xs relative top-[2px] mr-[1px]">₹</span>
                    <span className="text-2xl font-medium text-[#0F1111] leading-none">
                        {(price * 10).toLocaleString('en-IN').split('.')[0]}
                    </span>
                    <span className="text-xs relative top-[2px]">00</span>
                </p>

                <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-[#007185]">✓prime</span>
                    <span className="text-xs text-gray-500">One-Day</span>
                </div>

                <p className="text-xs text-[#565959] mb-3">FREE Delivery by Amazon</p>

                <button onClick={() => dispatch(
                    addToCart({
                        id: id,
                        title: title,
                        price: price,
                        description: description,
                        category: category,
                        image: image,
                        quantity: 1,
                        rating: rating
                    })
                )} className="h-8 font-medium bg-amazon_yellow text-black rounded-full hover:bg-[#F7CA00] 
                    duration-300 mt-auto border border-yellow-500 shadow-sm text-sm">Add to Cart</button>
            </div>
        </div>
    );
};

const Products = ({ productData }: any) => {
    return (
        <div className="w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productData.map((product: ProductProps) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default Products;