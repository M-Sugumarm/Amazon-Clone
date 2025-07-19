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
      alert("Please sign in to checkout");
      return;
    }
    // Add checkout logic here
    router.push("/checkout");
  };

  const totalItems = productData.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <p>Subtotal ({totalItems} items):</p>
          <p className="font-semibold">
            <FormattedPrice amount={totalAmount} />
          </p>
        </div>
        <div className="flex justify-between">
          <p>Shipping:</p>
          <p className="text-green-600">Free</p>
        </div>
        <div className="flex justify-between border-t border-gray-400 pt-2 mt-2">
          <p className="font-bold">Order Total:</p>
          <p className="font-bold">
            <FormattedPrice amount={totalAmount} />
          </p>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full h-10 text-sm font-semibold bg-amazon_blue text-white rounded-lg hover:bg-amazon_yellow hover:text-black duration-300"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPayment;
