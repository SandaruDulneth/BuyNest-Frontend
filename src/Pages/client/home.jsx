import React from "react";
import ProductsByCategory from "../../components/ProductsByCategory";
import Footer from "../../components/Footer";
import Slider from "../../components/Slider";
import {
  Apple,
  Carrot,
  Beef,
  ChefHat,
  Cookie,
  Milk,
  CupSoda,
  BrushCleaning,
  HeartPlus,
  PillBottle,
  Grape,
  Soup,
} from "lucide-react";

export default function HomePage() {
  // categories with icons
  const categories = [
    { name: "Fresh Fruits", icon: Apple },
    { name: "Fresh Vegetables", icon: Carrot },
    { name: "Meat & Fish", icon: Beef },
    { name: "Cooking Essentials", icon: ChefHat },
    { name: "Bakery & Biscuits", icon: Cookie },
    { name: "Milk & Dairy", icon: Milk },
    { name: "Beverages", icon: CupSoda },
    { name: "Household Needs", icon: BrushCleaning },
    { name: "Personal Care", icon: HeartPlus },
    { name: "Health & Wellness", icon: PillBottle },
    { name: "Snacks & Munchies", icon: Grape },
    { name: "Spices & Masalas", icon: Soup },
  ];

  return (
    <>
      <main className="bg-gray-50">
        {/* HERO (Image Slider) */}
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
          <div className="relative rounded-3xl overflow-hidden h-120">
            <div className="w-full h-full relative">
              <Slider />
            </div>
          </div>
        </section>

        {/* TOP SAVER TODAY */}
        <section className="container mx-auto px-4 md:px-8 lg:px-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 pb-9">
            Top Saver Today
          </h2>
          <ProductsByCategory
            category="Offers"
            apiBase="http://localhost:5000"
          />
        </section>

        {/* WIDE PROMO BANNER */}
        <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-10">
          <div className="relative rounded-3xl overflow-hidden bg-rose-50">
            <div className="absolute inset-0 bg-[url('/images/promo-texture.png')] opacity-20" />

            <div className="relative grid md:grid-cols-2 items-stretch">
              {/* Left column (text) */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
                  ALL BEAUTY PRODUCTS
                </span>
                <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
                  Beauty &amp; Personal Care
                </h3>
                <p className="text-gray-600 mt-1">
                  Up to{" "}
                  <span className="text-emerald-600 font-semibold">
                    70% Off
                  </span>
                </p>
                <button className="mt-5 rounded-xl bg-emerald-600 text-white px-5 py-3 font-semibold hover:bg-emerald-700 transition">
                  Shop Now
                </button>
              </div>

              {/* Right column (background image) */}
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: "url('/images/beuty.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>
        </section>

        {/* FEATURE BADGES */}
        <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Fastest Delivery", desc: "Get in 2 hours" },
              { title: "Best Service", desc: "24/7 support" },
              { title: "Verified Brands", desc: "100% genuine" },
              { title: "100% Assurance", desc: "Quality checked" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-gray-200"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
              bgImg="/images/fruits.jpg"
            />
            <PromoTile
              title="Healthy Vegetables"
              subtitle="save 15%"
              bgImg="/images/vegetables.jpg"
            />
            <PromoTile
              title="Crunchy Snacks"
              subtitle="combo offers"
              bgImg="/images/snacks.jpg"
            />
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="container mx-auto px-4 md:px-8 lg:px-12 mt-12 mb-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <button className="text-emerald-700 text-sm font-semibold hover:text-emerald-800">
              View All
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center hover:border-emerald-500 transition"
                >
                  <div className="h-14 w-14 rounded-xl bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-gray-500 group-hover:text-emerald-600" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-800 text-center">
                    {c.name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

/** small helper for the three promo cards */
function PromoTile({ title, subtitle, bgImg }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-gray-200 h-48 md:h-56 flex items-center"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="p-6 bg-black/20 w-full h-full flex flex-col justify-center rounded-3xl">
        <p className="text-2xl font-bold text-white">{title}</p>
        <p className="text-md text-gray-100">{subtitle}</p>
        <button className="mt-4 w-fit rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition">
          Shop Now
        </button>
      </div>
    </div>
  );
}
