import { useState, useEffect } from "react";

export default function Slider() {
  const images = [
    "/images/slider5.jpg",
    "/images/slider2.jpg",
    "/images/slider4.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`slide-${idx}`}
          className={`absolute inset-x-0 top-1/2 w-full h-full -translate-y-1/2 
            object-cover transition-opacity duration-1000 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
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
