import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState('');
    const { amount, orderId } = router.query;

    useEffect(() => {
        // Generate a random order number
        const randomOrder = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderNumber(orderId as string || randomOrder);
    }, [orderId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Success Icon Animation */}
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 10
                        }}
                        className="inline-block"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <motion.svg
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                className="w-16 h-16 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <motion.path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </motion.svg>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-4xl font-bold text-white mt-6"
                    >
                        Payment Successful!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white text-lg mt-2"
                    >
                        Thank you for your purchase
                    </motion.p>
                </div>

                {/* Order Details */}
                <div className="p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="space-y-6"
                    >
                        {/* Order Number */}
                        <div className="flex justify-between items-center border-b pb-4">
                            <span className="text-gray-600">Order Number</span>
                            <span className="font-bold text-lg text-gray-900">{orderNumber}</span>
                        </div>

                        {/* Amount */}
                        {amount && (
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-bold text-2xl text-green-600">₹{amount}</span>
                            </div>
                        )}

                        {/* Email Confirmation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-blue-900">Order confirmation sent</p>
                                    <p className="text-sm text-blue-700">Check your email for order details</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Success Message */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                        >
                            <p className="text-green-800">
                                <span className="font-semibold">Your order is confirmed!</span> We'll send you shipping updates as your package makes its way to you.
                            </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6 }}
                            className="flex flex-col sm:flex-row gap-4 pt-6"
                        >
                            <Link href={`/order-tracking?orderId=${orderNumber}`} className="flex-1">
                                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Track Your Order
                                </button>
                            </Link>

                            <Link href="/" className="flex-1">
                                <button className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-300">
                                    Continue Shopping
                                </button>
                            </Link>
                        </motion.div>

                        {/* Confetti Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ delay: 0.3, duration: 2, repeat: 2 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        x: Math.random() * window.innerWidth,
                                        y: -20,
                                        rotate: 0
                                    }}
                                    animate={{
                                        y: window.innerHeight + 100,
                                        rotate: 360
                                    }}
                                    transition={{
                                        delay: Math.random() * 0.5,
                                        duration: 2 + Math.random() * 2,
                                        ease: "linear"
                                    }}
                                    className="absolute"
                                    style={{
                                        width: Math.random() * 10 + 5,
                                        height: Math.random() * 10 + 5,
                                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
                                        borderRadius: Math.random() > 0.5 ? '50%' : '0%'
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
