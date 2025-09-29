import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Slider() {
  const navigate = useNavigate();

  // add target categories alongside each image
  const slides = [
    { src: "/images/slider0.png", category: "Cooking Essentials" },
    { src: "/images/slider3.png", category: "Fresh Fruits" },
    { src: "/images/slider4.png", category: "Fresh Vegetables" },
      { src: "/images/slider1.png", category: "Fresh Vegetables" },
      { src: "/images/slider2.png", category: "Fresh Vegetables" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // navigate to /category/:slug when a slide is clicked
  const handleSlideClick = (category) => {
    const slug = encodeURIComponent(category.replace(/\s+/g, "-"));
    navigate(`/category/${slug}`);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      {slides.map((slide, idx) => (
        <img
          key={idx}
          src={slide.src}
          alt={`slide-${idx}`}
          onClick={() => handleSlideClick(slide.category)}
          className={`absolute inset-x-0 top-1/2 w-full h-full -translate-y-1/2 
            object-cover transition-opacity duration-1000 cursor-pointer ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 w-2 rounded-full ${
              idx === current ? "bg-emerald-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
