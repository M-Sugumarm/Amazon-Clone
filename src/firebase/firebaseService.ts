export const getProductReviews = async (productId: string) => {
  try {
    // Create a reference to the reviews collection
    const reviewsRef = collection(db, 'reviews');
    
    // First try to fetch with ordering (which requires the index)
    try {
      const q = query(
        reviewsRef,
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Successfully fetched ${reviews.length} reviews for product ${productId}`);
      return reviews;
    } catch (indexError) {
      // If there's an index error, fall back to a simpler query without sorting
      if (indexError instanceof Error && indexError.message.includes('index')) {
        console.warn("Index not found for sorted reviews query. Falling back to unsorted query.");
        
        // Simpler query that doesn't require composite index
        const fallbackQuery = query(
          reviewsRef,
          where('productId', '==', productId)
        );
        
        const querySnapshot = await getDocs(fallbackQuery);
        let reviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort the reviews in memory instead
        reviews = reviews.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        
        console.log(`Successfully fetched ${reviews.length} reviews for product ${productId} (unsorted query)`);
        return reviews;
      } else {
        // If it's another error, rethrow it
        throw indexError;
      }
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}; 