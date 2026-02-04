import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { resetCart } from '@/store/nextSlice';
import FormattedPrice from '@/components/FormattedPrice';
import { db } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { StoreProduct, stateProps } from '../../type';
import { FaCheck } from 'react-icons/fa';
import Image from "next/image";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const { productData } = useSelector((state: stateProps) => state.next);
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Payment, 3: Review

  // Mock Data
  const savedAddress = {
    name: session?.user?.name || "User Name",
    street: "123 Green Avenue, Apt 4B",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560001",
    phone: "9876543210"
  };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = productData.reduce(
    (total: number, item: StoreProduct) => total + item.price * item.quantity,
    0
  ) * 10;

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      // Create order object
      const orderData = {
        userEmail: session?.user?.email || "guest@example.com",
        userName: session?.user?.name || "Guest",
        items: productData,
        totalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      dispatch(resetCart());
      router.push(`/success?orderId=${docRef.id}`);
    } catch (error) {
      console.error("Order failed", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="max-w-screen-lg mx-auto py-4">
        <div className="flex items-center justify-between mb-4 px-4">
          <h1 className="text-2xl font-normal text-black">Checkout</h1>
          <div className="text-gray-600 text-sm">
            <span className="text-[#007185] cursor-pointer hover:underline">Items</span>
            <span className="mx-2 text-[#007185] cursor-pointer hover:underline">Returns</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          {/* Left Column: Accordion Steps */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Step 1: Delivery Address */}
            <div className={`bg-white border rounded-md overflow-hidden ${activeStep === 1 ? "border-[#D5D9D9]" : "border-gray-200"}`}>
              <div className={`p-4 flex justify-between ${activeStep === 1 ? "bg-[#F0F2F2]" : ""}`}>
                <h2 className={`font-bold text-lg ${activeStep > 1 ? "text-gray-500" : "text-black"}`}>
                  1. Delivery address
                </h2>
                {activeStep > 1 && (
                  <div className="text-sm">
                    <p className="font-bold">{savedAddress.name}</p>
                    <p className="text-gray-600 line-clamp-1">{savedAddress.street}, {savedAddress.city}...</p>
                    <span onClick={() => setActiveStep(1)} className="text-[#007185] hover:underline cursor-pointer block mt-1 hover:text-[#C7511F]">Change</span>
                  </div>
                )}
              </div>
              {activeStep === 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 mb-4">
                    <input type="radio" checked readOnly className="mt-1 w-4 h-4 text-[#C7511F] focus:ring-[#C7511F]" />
                    <div>
                      <p className="font-bold">{savedAddress.name} <span className="text-xs font-normal text-gray-500">Default</span></p>
                      <p className="text-sm text-gray-700">{savedAddress.street}</p>
                      <p className="text-sm text-gray-700">{savedAddress.city}, {savedAddress.state} {savedAddress.zip}</p>
                      <p className="text-sm text-gray-700">Phone: {savedAddress.phone}</p>
                      <span className="text-sm text-[#007185] hover:underline cursor-pointer mt-1 block">Add delivery instructions</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="bg-[#FFD814] border border-[#FCD200] rounded-md px-4 py-1.5 text-sm shadow-sm hover:bg-[#F7CA00]"
                  >
                    Use this address
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`bg-white border rounded-md overflow-hidden ${activeStep === 2 ? "border-[#D5D9D9]" : "border-gray-200"}`}>
              <div className={`p-4 flex justify-between ${activeStep === 2 ? "bg-[#F0F2F2]" : ""}`}>
                <h2 className={`font-bold text-lg ${activeStep !== 2 ? "text-gray-500" : "text-black"}`}>
                  2. Payment method
                </h2>
                {activeStep > 2 && (
                  <div className="text-sm text-right">
                    <p className="font-bold">Paying with Card ending in 3456</p>
                    <span onClick={() => setActiveStep(2)} className="text-[#007185] hover:underline cursor-pointer hover:text-[#C7511F]">Change</span>
                  </div>
                )}
              </div>
              {activeStep === 2 && (
                <div className="p-4 border-t border-gray-200 pl-8">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 border border-orange-200 bg-orange-50 p-3 rounded-md">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-[#C7511F]"
                      />
                      <span className="font-bold text-sm">Credit or debit card</span>
                      <div className="flex gap-2 ml-auto">
                        {/* Mock Card Icons */}
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="ml-6 grid gap-2">
                      <input type="text" placeholder="Card number" className="border p-2 rounded w-60 text-sm" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="MM/YY" className="border p-2 rounded w-20 text-sm" />
                        <input type="text" placeholder="CVV" className="border p-2 rounded w-16 text-sm" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-[#C7511F]"
                      />
                      <span className="font-bold text-sm">Cash on Delivery / Pay on Delivery</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="bg-[#FFD814] border border-[#FCD200] rounded-md px-4 py-1.5 text-sm shadow-sm hover:bg-[#F7CA00] mt-4"
                  >
                    Use this payment method
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Review Items */}
            <div className={`bg-white border rounded-md overflow-hidden ${activeStep === 3 ? "border-[#D5D9D9]" : "border-gray-200"}`}>
              <div className={`p-4 ${activeStep === 3 ? "bg-[#F0F2F2]" : ""}`}>
                <h2 className={`font-bold text-lg ${activeStep !== 3 ? "text-gray-500" : "text-black"}`}>
                  3. Review items and delivery
                </h2>
              </div>
              {activeStep === 3 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex flex-col gap-4">
                    {productData.map((item: StoreProduct) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4">
                        <Image src={item.image} width={60} height={60} className="object-contain" alt="product" />
                        <div>
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-sm text-[#B12704] font-bold">
                            <FormattedPrice amount={item.price * 10} />
                          </p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-xs text-gray-600 font-bold">Sold by: Appario Retail Private Ltd</p>
                        </div>
                        <div className="ml-auto text-sm">
                          <p className="text-green-700 font-bold">Arriving Tomorrow</p>
                          <p className="text-xs text-gray-500">Free Amazon Delivery</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-gray-50 p-4 border rounded-md flex justify-between items-center">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-[#FFD814] border border-[#FCD200] rounded-md px-6 py-2 shadow-sm hover:bg-[#F7CA00] font-md text-sm"
                    >
                      {isProcessing ? "Placing Order..." : "Place your order"}
                    </button>

                    <div className="text-right">
                      <p className="text-[#B12704] font-bold text-lg">Order Total: <FormattedPrice amount={totalAmount} /></p>
                      <p className="text-xs text-gray-500">By placing your order, you agree to Amazon's <span className="text-[#007185]">Privacy Notice</span> and <span className="text-[#007185]">Conditions of Use</span>.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-md p-4 sticky top-4">
              <button
                onClick={handlePlaceOrder}
                disabled={activeStep !== 3 || isProcessing}
                className={`w-full py-2 rounded-md shadow-sm text-sm border font-medium mb-4 ${activeStep === 3 ? "bg-[#FFD814] border-[#FCD200] hover:bg-[#F7CA00]" : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"}`}
              >
                {isProcessing ? "Processing..." : "Place your order"}
              </button>

              <h3 className="font-bold text-lg mb-2">Order Summary</h3>
              <div className="text-sm flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span><FormattedPrice amount={totalAmount} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span><FormattedPrice amount={totalAmount} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Promotion Applied:</span>
                  <span>-₹0.00</span>
                </div>
                <div className="border-t my-2 pt-2 flex justify-between text-[#B12704] font-bold text-lg">
                  <span>Order Total:</span>
                  <span><FormattedPrice amount={totalAmount} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 