import React from "react";
import ProductCard from "../../components/ProductCard.jsx";
import Test from "./test.jsx";


export default function HomePage() {
    // demo data (replace with real)
    const products = [
        { id: 1, name: "Deluxe Whole Cashews, Salted", price: "8.58", labelledPrice: "10.99", imageUrl: "/images/cashews.png" },
        { id: 2, name: "Lay's Potato Chips, Party Size", price: "4.48", labelledPrice: "5.59", imageUrl: "/images/lays.png" },
        { id: 3, name: "Tostitos Medium Salsa Con Queso", price: "4.48", labelledPrice: "7.49", imageUrl: "/images/salsa.png" },
        { id: 4, name: "Baked Snack Cheese Crackers", price: "8.98", labelledPrice: "10.50", imageUrl: "/images/cheezit.png" },
        { id: 5, name: "Organic Whole Cashews", price: "8.58", labelledPrice: "10.99", imageUrl: "/images/cashews.png" },
        { id: 6, name: "Lay's Chips Classic", price: "4.48", labelledPrice: "5.59", imageUrl: "/images/lays.png" },
    ];

    const categories = [
        "Fresh Fruits","Fresh Vegetables","Meat & Fish","Cooking Essentials","Bakery & Biscuits","Milk & Dairy",
        "Beverages","Household Needs","Personal Care","Health & Wellness","Snacks & Munchies","Spices & Masalas",
    ];

    return (
        <main className="bg-gray-50">
            {/* HERO */}
            <section className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center rounded-3xl bg-lime-50 overflow-hidden">
                    {/* Left: text */}
                    <div className="p-6 md:p-10">
            <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
              ALL NATURAL PRODUCTS
            </span>

                        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            Fresh and Healthy <span className="text-emerald-600">Veggies</span> Organic
                            <br className="hidden md:block" /> Market
                        </h1>

                        <p className="mt-3 text-gray-600 max-w-xl">
                            Pick from a curated selection of farm-fresh groceries delivered fast.
                        </p>

                        <div className="mt-6">
                            <button className="rounded-xl bg-emerald-600 text-white px-5 py-3 font-semibold hover:bg-emerald-700 transition">
                                Shop Now
                            </button>
                        </div>
                    </div>

                    {/* Right: hero art / image */}
                    <div className="relative h-60 md:h-[360px]">
                        {/* Replace with your hero image */}
                        <img
                            src="/images/hero-bag.png"
                            alt="Grocery bag"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* subtle overlay ring */}
                        <div className="absolute -right-10 -bottom-10 h-64 w-64 md:h-96 md:w-96 rounded-full bg-emerald-100/40 blur-3xl" />
                    </div>
                </div>
            </section>

            {/* TOP SAVER TODAY */}
            <section className="container mx-auto px-4 md:px-8 lg:px-12">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 pb-9">Top Saver Today</h2>
                <Test/>
            </section>

            {/* WIDE PROMO BANNER */}
            <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-10">
                <div className="relative rounded-3xl overflow-hidden bg-rose-50">
                    <div className="absolute inset-0 bg-[url('/images/promo-texture.png')] opacity-20" />
                    <div className="relative grid md:grid-cols-2 gap-6 items-center p-8 md:p-12">
                        <div>
              <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
                ALL BEAUTY PRODUCTS
              </span>
                            <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
                                Beauty &amp; Personal Care
                            </h3>
                            <p className="text-gray-600 mt-1">Up to <span className="text-emerald-600 font-semibold">70% Off</span></p>
                            <button className="mt-5 rounded-xl bg-emerald-600 text-white px-5 py-3 font-semibold hover:bg-emerald-700 transition">
                                Shop Now
                            </button>
                        </div>
                        <div className="h-40 md:h-56 relative">
                            <img
                                src="/images/promo-beauty.png"
                                alt="Beauty care"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURE BADGES */}
            <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {title:"Fastest Delivery",desc:"Get in 2 hours"},
                        {title:"Best Service",desc:"24/7 support"},
                        {title:"Verified Brands",desc:"100% genuine"},
                        {title:"100% Assurance",desc:"Quality checked"},
                    ].map((f,i)=>(
                        <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-200">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                {/* simple check icon */}
                                <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{f.title}</p>
                                <p className="text-sm text-gray-500">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* THREE PROMO TILES */}
            <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-10">
                <div className="grid md:grid-cols-3 gap-6">
                    <PromoTile
                        title="Fresh Fruits"
                        subtitle="up to 20% off"
                        color="bg-yellow-50"
                        img="/images/fruits.png"
                    />
                    <PromoTile
                        title="Healthy Vegetables"
                        subtitle="save 15%"
                        color="bg-green-50"
                        img="/images/vegetables.png"
                    />
                    <PromoTile
                        title="Crunchy Snacks"
                        subtitle="combo offers"
                        color="bg-sky-50"
                        img="/images/snacks.png"
                    />
                </div>
            </section>

            {/* BROWSE BY CATEGORY */}
            <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-12 mb-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Browse by Category</h2>
                    <button className="text-emerald-700 text-sm font-semibold hover:text-emerald-800">View All</button>
                </div>

                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {categories.map((c, idx) => (
                        <div
                            key={idx}
                            className="group rounded-2xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center hover:border-emerald-500 transition"
                        >
                            <div className="h-12 w-12 rounded-xl bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center">
                                {/* placeholder icon */}
                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M8 12h8M12 8v8" />
                                </svg>
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-800 text-center">{c}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

/** small helper for the three promo cards */
function PromoTile({ title, subtitle, color, img }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl ${color} border border-gray-200`}>
            <div className="p-6">
                <p className="text-lg font-bold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{subtitle}</p>
                <button className="mt-4 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition">
                    Shop Now
                </button>
            </div>
            <div className="absolute right-2 bottom-2 h-24 w-28 md:h-28 md:w-32">
                <img src={img} alt={title} className="h-full w-full object-contain" />
            </div>
        </div>
    );
}
