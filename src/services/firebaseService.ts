import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { Review, Order, ProductProps } from '../../type';
import { getAuth } from 'firebase/auth';

/**
 * FirebaseService - A service to handle all Firestore operations
 */

// Reviews
export const saveReview = async (reviewData: Omit<Review, 'id'>): Promise<string> => {
  try {
    const reviewWithTimestamp = {
      ...reviewData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'reviews'), reviewWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};

export const getReviewsByProductId = async (productId: number): Promise<Review[]> => {
  try {
    // Try to fetch with sorting first, which requires the composite index
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as Review);
      });
      
      return reviews;
    } catch (indexError) {
      // Fall back to a simpler query without sorting if we get an index error
      console.warn("Index error in reviews query. Falling back to unsorted query:", indexError);
      
      // Simple query that doesn't require a composite index
      const fallbackQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      );
      
      const querySnapshot = await getDocs(fallbackQuery);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as Review);
      });
      
      // Sort the reviews in memory
      reviews.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      return reviews;
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return empty array instead of throwing to improve user experience
    return [];
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Orders
export const saveOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    console.log("Fetching all orders from Firebase...");
    
    // Remove Firebase auth check since we're using Next.js authentication
    // Instead, the admin check should happen in the component that calls this function
    
    // Create the query
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    // Log the query for debugging
    console.log("Executing orders query:", q);
    
    // Execute the query with better error handling
    const querySnapshot = await getDocs(q).catch(error => {
      console.error("Firebase query error:", error);
      if (error.code === 'permission-denied') {
        console.error("This appears to be a permissions issue. Please check Firebase rules.");
      }
      throw error;
    });
    
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Handle both server timestamps and ISO strings
      const createdAt = data.createdAt 
        ? (typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt) 
        : new Date().toISOString();
        
      orders.push({
        id: doc.id,
        ...data,
        createdAt,
      } as Order);
    });
    
    console.log(`Successfully fetched ${orders.length} orders`);
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Products
export const getCustomProducts = async (): Promise<ProductProps[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products: ProductProps[] = [];
    
    productsSnapshot.forEach((doc) => {
      products.push({ id: parseInt(doc.id), ...doc.data() } as ProductProps);
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching custom products:', error);
    return [];
  }
};

export const saveOrUpdateProduct = async (product: ProductProps): Promise<boolean> => {
  try {
    const productRef = doc(db, 'products', product.id.toString());
    
    // Check if the product document exists
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      // Update existing document
      await setDoc(productRef, { ...productDoc.data(), ...product }, { merge: true });
    } else {
      // Create new document
      await setDoc(productRef, { ...product });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving product:', error);
    return false;
  }
};

export default {
  saveReview,
  getReviewsByProductId,
  getAllReviews,
  deleteReview,
  saveOrder,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatus,
  getCustomProducts,
  saveOrUpdateProduct
}; 