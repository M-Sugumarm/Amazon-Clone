import React from "react";
import Image from "next/image";
import logo from "../images/logo.png";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="w-full bg-amazon_light text-white">
            {/* Back to Top */}
            <div
                onClick={scrollToTop}
                className="w-full h-12 bg-amazon_blue_light hover:bg-[#485769] transition-colors duration-300 cursor-pointer flex items-center justify-center"
            >
                <p className="text-sm font-medium">Back to top</p>
            </div>

            {/* Main Footer Links */}
            <div className="w-full bg-amazon_light py-10 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Get to Know Us</h3>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">About Us</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Careers</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Press Releases</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Amazon Science</p>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Connect with Us</h3>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Facebook</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Twitter</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Instagram</p>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Make Money with Us</h3>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Sell on Amazon</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Sell under Amazon Accelerator</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Protect and Build Your Brand</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Amazon Global Selling</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Become an Affiliate</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Fulfilment by Amazon</p>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-base mb-2">Let Us Help You</h3>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">COVID-19 and Amazon</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Your Account</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Returns Centre</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">100% Purchase Protection</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Amazon App Download</p>
                        <p className="text-gray-300 text-sm hover:underline cursor-pointer">Help</p>
                    </div>
                </div>
            </div>

            {/* Bottom Divider Line */}
            <div className="w-full border-t border-gray-600 py-8 bg-amazon_light flex flex-col items-center justify-center gap-4">
                <div className="w-24">
                    <Image className="w-full object-cover" src={logo} alt="Logo" />
                </div>
                <div className="flex gap-4 items-center">
                    <div className="border border-gray-400 px-4 py-1 rounded flex items-center gap-2 cursor-pointer hover:border-white">
                        <p className="text-sm text-gray-300">English</p>
                    </div>
                </div>
            </div>

            {/* Copyright Area */}
            <div className="w-full bg-[#131A22] py-8">
                <div className="max-w-5xl mx-auto flex flex-col items-center justify-center px-4">
                    <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs text-gray-300">
                        <span className="hover:underline cursor-pointer">Conditions of Use & Sale</span>
                        <span className="hover:underline cursor-pointer">Privacy Notice</span>
                        <span className="hover:underline cursor-pointer">Interest-Based Ads</span>
                    </div>
                    <p className="text-xs text-gray-300">© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;