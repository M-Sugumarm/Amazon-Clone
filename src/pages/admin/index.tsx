import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Order, OrderItemDetails } from '../../../type';
import Link from 'next/link';
import { getAllOrders, saveOrder } from '@/services/firebaseService';
import { displayAdminWarning, logTestOrderCreation } from '@/utils/displayWarning';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase';

const AdminPanel = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingTestOrder, setCreatingTestOrder] = useState(false);

  // Function to check if the user is an admin
  const isAdmin = (email?: string | null) => {
    if (!email) return false;
    return email === 'sugus7215@gmail.com' || email.endsWith('@admin.com');
  };

  useEffect(() => {
    // Wait for authentication to complete
    if (status === 'loading') return;
    
    if (status === 'authenticated') {
      if (!isAdmin(session?.user?.email)) {
        router.push('/');
      } else {
        // Display warnings for development mode
        displayAdminWarning();
        
        // Fetch orders only if authenticated as admin
        fetchOrders();
      }
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch orders using the Firebase service
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Function to create a test order for development purposes
  const createTestOrder = async () => {
    if (!session?.user?.email) return;
    
    setCreatingTestOrder(true);
    try {
      // Sample order data
      const testItems: OrderItemDetails[] = [
        {
          id: 1,
          title: "Test Product 1",
          price: 19.99,
          quantity: 2,
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
          category: "electronics",
          description: "Test product description"
        },
        {
          id: 2,
          title: "Test Product 2",
          price: 29.99,
          quantity: 1,
          image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
          category: "clothing",
          description: "Another test product"
        }
      ];
      
      const testOrder = {
        userId: session.user.email,
        userName: session.user.name || 'Test User',
        items: testItems,
        totalAmount: 69.97,
        shippingAddress: {
          fullName: "Test User",
          streetAddress: "123 Test Street",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "Test Country",
          phoneNumber: "1234567890"
        },
        billingAddress: {
          fullName: "Test User",
          streetAddress: "123 Test Street",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "Test Country",
          phoneNumber: "1234567890"
        },
        paymentMethod: "Credit Card",
        status: "processing",
        createdAt: new Date().toISOString(),
        paymentInfo: {
          cardType: "Visa",
          cardLastFour: "4242"
        }
      };
      
      // Save to Firestore directly
      const orderRef = await addDoc(collection(db, 'orders'), testOrder);
      console.log("Test order created with ID:", orderRef.id);
      
      // Log the test order creation
      logTestOrderCreation(orderRef.id);
      
      // Refresh orders list
      await fetchOrders();
      
    } catch (error) {
      console.error("Error creating test order:", error);
      setError("Failed to create test order");
    } finally {
      setCreatingTestOrder(false);
    }
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon_blue"></div>
        <p className="ml-3">Loading...</p>
      </div>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!session || !isAdmin(session.user?.email)) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-xl font-bold text-red-600 mb-2">Access Denied</div>
        <p className="text-gray-600">You don't have permission to access this page.</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 bg-amazon_blue text-white px-4 py-2 rounded hover:bg-amazon_blue/80"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Error message if fetch failed */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchOrders} 
            className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        
        <Link href="/admin/products" className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <p className="text-3xl font-bold">Manage</p>
        </Link>
        
        <Link href="/admin/reviews" className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          <p className="text-3xl font-bold">View All</p>
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <div className="flex gap-2">
            <button 
              onClick={fetchOrders}
              className="px-3 py-1 bg-amazon_blue text-white rounded text-sm hover:bg-amazon_blue/80"
            >
              Refresh
            </button>
            {orders.length === 0 && (
              <button 
                onClick={createTestOrder}
                disabled={creatingTestOrder}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {creatingTestOrder ? 'Creating...' : 'Create Test Order'}
              </button>
            )}
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No orders found</p>
            <p className="text-sm text-gray-400 mb-6">Orders placed by customers will appear here</p>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-2">For development purposes, you can create a test order to see how orders are displayed.</p>
              <button 
                onClick={createTestOrder}
                disabled={creatingTestOrder}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {creatingTestOrder ? 'Creating Test Order...' : 'Create Test Order'}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link 
                        href={`/admin/orders/${order.id}`} 
                        className="text-amazon_blue hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 