import React, { useEffect, useState } from "react";
import { SiMediamarkt } from "react-icons/si";
import { FaAsterisk, FaShieldAlt, FaLock, FaCreditCard, FaMoneyBillWave, FaArrowLeft, FaArrowRight, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import FormattedPrice from "./FormattedPrice";
import { useSelector, useDispatch } from "react-redux";
import { stateProps, Address, StoreProduct, OrderItemDetails, PaymentInfo } from "../../type";
import { loadStripe } from "@stripe/stripe-js";
import { resetCart } from "@/store/nextSlice";
import { db } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const CartPayment = () => {
  const { productData } = useSelector((state: stateProps) => state.next);
  const [totalAmount, setTotalAmount] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    let amt = 0;
    productData.forEach((item: any) => {
      amt += item.price * item.quantity;
    });
    setTotalAmount(amt);
  }, [productData]);

  const handleCheckout = () => {
    if (!session) {
      // Mock sign in for now or redirect
      router.push("/api/auth/signin");
      return;
    }
    router.push("/checkout");
  };

  const totalItems = productData.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <div className="flex flex-col gap-4 bg-white p-4">
      <div className="flex flex-col gap-2">
        {/* Free Delivery Progress Mock */}
        <div className="text-sm">
          <span className="text-green-700 font-medium">Part of your order qualifies for FREE Delivery.</span>
          <span className="text-gray-500 ml-1">Select this option at checkout. Details</span>
        </div>

        <div className="flex items-center gap-2 text-lg font-medium mt-2">
          <span>Subtotal ({totalItems} items):</span>
          <span className="font-bold">
            <FormattedPrice amount={totalAmount * 10} />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm">This order contains a gift</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full h-10 text-sm font-medium bg-[#FFD814] border border-[#FCD200] rounded-lg hover:bg-[#F7CA00] shadow-sm mt-2 text-black"
      >
        Proceed to Buy
      </button>

      {/* EMI Mock */}
      <div className="border border-gray-300 rounded-md p-3 mt-4">
        <p className="text-sm font-semibold">EMI Available</p>
        <p className="text-sm text-gray-500 mt-1">Your order qualifies for EMI with valid credit cards (not available on purchase of Gold/Jewelry, Gift cards and Amazon pay balance top up). <span className="text-[#007185] hover:underline cursor-pointer">Learn more</span></p>
      </div>
    </div>
  );
};

export default CartPayment;
