import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { stateProps } from "../../../type";
import { signOut } from "next-auth/react";
import { removeUser } from "@/store/nextSlice";
import Link from "next/link";
import HeaderSidebar from "./HeaderSidebar";

const HeaderBottom = () => {
    const { userInfo } = useSelector(
        (state: stateProps) => state.next);
    const dispatch = useDispatch();
    const [sidebar, setSidebar] = useState(false);

    const handleSignOut = () => {
        signOut();
        dispatch(removeUser());
    }

    const navItems = [
        { title: "Todays Deals", href: "/?category=Todays Deals" },
        { title: "Amazon miniTV", href: "/" }, // Placeholder
        { title: "Sell", href: "/" }, // Placeholder
        { title: "Best Sellers", href: "/?category=Best Sellers" },
        { title: "Mobiles", href: "/?category=Mobiles" },
        { title: "Customer Service", href: "/" }, // Placeholder
        { title: "Electronics", href: "/?category=Electronics" },
        { title: "New Releases", href: "/?category=New Releases" },
        { title: "Home & Kitchen", href: "/?category=Home & Kitchen" },
        { title: "Fashion", href: "/?category=Fashion" },
        { title: "Amazon Pay", href: "/" },
    ];

    return (
        <div className="w-full h-10 bg-amazon_light text-sm text-white px-4 flex items-center relative">
            {/* All Menu Trigger */}
            <p onClick={() => setSidebar(true)} className="flex items-center gap-1 h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300">
                <LuMenu className="text-xl" /> All
            </p>

            {/* Sidebar Component */}
            {sidebar && <HeaderSidebar setSidebar={setSidebar} />}

            {/* Mapped Nav Items */}
            <div className="hidden md:flex items-center overflow-x-auto scrollbar-hide">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="flex items-center h-8 px-2 border border-transparent hover:border-white cursor-pointer duration-300 whitespace-nowrap"
                    >
                        {item.title}
                    </Link>
                ))}
            </div>

            {/* Sign Out Button - Pushed to right or kept inline? Amazon usually keeps it in "Account & Lists" dropdown but user had it here */}
            {userInfo && (
                <button
                    onClick={handleSignOut}
                    className="ml-auto hidden md:inline-flex flex items-center gap-1 h-8 px-2 border border-transparent hover:border-red-600 hover:text-red-500 text-amazon_yellow cursor-pointer duration-300"
                >
                    Sign Out
                </button>
            )}
        </div>
    );
};

export default HeaderBottom;