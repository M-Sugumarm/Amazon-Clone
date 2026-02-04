import React, { useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Link from "next/link";
import { ProductProps } from "../../type";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/nextSlice";

// Fallback placeholder image for broken images
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

interface Props {
    title: string;
    data: ProductProps[];
}

const CarouselItem = ({ item }: { item: ProductProps }) => {
    const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE);
    const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
        if (!hasError) {
            setImgSrc(FALLBACK_IMAGE);
            setHasError(true);
        }
    };

    return (
        <div className="min-w-[200px] max-w-[240px] cursor-pointer flex flex-col items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100">
            <Link href={`/product/${item.id}`} className="w-full h-full">
                <div className="h-[180px] w-full flex items-center justify-center bg-white mb-2 p-2">
                    <img
                        src={imgSrc}
                        alt={item.title}
                        className="h-full w-full object-contain"
                        onError={handleImageError}
                    />
                </div>
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#CC0C39] text-white text-xs px-2 py-1 font-bold rounded-sm">25% off</span>
                        <span className="text-[#CC0C39] font-bold text-xs">Deal of the Day</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2 text-gray-800 h-10 mb-1">{item.title}</p>
                    <p className="text-xl font-medium text-black">₹{(item.price * 10).toLocaleString('en-IN').split('.')[0]}</p>
                    <p className="text-xs text-gray-500 line-through">M.R.P.: ₹{(item.price * 10 * 1.25).toLocaleString('en-IN').split('.')[0]}</p>
                </div>
            </Link>
        </div>
    );
};

const ProductCarousel = ({ title, data }: Props) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const handleClick = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo =
                direction === "left"
                    ? scrollLeft - clientWidth
                    : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className="bg-white p-4 mb-8">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-black">{title}</h2>
                <a href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
                    See all deals
                </a>
            </div>
            <div className="group relative">
                <HiChevronLeft
                    className={`absolute top-0 bottom-0 left-0 z-40 m-auto h-12 w-10 cursor-pointer opacity-0 transition hover:bg-white/50 hover:text-gray-800 group-hover:opacity-100 bg-white shadow-md border-r border-gray-300 rounded-r-md`}
                    onClick={() => handleClick("left")}
                />

                <div
                    ref={rowRef}
                    className="flex items-center gap-4 overflow-x-scroll scrollbar-hide scroll-smooth px-4"
                >
                    {data.map((item) => (
                        <CarouselItem key={item.id} item={item} />
                    ))}
                </div>

                <HiChevronRight
                    className={`absolute top-0 bottom-0 right-0 z-40 m-auto h-12 w-10 cursor-pointer opacity-0 transition hover:bg-white/50 hover:text-gray-800 group-hover:opacity-100 bg-white shadow-md border-l border-gray-300 rounded-l-md`}
                    onClick={() => handleClick("right")}
                />
            </div>
        </div>
    );
};

export default ProductCarousel;
