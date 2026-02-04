import logo from "../../images/logo.png"
import Image from "next/image"
import cartIcon from "../../images/cart.png";
import { BiCaretDown } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { SlLocationPin } from "react-icons/sl";
import { MdAdminPanelSettings } from "react-icons/md";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { stateProps } from "../../../type";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { addUser } from "@/store/nextSlice";
import { useRouter } from "next/router";

const Header = () => {
    const { data: session } = useSession();
    const { productData, favoriteData, userInfo } = useSelector(
        (state: stateProps) => state.next);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // Function to check if the user is an admin
    const isAdmin = (email?: string | null) => {
        if (!email) return false;
        return email === 'sugus7215@gmail.com' || email.endsWith('@admin.com');
    };

    useEffect(() => {
        if (session) {
            dispatch(addUser({
                name: session?.user?.name,
                email: session?.user?.email,
                image: session?.user?.image,
            }));
        }
    }, [session, dispatch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const allItems = [
        { _id: 100, title: "All Departments" },
        { _id: 101, title: "Alexa Skills" },
        { _id: 102, title: "Amazon Devices" },
        { _id: 103, title: "Amazon Fashion" },
        { _id: 104, title: "Amazon Pharmacy" },
        { _id: 105, title: "Appliances" },
        { _id: 106, title: "Apps & Games" },
        { _id: 107, title: "Audible Audiobooks" },
        { _id: 108, title: "Automotive" },
        { _id: 109, title: "Baby" },
        { _id: 110, title: "Beauty" },
        { _id: 111, title: "Books" },
        { _id: 112, title: "Computers" },
        { _id: 113, title: "Electronics" },
        { _id: 114, title: "Home & Kitchen" },
        { _id: 115, title: "Industrial & Scientific" },
        { _id: 116, title: "Kindle Store" },
        { _id: 117, title: "Luggage" },
        { _id: 118, title: "Movies & TV" },
        { _id: 119, title: "Music, CDs & Vinyl" },
        { _id: 120, title: "Pet Supplies" },
        { _id: 121, title: "Software" },
        { _id: 122, title: "Sports & Outdoors" },
        { _id: 123, title: "Tools & Home Improvement" },
        { _id: 124, title: "Toys & Games" },
        { _id: 125, title: "Video Games" },
    ];

    return (
        <div className="w-full h-20 bg-amazon_blue text-lightText sticky top-0 z-50">
            <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-4 ">
                {/* logo */}
                <Link href={"/"} className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 flex items-center justify-center h-[70%]">
                    <Image className="w-28 object-cover mt-1" src={logo} alt="logoImg" />
                </Link>
                {/* delivery */}
                <div className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 items-center justify-center h-[70%] hidden xl:inline-flex gap-1">
                    <SlLocationPin className="text-xl text-white" />
                    <div className="text-xs">
                        <p className="text-gray-300">Deliver to</p>
                        <p className="text-white font-bold uppercase">India</p>
                    </div>
                </div>
                {/* searchbar */}
                <form onSubmit={handleSearch} className="flex-1 h-10 hidden md:inline-flex items-center justify-between relative rounded-md overflow-hidden">
                    <div className="h-full w-auto p-1 text-sm bg-gray-100 border-r border-transparent text-black flex items-center justify-center cursor-pointer hover:bg-gray-200 duration-300 relative group">
                        <span className="px-2 flex items-center">
                            All <BiCaretDown className="text-xs text-gray-600 ml-1" />
                        </span>
                        {/* Simple Dropdown using Select for functionality */}
                        <select className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer">
                            {allItems.map((item) => (
                                <option key={item._id} value={item.title}>{item.title}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        className="w-full h-full px-2 placeholder:text-sm text-base text-black outline-none border-none"
                        type="text"
                        placeholder="Search Amazon"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-12 h-full bg-amazon_yellow hover:bg-[#f3a847] duration-300 text-black text-2xl flex items-center justify-center"
                    >
                        <HiOutlineSearch />
                    </button>
                </form>
                {/* signin */}
                {
                    userInfo ? (
                        <div className="flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1">
                            <Image
                                src={userInfo.image}
                                alt="userImage"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="text-xs text-gray-100 flex flex-col justify-between">
                                <p className="text-xs text-gray-300">Hello, {userInfo.name}</p>
                                <p className="text-white font-bold flex items-center">Account & Lists</p>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => signIn()} className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
                            <p className="text-gray-300">Hello, sign in</p>
                            <p className="text-white font-bold flex items-center">Account & Lists <BiCaretDown /></p>
                        </div>
                    )
                }

                {/* Admin link - only visible to admin users */}
                {session && isAdmin(session.user?.email) && (
                    <Link href="/admin" className="flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
                        <p className="text-xs text-gray-300">Admin</p>
                        <p className="text-white font-bold flex items-center">Panel <MdAdminPanelSettings className="text-lg ml-1" /></p>
                    </Link>
                )}

                {/* Returns & Orders */}
                {/* Returns & Orders */}
                <Link href="/orders" className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
                    <p className="text-gray-300">Returns</p>
                    <p className="text-white font-bold">& Orders</p>
                </Link>

                {/* cart */}
                <Link href={"/cart"} className="flex items-end px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative">
                    <Image className="w-auto object-cover h-8" src={cartIcon} alt="cartImg" />
                    <p className="text-xs text-white font-bold mt-3">Cart</p>
                    <span className="absolute text-amazon_yellow text-sm top-2 left-[29px] font-semibold">
                        {productData ? productData.length : 0}
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default Header;