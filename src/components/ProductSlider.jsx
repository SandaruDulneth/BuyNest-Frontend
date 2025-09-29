import React, { useRef } from "react";
import SlickSlider from "react-slick";
import ProductCard from "./ProductCard"; // adjust path if needed

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



//not in use @senal







export default function ProductSlider({ products }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2, // 👈 2 rows
    arrows: false,
    autoplay: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, rows: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2, rows: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, rows: 2 } },
    ],
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => sliderRef.current.slickPrev()}
        className="absolute -left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-emerald-600 text-white p-2 hover:bg-emerald-700"
      >
        ‹
      </button>

      <SlickSlider ref={sliderRef} {...settings}>
        {products.map((p, i) => (
          <div key={i} className="px-2">
            <ProductCard product={p} />
          </div>
        ))}
      </SlickSlider>

      {/* Right Arrow */}
      <button
        onClick={() => sliderRef.current.slickNext()}
        className="absolute -right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-emerald-600 text-white p-2 hover:bg-emerald-700"
      >
        ›
      </button>
    </div>
  );
}
