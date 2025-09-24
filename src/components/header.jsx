import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import GroceryMegaMenu from "./CategoryMenu.jsx";


export default function Header() {
    return (
        <header className="w-full border-b border-gray-200 text-gray-700">
            {/* 🔹 Main Header */}
            <div className="flex items-center justify-between py-4 px-6 bg-white">
                {/* Logo */}
                <Link to="/">
                    <img src="/logo.svg" alt="logo" className="h-12" />
                </Link>

                {/* Search bar */}
                <form className="flex w-[50%] border border-accent rounded-lg overflow-hidden">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="flex-grow px-3 py-2 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-accent px-6 text-white hover:bg-green-600"
                    >
                        Search
                    </button>
                </form>

                {/* Right Side */}
                <div className="flex items-center gap-6">
                    <Link to="/cart" className="relative flex items-center gap-1 hover:text-green-600">
                        <BsCart3 size={22} /> Cart
                        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs px-1 rounded-full">
              0
            </span>
                    </Link>
                    <Link to="/login" className="flex items-center gap-1 hover:text-accent">
                        <RxAvatar size={22} /> Account
                    </Link>
                </div>
            </div>

            {/* 🔹 Bottom Nav + Top Strip combined */}
            <div className="w-full border-t border-gray-200 bg-white">
                <div className="flex items-center justify-between px-6 py-3 text-gray-800 text-[15px]">
                    {/* Left side: Navigation */}
                    <div className="flex items-center gap-8">

                        <GroceryMegaMenu />

                        {/* Keep links tidy; avoid giant padding gaps */}
                        <Link to="/deals" className="hover:text-green-600"><b>Hot Deals</b></Link>
                        <Link to="/" className="text-accent font-medium"><b>Home</b></Link>
                        <Link to="/about" className="hover:text-green-600"><b>About</b></Link>
                        <Link to="/shop" className="hover:text-green-600"><b>Shop</b></Link>
                        <Link to="/contact" className="hover:text-green-600"><b>Contact</b></Link>
                    </div>

                    {/* Right side: Top Strip content */}
                    <div className="flex gap-6 items-center text-sm">
                        <p className="text-accent font-medium">
                            Need help? Call Us: <span className="font-semibold">+94 717557972</span>
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
