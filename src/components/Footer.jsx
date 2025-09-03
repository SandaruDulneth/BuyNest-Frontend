import React from "react";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 mt-16 border-t border-gray-200">
      {/* Links */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Company Info */}
        <div className="col-span-2 md:col-span-1">
          <img src="/logo.svg" alt="Logo" className="h-10 mb-4" />
          <p className="text-sm">
            Mihisara Grocery.<br />
            A2, Hikkaduwa, Sri Lanka.
          </p>
          <p className="mt-3 text-emerald-600 font-semibold">+94 717557972</p>
          <p className="text-xs text-gray-500">(8.00 a.m to 8.00 p.m daily)</p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-semibold mb-3 text-gray-900">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-600">Home</a></li>
            <li><a href="#" className="hover:text-emerald-600">Catalogue & Deals</a></li>
            <li><a href="#" className="hover:text-emerald-600">Track my order</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h5 className="font-semibold mb-3 text-gray-900">Categories</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-600">Grocery</a></li>
            <li><a href="#" className="hover:text-emerald-600">Beverages</a></li>
            <li><a href="#" className="hover:text-emerald-600">Household</a></li>
            <li><a href="#" className="hover:text-emerald-600">Vegetables</a></li>
            <li><a href="#" className="hover:text-emerald-600">Fruits</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h5 className="font-semibold mb-3 text-gray-900">Useful Links</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-600">Privacy Notice</a></li>
            <li><a href="#" className="hover:text-emerald-600">FAQ</a></li>
            <li><a href="#" className="hover:text-emerald-600">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-emerald-600">Stores</a></li>
            <li><a href="#" className="hover:text-emerald-600">Delivery grid</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h5 className="font-semibold mb-3 text-gray-900">Customer Service</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-600">Contact us</a></li>
            <li><a href="#" className="hover:text-emerald-600">About us</a></li>
          </ul>
        </div>
      </div>

      {/* Social + Payments */}
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-200">
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="#" className="text-gray-600 hover:text-emerald-600"><FaFacebookF /></a>
          <a href="#" className="text-gray-600 hover:text-emerald-600"><FaTwitter /></a>
          <a href="#" className="text-gray-600 hover:text-emerald-600"><FaYoutube /></a>
        </div>
        <p className="text-xs text-gray-500">© 2025 Mihisara Grocery. All Rights Reserved</p>
        <div className="flex gap-2">
          <img src="/visa.png" alt="Visa" className="h-6" />
          <img src="/master.png" alt="MasterCard" className="h-6" />
        </div>
      </div>
    </footer>
  );
}
