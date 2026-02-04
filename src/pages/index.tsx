import HeaderBottom from "@/components/header/HeaderBottom";
import Header from "@/components/header/Header"
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import Products from "@/components/Products";
import { ProductProps } from "../../type"
import ProductCarousel from "@/components/ProductCarousel";

interface Props {
  productData: ProductProps[];
}


// ... (imports remain the same, adding additionalProducts)
import { additionalProducts } from "@/constants/mockData";
import { GetServerSideProps } from "next";

interface Props {
  productData: ProductProps[];
}

export default function Home({ productData }: Props) {
  // ... (component logic remains the same)
  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <Banner />
        <div className="relative w-full z-20 mb-10">
          {/* Wrapper to fix negative margin issue if product count is low */}
          <div className="w-full px-4 mx-auto -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-60 xl:-mt-72 pb-10">
            {/* Category Grid Overlay - Only show on main home page (no filter) or if specific categories are not selected? 
                For simplicity, we keep it, but maybe hide it if products count is small? 
                Let's keep it for now as it's part of the layout. 
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              {/* Card 1: Electronics (Quad) */}
              <div className="bg-white z-30 p-4 flex flex-col justify-between cursor-pointer h-full shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-4">Keep shopping for</h2>
                <div className="grid grid-cols-2 gap-2 h-[300px]">
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[8]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="HDD" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">HDD</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[9]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="SSD" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">SSD</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[10]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="Power" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">Power</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[11]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="Display" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">Display</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2 hover:underline">See more</p>
              </div>

              {/* Card 2: Fashion (Quad) */}
              <div className="bg-white z-30 p-4 flex flex-col justify-between cursor-pointer h-full shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-4">Deals in Fashion</h2>
                <div className="grid grid-cols-2 gap-2 h-[300px]">
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[0]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="Tops" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">Tops</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[1]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="Casual" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">Casual</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[2]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="Jackets" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">Jackets</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50"><img className="max-h-full max-w-full object-contain" src={productData[3]?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect fill='%23f0f0f0' width='110' height='110'/%3E%3C/svg%3E"} alt="Jeans" /></div>
                    <span className="text-xs text-black mt-1 line-clamp-1">Jeans</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2 hover:underline">Shop now</p>
              </div>

              {/* Card 3: Home & Kitchen (Quad) */}
              <div className="bg-white z-30 p-4 flex flex-col justify-between cursor-pointer h-full shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-4">Refresh your space</h2>
                <div className="grid grid-cols-2 gap-2 h-[300px]">
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50">
                      <img className="max-h-full max-w-full object-contain" src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=200&q=80" alt="Dining" />
                    </div>
                    <span className="text-xs text-black mt-1">Dining</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50">
                      <img className="max-h-full max-w-full object-contain" src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80" alt="Home" />
                    </div>
                    <span className="text-xs text-black mt-1">Home</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50">
                      <img className="max-h-full max-w-full object-contain" src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&q=80" alt="Kitchen" />
                    </div>
                    <span className="text-xs text-black mt-1">Kitchen</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <div className="h-[110px] w-full flex items-center justify-center p-1 bg-gray-50">
                      <img className="max-h-full max-w-full object-contain" src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80" alt="Health" />
                    </div>
                    <span className="text-xs text-black mt-1">Health</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2 hover:underline">See more</p>
              </div>

              {/* Card 4: Sign In Experience or Product */}
              <div className="bg-white z-30 p-4 flex flex-col justify-between cursor-pointer h-full shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-4">Deals in PCs</h2>
                <div className="relative w-full h-[300px]">
                  <img className="w-full h-full object-contain" src={productData[13]?.image || "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"} alt="Gaming" />
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2 hover:underline">See all offers</p>
              </div>
            </div>

            {/* Main Products Grid */}
            <div className="relative z-30 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Top Products For You</h2>
              <Products productData={productData} />
            </div>

            {/* Interactive Carousels */}
            <div className="mt-10 max-w-screen-2xl mx-auto px-4 relative z-30 space-y-8">
              <ProductCarousel title="Today's Deals" data={productData.slice(0, 8)} />
              <ProductCarousel title="Best Sellers in Electronics" data={productData.slice(5, 15)} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { category } = context.query;
    console.log("Fetching product data from API...");
    const res = await fetch("https://fakestoreapi.com/products");

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const apiData: ProductProps[] = await res.json();

    // Combine API data with Mock Data
    const combinedData = [...apiData, ...additionalProducts];

    let filteredData = combinedData;

    // Filter Logic
    if (category && typeof category === 'string') {
      console.log(`Filtering for category: ${category}`);
      if (category === "Best Sellers") {
        // Mock logic for best sellers: just show everything or random selection
        filteredData = combinedData;
      } else if (category === "New Releases") {
        // Mock logic: Show last 10
        filteredData = combinedData.slice(-10);
      } else if (category === "Todays Deals") {
        // Mock logic: Show random slice
        filteredData = combinedData.slice(0, 8);
      } else {
        filteredData = combinedData.filter(item =>
          item.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    console.log(`Returning ${filteredData.length} products`);

    return { props: { productData: filteredData } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        productData: [],
      }
    };
  }
}