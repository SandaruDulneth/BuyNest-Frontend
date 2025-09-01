import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductsByCategory from "../../components/ProductsByCategory";

const heroImages = [
  "../../public/images/slide1.jpg",
  "../../public/images/slide2.jpg",
  "../../public/images/slide3.jpg",
  "../../public/images/slide4.jpg",
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  // Auto slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000); // change every 3s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-full bg-white">
      {/* 🔹 Hero Section */}
      <section className="bg-green-50 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 leading-snug">
            Healthy Living <br /> Starts with Fresh Picks
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Save up to 50% off on your first order
          </p>
        </div>

        {/* Slideshow */}
        <div className="relative w-full md:w-3/4 h-96 md:h-[500px] overflow-hidden rounded-lg">
          <img
            src={heroImages[current]}
            alt="hero slide"
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* Navigation dots */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${
                  current === i ? "bg-green-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Featured Categories */}
      <section className="px-8 md:px-16 py-10 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Categories</h2>

        {/* Scroll container */}
        <div
          id="category-slider"
          className="flex gap-6 scroll-smooth overflow-hidden"
        >
          {[
            { name: "Cake & Milk", img: "../../public/images/deal5.png", },
            { name: "Organic Kiwi", img: "../../public/images/deal5.png", },
            { name: "Peach", img: "../../public/images/deal5.png" },
            { name: "Snacks", img: "../../public/images/deal5.png" },
            { name: "Vegetables", img: "../../public/images/deal5.png" },
            { name: "Coffee & Tea", img: "../../public/images/deal5.png"},
            { name: "Burgers", img: "../../public/images/deal5.png" },
            { name: "Fresh Fruits", img: "../../public/images/deal5.png" },
            { name: "Juices", img: "../../public/images/deal5.png" },
            { name: "Bakery", img: "../../public/images/deal5.png" },
          ].map((cat, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-1/5 bg-white rounded-lg shadow hover:shadow-md p-4 flex flex-col items-center text-center cursor-pointer"
            >
              <img src={cat.img} alt={cat.name} className="h-20 mb-3 object-contain" />
              <p className="font-medium text-gray-700">{cat.name}</p>
            </div>
          ))}
        </div>

        {/* Left Button */}
        <button
          onClick={() => {
            document.getElementById("category-slider").scrollBy({
              left: -window.innerWidth * 0.25, // scroll by ~2.5 cards
              behavior: "smooth",
            });
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
        >
          ◀
        </button>

        {/* Right Button */}
        <button
          onClick={() => {
            document.getElementById("category-slider").scrollBy({
              left: window.innerWidth * 0.25, // scroll by ~2.5 cards
              behavior: "smooth",
            });
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
        >
          ▶
        </button>
      </section>


      {/* 🔹 Promo Banners */}
      <section className="px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-100 rounded-lg p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-3">
            Everyday Fresh & Clean with Our Products
          </h3>
          <Link to="/shop" className="bg-green-600 text-white px-4 py-2 rounded-md w-fit">
            Shop Now
          </Link>
        </div>
        <div className="bg-pink-100 rounded-lg p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-3">
            Make your Breakfast Healthy and Easy
          </h3>
          <Link to="/shop" className="bg-green-600 text-white px-4 py-2 rounded-md w-fit">
            Shop Now
          </Link>
        </div>
        <div className="bg-green-100 rounded-lg p-6 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-3">
            The best Organic Products Online
          </h3>
          <Link to="/shop" className="bg-green-600 text-white px-4 py-2 rounded-md w-fit">
            Shop Now
          </Link>
        </div>
      </section>

      {/* 🔹 Popular Products (Burgers only) */}
      <section className="px-8 md:px-16 py-10 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Popular Products - Burgers 🍔
        </h2>
        <ProductsByCategory category="Burgers" />
      </section>
    </div>
  );
}
