import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProductProps } from '../../type';
import Products from '@/components/Products';
import { useDispatch } from 'react-redux';
import { setAllProducts } from '@/store/nextSlice';

const SearchPage = ({ allProducts }: { allProducts: ProductProps[] }) => {
  const router = useRouter();
  const { q } = router.query;
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    dispatch(setAllProducts(allProducts));
  }, [dispatch, allProducts]);

  useEffect(() => {
    if (q && allProducts?.length > 0) {
      const searchQuery = q.toString().toLowerCase();
      const filtered = allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [q, allProducts]);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-10">
      <div className="pb-4 mb-6 border-b">
        <h1 className="text-xl font-bold">
          {filteredProducts.length > 0
            ? `Search results for: "${q}" (${filteredProducts.length} results found)`
            : `No results found for: "${q}"`}
        </h1>
      </div>
      
      {filteredProducts.length > 0 && <Products productData={filteredProducts} />}
      
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center my-10">
          <p className="text-lg mb-4">No products match your search criteria.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-amazon_blue text-white py-2 px-6 rounded hover:bg-amazon_yellow hover:text-black transition-all"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch('https://fakestoreapi.com/products');
  const allProducts = await res.json();

  return {
    props: {
      allProducts,
    },
  };
}

export default SearchPage; 