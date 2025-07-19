import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import FormattedPrice from '@/components/FormattedPrice';

const SuccessPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const orderDoc = await getDoc(doc(db, 'orders', orderId as string));
          if (orderDoc.exists()) {
            setOrderDetails(orderDoc.data());
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon_blue"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <Link href="/" className="text-amazon_blue hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Order ID:</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-600">Order Date:</p>
              <p className="font-medium">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p>{orderDetails.shippingAddress.fullName}</p>
              <p>{orderDetails.shippingAddress.address}</p>
              <p>
                {orderDetails.shippingAddress.city},{' '}
                {orderDetails.shippingAddress.state}{' '}
                {orderDetails.shippingAddress.zipCode}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-contain"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-gray-600">
                      Qty: {item.quantity} x <FormattedPrice amount={item.price} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <FormattedPrice amount={orderDetails.totalAmount} />
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <FormattedPrice amount={orderDetails.totalAmount} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="bg-amazon_blue text-white px-6 py-2 rounded-lg hover:bg-amazon_yellow hover:text-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;