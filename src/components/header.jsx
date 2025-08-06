import {Link, NavLink} from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
    const [sideDrawerOpened, setSideDrawerOpened] = useState(false);

    return (
        <header className="w-full h-[65px] shadow-md flex items-center justify-between px-4 bg-[#0b2f00] text-white relative font-light">

            <div className="flex items-center gap-4">
                <GiHamburgerMenu
                    className="text-3xl md:hidden cursor-pointer"
                    onClick={() => setSideDrawerOpened(true)}
                />
                <img
                    src="/logo.svg"
                    alt="logo"
                    className="h-11 object-cover cursor-pointer"
                />
            </div>


            <nav className="hidden md:flex items-center gap-6 text-lg">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "text-[#ffdd55] " : "hover:text-green-400"}>Home</NavLink>

                <NavLink to="/products"
                    className={({ isActive }) =>
                        isActive ? "text-[#ffdd55] " : "hover:text-green-400"}>BuyNest Products</NavLink>

                <NavLink to="/about" className={({ isActive }) =>
                        isActive ? "text-[#ffdd55] " : "hover:text-green-400"}>About Us</NavLink>

                <NavLink to="/contact" className={({ isActive }) =>
                        isActive ? "text-[#ffdd55] " : "hover:text-green-400"}>Contact Us</NavLink>


                <form className="flex items-center bg-[#ffdd55] rounded-[10px] overflow-hidden ml-4 font-light">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-2 py-1 text-black outline-none w-35"
                    />
                    <button
                        type="submit"
                        className="px-2 text-gray-700 hover:text-green-600"
                        aria-label="Search"
                    >
                        <FiSearch size={22} />
                    </button>
                </form>
            </nav>


            <div className="hidden md:flex items-center">
                <Link to="/cart" className="text-2xl text-white hover:text-green-400">
                    <BsCart3 />
                </Link>
            </div>


            {sideDrawerOpened && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="w-[250px] h-full bg-white text-black p-4 flex flex-col gap-4">

                        <div className="flex items-center justify-between mb-6">
                            <img
                                src="/logo.svg"
                                alt="logo"
                                className="w-10 h-10 object-cover w-fit "
                            />
                            <GiHamburgerMenu
                                className="text-2xl cursor-pointer"
                                onClick={() => setSideDrawerOpened(false)}
                            />
                        </div>


                        <a href="/" className="hover:text-green-600">Home</a>
                        <a href="/products" className="hover:text-green-600">Products</a>
                        <a href="/about" className="hover:text-green-600">About</a>
                        <a href="/contact" className="hover:text-green-600">Contact</a>
                        <a href="/cart" className="text-2xl mt-2">
                            <BsCart3 />
                        </a>


                        <form className="mt-4 flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="flex-grow px-2 py-1 outline-none"
                            />
                            <button
                                type="submit"
                                className="px-2 text-gray-700 hover:text-green-600"
                                aria-label="Search"
                            >
                                <FiSearch size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}
