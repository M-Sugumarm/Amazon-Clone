import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ProductProps } from '../../../type';
import Image from 'next/image';
import Link from 'next/link';
import FormattedPrice from '@/components/FormattedPrice';
import { db } from '@/firebase';
import { collection, doc, getDoc, setDoc, query, getDocs } from 'firebase/firestore';
import { getCustomProducts, saveOrUpdateProduct } from '@/services/firebaseService';

const AdminProducts = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<ProductProps>>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    isActive: true,
    rating: { rate: 0, count: 0 }
  });
  
  // Function to check if the user is an admin
  const isAdmin = (email?: string | null) => {
    if (!email) return false;
    return email === 'sugus7215@gmail.com' || email.endsWith('@admin.com');
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (!isAdmin(session?.user?.email)) {
        router.push('/');
      } else {
        fetchProducts();
      }
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
            
      // Fetch the latest products from API
      const res = await fetch('https://fakestoreapi.com/products');
      const apiProducts = await res.json();
      
      // Get any custom products from Firestore
      const customProducts = await getCustomProducts();
      
      // Merge API products with any custom products (custom products will override API products with same ID)
      const mergedProducts = [...apiProducts];
      
      for (const customProduct of customProducts) {
        const index = mergedProducts.findIndex(p => p.id === customProduct.id);
        if (index !== -1) {
          mergedProducts[index] = customProduct;
        } else {
          mergedProducts.push(customProduct);
        }
      }
      
      // Save to state
      setProducts(mergedProducts);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product: ProductProps, isActive: boolean) => {
    try {
      // Create updated product object
      const updatedProduct = { ...product, isActive };
      
      // Update product in Firestore
      await saveOrUpdateProduct(updatedProduct);
      
      // Update in local state
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? updatedProduct : p
        )
      );
      
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!newProduct.title || !newProduct.description || !newProduct.image || !newProduct.category) {
        alert('Please fill out all required fields');
        return;
      }
      
      // Generate a new ID (higher than existing products to avoid conflicts)
      const highestId = Math.max(...products.map(p => p.id), 0);
      const productToAdd = {
        ...newProduct,
        id: highestId + 1,
        price: Number(newProduct.price),
      } as ProductProps;
      
      // Save to Firestore
      await saveOrUpdateProduct(productToAdd);
      
      // Add to local state
      setProducts([...products, productToAdd]);
      
      // Reset form and close modal
      setNewProduct({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: '',
        isActive: true,
        rating: { rate: 0, count: 0 }
      });
      setShowAddModal(false);
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading products...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
          >
            Add New Product
          </button>
          <Link 
            href="/admin"
            className="bg-amazon_blue text-white px-4 py-2 rounded hover:bg-amazon_yellow hover:text-black transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Men's Clothing</option>
                    <option value="women's clothing">Women's Clothing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 relative">
                      <Image 
                        src={product.image} 
                        alt={product.title}
                        fill
                        sizes="100vw"
                        className="object-contain"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    <div className="text-sm font-medium text-gray-900 truncate" title={product.title}>
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <FormattedPrice amount={product.price * 10} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.isActive === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.isActive === false ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleActive(product, product.isActive === false ? true : false)}
                      className={`text-white px-3 py-1 rounded mr-2 
                        ${product.isActive === false 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {product.isActive === false ? 'Activate' : 'Deactivate'}
                    </button>
                    <Link 
                      href={`/admin/products/edit/${product.id}`}
                      className="text-amazon_blue hover:underline mr-2"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/product/${product.id}`}
                      target="_blank"
                      className="text-gray-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts; 