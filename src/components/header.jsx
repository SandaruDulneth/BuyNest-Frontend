import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {FiLogIn, FiSearch} from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { useState, useEffect } from "react";
import GroceryMegaMenu from "./CategoryMenu.jsx";
import {jwtDecode} from "jwt-decode";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState("");


  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));


  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };


    useEffect(() => {
        updateCartCount();
        const tokenHandler = () => setToken(localStorage.getItem("token"));
        const cartHandler = () => updateCartCount();

        if (token && typeof token === "string" && token.trim() !== "") {
            try {
                const decoded = jwtDecode(token);
                setFirstName(decoded?.firstName || "");
            } catch (err) {
                console.error("Token decode failed:", err);
            }
        }
        window.addEventListener("storage", tokenHandler);
        window.addEventListener("cart-changed", cartHandler);
        return () => {
            window.removeEventListener("storage", tokenHandler);
            window.removeEventListener("cart-changed", cartHandler);
        };
    }, [token]);


    const handleHotDealsClick = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "top-saver" } });
    } else {
      const target = document.getElementById("top-saver");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `relative font-semibold transition-all duration-200 ${
      isActive
        ? "text-emerald-600 after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-emerald-600 after:rounded-full"
        : "text-gray-700 hover:text-emerald-600 hover:after:absolute hover:after:bottom-[-6px] hover:after:left-0 hover:after:w-full hover:after:h-[3px] hover:after:bg-emerald-400 hover:after:rounded-full"
    }`;

  return (
    <header className="w-full border-b border-gray-200 text-gray-700 font-poppins">
      {/* 🔹 Main Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-white">
        {/* Logo */}
        <NavLink to="/">
          <img src="/logo.svg" alt="logo" className="h-12" />
        </NavLink>

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
            <FiSearch size={18} />
          </button>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/cart"
            className="relative flex items-center gap-1 hover:text-green-600"
            >
            <BsCart3 size={22} /> Cart
            {/* dynamic cart count badge */}
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs px-1 rounded-full">
                {cartCount}
                </span>
            )}
            </NavLink>

            <NavLink
                to={token ? "/profile" : "/login"}
                className="flex items-center gap-2 hover:text-accent"
            >
                {token ? (
                    <>
                        <RxAvatar size={22} /> {firstName || "Profile"}
                    </>
                ) : (
                    <>
                        <FiLogIn size={22} /> Sign in
                    </>
                )}
            </NavLink>

        </div>
      </div>

      {/* 🔹 Bottom Nav + Top Strip */}
      <div className="w-full border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3 text-gray-800 text-[15px]">
          {/* Left side: Navigation */}
          <div className="flex items-center gap-8">
            <GroceryMegaMenu />

            <button
              onClick={handleHotDealsClick}
              className="relative font-semibold text-gray-700 hover:text-emerald-600 transition-all duration-200
                         hover:after:absolute hover:after:bottom-[-6px] hover:after:left-0 hover:after:w-full hover:after:h-[3px] hover:after:bg-emerald-400 hover:after:rounded-full"
            >
              Hot Deals
            </button>

            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>
            <NavLink to="/category/All" className={navLinkClasses}>
              Shop
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </div>

          {/* Right side: Top Strip */}
          <div className="flex gap-6 items-center text-sm">
            <p className="text-accent font-medium">
              <NavLink
                to="/contact"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 mx-2"
              >
                Need help?
              </NavLink>{" "}
              Call Us: <span className="font-semibold">+94 717557972</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
