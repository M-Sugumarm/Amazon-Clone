import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TrackingStep {
    id: number;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    icon: string;
}

const OrderTracking = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const [currentStep, setCurrentStep] = useState(2);
    const [animateProgress, setAnimateProgress] = useState(false);

    const trackingSteps: TrackingStep[] = [
        {
            id: 1,
            title: 'Order Confirmed',
            description: 'Your order has been received and confirmed',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            completed: true,
            icon: '📝'
        },
        {
            id: 2,
            title: 'Processing',
            description: 'Your order is being prepared for shipment',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            completed: true,
            icon: '📦'
        },
        {
            id: 3,
            title: 'Shipped',
            description: 'Your package is on its way',
            date: 'Expected: ' + new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: false,
            icon: '🚚'
        },
        {
            id: 4,
            title: 'Out for Delivery',
            description: 'Your package is out for delivery',
            date: 'Expected: ' + new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: false,
            icon: '🏃'
        },
        {
            id: 5,
            title: 'Delivered',
            description: 'Package delivered successfully',
            date: 'Expected: ' + new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: false,
            icon: '✅'
        }
    ];

    useEffect(() => {
        setAnimateProgress(true);
    }, []);

    const progressPercentage = ((currentStep) / trackingSteps.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                            <p className="text-gray-600">Order ID: <span className="font-semibold text-blue-600">{orderId || 'ORD-XXXXXXXXX'}</span></p>
                        </div>
                        <Link href="/">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors border border-gray-300">
                                Back to Home
                            </button>
                        </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Order Progress</span>
                            <span className="text-sm font-semibold text-blue-600">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: animateProgress ? `${progressPercentage}%` : 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Delivery Timeline</h2>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {trackingSteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative flex gap-6 mb-8 last:mb-0"
                            >
                                {/* Icon Circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${step.completed
                                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-white shadow-lg'
                                            : step.id === currentStep + 1
                                                ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-white shadow-lg animate-pulse'
                                                : 'bg-white border-gray-300'
                                        }`}
                                >
                                    <span className="text-2xl">{step.icon}</span>
                                </motion.div>

                                {/* Content */}
                                <div className={`flex-1 pb-8 ${!step.completed && step.id !== currentStep + 1 ? 'opacity-50' : ''}`}>
                                    <div className={`bg-gradient-to-r p-6 rounded-xl border ${step.completed
                                            ? 'from-green-50 to-emerald-50 border-green-200'
                                            : step.id === currentStep + 1
                                                ? 'from-blue-50 to-purple-50 border-blue-200'
                                                : 'from-gray-50 to-gray-100 border-gray-200'
                                        }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                                            {step.completed && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: index * 0.2 + 0.5 }}
                                                >
                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-2">{step.description}</p>
                                        <p className="text-sm text-gray-500 font-semibold">{step.date}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Estimated Delivery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">📅</div>
                            <div>
                                <p className="text-sm opacity-90">Estimated Delivery</p>
                                <p className="text-2xl font-bold">
                                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 }}
                        className="mt-8 flex flex-col sm:flex-row gap-4"
                    >
                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg">
                            Contact Support
                        </button>
                        <Link href="/orders" className="flex-1">
                            <button className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-300">
                                View All Orders
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Animated Delivery Truck */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="mt-8 text-center"
                >
                    <motion.div
                        animate={{
                            x: [0, 10, 0],
                            y: [0, -5, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                        className="inline-block text-6xl"
                    >
                        🚚💨
                    </motion.div>
                    <p className="mt-4 text-gray-600 font-semibold">Your package is on the way!</p>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderTracking;
