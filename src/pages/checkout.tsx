import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { resetCart } from '@/store/nextSlice';
import FormattedPrice from '@/components/FormattedPrice';
import { db } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { StoreProduct, stateProps } from '../../type';

interface FormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const { productData } = useSelector((state: stateProps) => state.next);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = productData.reduce(
    (total: number, item: StoreProduct) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session?.user?.email) {
      setError('Please sign in to place an order');
      return;
    }

    // Basic validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        setError(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        return;
      }
    }

    try {
      setIsProcessing(true);

      // Create order object
      const orderData = {
        userEmail: session.user.email,
        userName: formData.fullName,
        items: productData.map((item: StoreProduct) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentInfo: {
          cardLast4: formData.cardNumber.slice(-4),
          expiryDate: formData.expiryDate,
        },
        orderStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Clear cart
      dispatch(resetCart());

      // Redirect to success page
      router.push(`/success?orderId=${docRef.id}`);
    } catch (error) {
      setError('An error occurred while placing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full border rounded-lg p-2"
                    maxLength={16}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full border rounded-lg p-2"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amazon_blue text-white py-3 rounded-lg mt-6 hover:bg-amazon_yellow hover:text-black transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {productData.map((item: StoreProduct) => (
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
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <FormattedPrice amount={totalAmount} />
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <FormattedPrice amount={totalAmount} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 