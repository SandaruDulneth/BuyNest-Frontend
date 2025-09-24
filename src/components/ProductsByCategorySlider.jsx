import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductsByCategorySlider({
  category,
  apiBase = "http://localhost:5000",
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/products/category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
        });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [category, apiBase]);

  if (loading) {
    return <p className="text-gray-600">Loading {category}...</p>;
  }

  if (products.length === 0) {
    return <p className="text-gray-600">No products found in <b>{category}</b></p>;
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    rows: 2,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2, rows: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, rows: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, rows: 1 } },
    ],
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute -left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-accent text-white p-2 hover:bg-emerald-700"
      >
        ‹
      </button>

      <Slider ref={sliderRef} {...settings}>
        {products.map((p) => (
          <div key={p._id || p.productId} className="p-2">
            <ProductCard product={p} />
          </div>
        ))}
      </Slider>

      {/* Right Arrow */}
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute -right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-accent text-white p-2 hover:bg-emerald-700"
      >
        ›
      </button>
    </div>
  );
}
