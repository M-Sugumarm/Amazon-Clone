import HeaderBottom from "@/components/header/HeaderBottom";
import Header from "@/components/header/Header"
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import Products from "@/components/Products";
import {ProductProps} from "../../type"

interface Props{
  productData: ProductProps;
}

export default function Home({productData}: Props) {
  console.log(productData);
  return (
    <main>
      
      <div className="max-w-screen-2xl mx-auto">
        <Banner/>
        <div className="relative md:-mt020 lgl:-mt-32 xl:-mt-60 z-20 mb-10">
        <Products productData={productData}/>
        </div>
      </div>
      
    </main>
  );
}


export const getServerSideProps = async() =>{
  try {
    console.log("Fetching product data from API...");
    const res = await fetch("https://fakestoreapi.com/products");
    
    if (!res.ok) {
      // Handle HTTP errors
      console.error(`API responded with status: ${res.status}`);
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    
    const productData = await res.json();
    console.log(`Successfully fetched ${productData.length} products from API`);
    
    return {props: {productData}};
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    
    // Return empty array as fallback when API is down
    return {
      props: {
        productData: [],
        error: error instanceof Error ? error.message : "Unknown error occurred while fetching products"
      }
    };
  }
}