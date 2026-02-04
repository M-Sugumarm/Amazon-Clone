import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import FormattedPrice from '@/components/FormattedPrice';
import Image from 'next/image';
import Link from 'next/link';

const OrdersPage = () => {
    const { data: session } = useSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (session?.user?.email) {
                try {
                    const q = query(
                        collection(db, 'orders'),
                        where('userEmail', '==', session.user.email)
                        // Note: Requires index for compound query if we add orderBy('createdAt', 'desc')
                        // For now, we'll sort client-side or assume default order if index not ready
                    );

                    const querySnapshot = await getDocs(q);
                    const ordersData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    })) as any[];

                    // Client-side sort by date desc
                    ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    setOrders(ordersData);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session]);

    if (loading) {
        return (
            <div className="w-full flex flex-col gap-6 items-center justify-center py-20">
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-3xl font-normal">Your Orders</h1>
            </div>

            {/* Tabs Mock */}
            <div className="flex items-center gap-6 border-b border-gray-300 mb-6 text-sm">
                <span className="font-bold border-b-2 border-[#C7511F] pb-2 cursor-pointer text-black">Orders</span>
                <span className="text-[#007185] cursor-pointer pb-2 hover:text-[#C7511F] hover:underline">Buy Again</span>
                <span className="text-[#007185] cursor-pointer pb-2 hover:text-[#C7511F] hover:underline">Not Yet Shipped</span>
                <span className="text-[#007185] cursor-pointer pb-2 hover:text-[#C7511F] hover:underline">Cancelled Orders</span>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-lg">You have no orders yet.</p>
                    <Link href="/">
                        <button className="mt-4 bg-[#FFD814] border border-[#FCD200] rounded-md px-4 py-1.5 text-sm shadow-sm hover:bg-[#F7CA00]">Continue Shopping</button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {orders.map((order: any) => (
                        <div key={order.id} className="border border-gray-300 rounded-md bg-white">
                            {/* Order Header */}
                            <div className="bg-[#F0F2F2] p-4 flex flex-col md:flex-row justify-between text-sm text-gray-600 rounded-t-md border-b border-gray-300 gap-4">
                                <div className="flex gap-8">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs uppercase">Order Placed</span>
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs uppercase">Total</span>
                                        <span className="text-black"><FormattedPrice amount={order.totalAmount} /></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs uppercase">Ship To</span>
                                        <span className="text-[#007185] cursor-pointer hover:underline relative group">
                                            {order.userName}
                                            {/* Tooltip mock could go here */}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-xs uppercase">Order # {order.id}</span>
                                    <div className="flex gap-2 text-[#007185]">
                                        <span className="cursor-pointer hover:underline">View order details</span>
                                        <span className="border-l border-gray-400 pl-2 cursor-pointer hover:underline">Invoice</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2">Arriving Tomorrow</h3>
                                    <div className="flex flex-col gap-6">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex gap-4">
                                                <Image src={item.image} width={90} height={90} alt={item.title} className="object-contain" />
                                                <div className="flex flex-col gap-1">
                                                    <Link href={`/product/${item.id}`}>
                                                        <p className="text-[#007185] hover:underline hover:text-[#C7511F] font-medium line-clamp-2 cursor-pointer">{item.title}</p>
                                                    </Link>
                                                    <p className="text-xs text-gray-500">Return window closed on {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                                                    <div className="mt-1">
                                                        <button className="bg-[#FFD814] border border-[#FCD200] rounded-md px-3 py-1 text-xs shadow-sm hover:bg-[#F7CA00]">Buy it again</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <button className="w-full bg-white border border-gray-300 rounded-md py-1.5 text-sm shadow-sm hover:bg-gray-50 text-black">Track package</button>
                                    <button className="w-full bg-white border border-gray-300 rounded-md py-1.5 text-sm shadow-sm hover:bg-gray-50 text-black">Write a product review</button>
                                    <button className="w-full bg-white border border-gray-300 rounded-md py-1.5 text-sm shadow-sm hover:bg-gray-50 text-black">Leave seller feedback</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
