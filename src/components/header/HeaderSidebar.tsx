import React from "react";
import { IoMdClose } from "react-icons/io";
import { HiUserCircle } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { motion } from "framer-motion";

interface Props {
    setSidebar: (value: boolean) => void;
}

const HeaderSidebar = ({ setSidebar }: Props) => {
    return (
        <div className="w-full h-full fixed top-0 left-0 bg-transparent z-50 flex">
            {/* Animated Sidebar */}
            <motion.div
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-[80%] md:w-[350px] h-full bg-white border-r border-black/20"
            >
                <div className="w-full bg-amazon_light text-white py-3 px-6 flex items-center gap-4">
                    <HiUserCircle className="text-3xl" />
                    <h3 className="font-bold text-lg tracking-wide">Hello, Sign In</h3>
                </div>
                <div className="h-[calc(100vh-60px)] overflow-y-scroll scrollbar-hide py-4">

                    {/* Section 1: Trending */}
                    <div className="border-b border-gray-300 pb-4">
                        <h3 className="text-lg font-bold px-6 mb-2">Trending</h3>
                        <ul className="text-sm font-medium text-black">
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">Best Sellers</li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">New Releases</li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">Movers and Shakers</li>
                        </ul>
                    </div>

                    {/* Section 2: Digital Content */}
                    <div className="border-b border-gray-300 py-4">
                        <h3 className="text-lg font-bold px-6 mb-2">Digital Content & Devices</h3>
                        <ul className="text-sm font-medium text-black">
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Amazon Music <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Kindle E-readers & Books <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Amazon Appstore <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                        </ul>
                    </div>

                    {/* Section 3: Shop By Category */}
                    <div className="border-b border-gray-300 py-4">
                        <h3 className="text-lg font-bold px-6 mb-2">Shop By Category</h3>
                        <ul className="text-sm font-medium text-black">
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Electronics <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Computers <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Smart Home <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">
                                Arts & Crafts <MdKeyboardArrowRight className="text-xl text-gray-500" />
                            </li>
                        </ul>
                    </div>
                    {/* Section 4: Help */}
                    <div className="py-4">
                        <h3 className="text-lg font-bold px-6 mb-2">Help & Settings</h3>
                        <ul className="text-sm font-medium text-black">
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">Your Account</li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">Customer Service</li>
                            <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 cursor-pointer">Sign In</li>
                        </ul>
                    </div>
                </div>
                <div
                    onClick={() => setSidebar(false)}
                    className="absolute top-2 -right-10 w-10 h-10 text-white flex items-center justify-center cursor-pointer"
                >
                    <IoMdClose className="text-4xl" />
                </div>
            </motion.div>

            {/* Overlay Close */}
            <div
                onClick={() => setSidebar(false)}
                className="w-full h-full bg-black/80 cursor-pointer"
            ></div>
        </div>
    );
};

export default HeaderSidebar;
