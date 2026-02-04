import React from "react";
import { useSelector } from "react-redux";
import { StoreProduct, stateProps } from "../../type";
import CartProduct from "@/components/CartProduct";
import Link from "next/link";
import CartPayment from "@/components/CartPayment";
import FormattedPrice from "@/components/FormattedPrice";

const CartPage = () => {
    const { productData } = useSelector((state: stateProps) => state.next);
    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-8 bg-[#EAEDED] min-h-screen">
            {
                productData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="bg-white col-span-4 p-6 rounded-sm shadow-sm">
                            <div className="flex items-center justify-between border-b-[1px] border-b-gray-200 pb-2">
                                <h1 className="text-2xl font-medium text-black">Shopping Cart</h1>
                                <p className="text-sm text-gray-600 hidden md:block">Price</p>
                            </div>
                            <div className="pt-2 flex flex-col pt-4">
                                {
                                    productData.map((item: StoreProduct) => (
                                        <div key={item.id}>
                                            <CartProduct item={item} />
                                        </div>
                                    ))
                                }
                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <div className="text-right">
                                        <span className="text-lg">Subtotal ({productData.length} items): </span>
                                        <span className="text-lg font-bold">
                                            <FormattedPrice amount={productData.reduce((acc: number, item: StoreProduct) => acc + item.price * item.quantity, 0) * 10} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="bg-white p-4 rounded-sm shadow-sm lg:sticky lg:top-24 h-auto">
                                <CartPayment />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white h-auto col-span-5 flex flex-col items-center justify-center py-10 rounded-sm shadow-sm">
                        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 p-4">
                            <img
                                src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg"
                                alt="Empty Cart"
                                className="w-80 h-auto"
                            />
                            <div className="flex flex-col items-center md:items-start bg-white">
                                <h1 className="text-2xl font-bold text-black mb-2">Your Amazon Cart is empty</h1>
                                <Link href="/" className="text-[#007185] hover:text-[#C7511F] hover:underline mb-4 text-sm">
                                    Shop today&apos;s deals
                                </Link>
                                <div className="flex gap-4">
                                    {!productData && (
                                        <button className="bg-[#FFD814] border border-[#FCD200] rounded-md px-4 py-1.5 text-sm shadow-sm hover:bg-[#F7CA00]">
                                            Sign in to your account
                                        </button>
                                    )}
                                    <Link href="/">
                                        <button className="border border-gray-300 rounded-md px-4 py-1.5 text-sm shadow-sm hover:bg-gray-50">
                                            Sign up now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default CartPage;
