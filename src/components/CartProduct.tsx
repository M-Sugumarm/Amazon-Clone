import React, { useState } from "react";
import FormattedPrice from "./FormattedPrice";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  deleteProduct,
  increaseQuantity,
} from "@/store/nextSlice";
import { StoreProduct } from "../../type";

// Fallback placeholder image for broken images
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

interface cartProductProps {
  item: StoreProduct;
}

const CartProduct = ({ item }: cartProductProps) => {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setImgSrc(FALLBACK_IMAGE);
      setHasError(true);
    }
  };

  return (
    <div className="bg-white rounded-lg flex items-start gap-4 border-b-[1px] border-gray-200 py-6">
      <div className="min-w-[150px] min-h-[150px] flex items-center justify-center">
        <img
          className="object-contain w-[150px] h-[150px]"
          src={imgSrc}
          alt={item.title || "product"}
          onError={handleImageError}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium text-black line-clamp-2 max-w-2xl text-[#007185] hover:underline cursor-pointer">
              {item.title}
            </p>
            <p className="text-sm text-green-700 font-semibold">In Stock</p>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500 font-semibold">Eligibility</span>
              <span className="text-sm text-gray-600">for FREE Shipping</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-900">This is a gift <span className="text-[#007185] hover:underline cursor-pointer">Learn more</span></span>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <span className="font-bold">Style:</span>
              <span>{item.category}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold">Color:</span>
              <span>Black</span>
            </div>
          </div>

          <div className="text-xl font-bold text-gray-900 text-right">
            <FormattedPrice amount={item.price * 10} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {/* Quantity Dropdown Mock */}
          <div className="flex items-center bg-[#F0F2F2] border border-[#D5D9D9] rounded-md shadow-sm h-8 px-2 hover:bg-[#E3E6E6] cursor-pointer text-sm">
            <span className="mr-2">Qty: {item.quantity}</span>
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#007185]">
            <span
              onClick={() => dispatch(deleteProduct(item.id))}
              className="cursor-pointer hover:underline"
            >
              Delete
            </span>
            <span className="w-[1px] h-3 bg-gray-300"></span>
            <span className="cursor-pointer hover:underline">Save for later</span>
            <span className="w-[1px] h-3 bg-gray-300"></span>
            <span className="cursor-pointer hover:underline">See more like this</span>
            <span className="w-[1px] h-3 bg-gray-300"></span>
            <span className="cursor-pointer hover:underline">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;