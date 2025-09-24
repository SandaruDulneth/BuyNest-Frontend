import React from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ProductCardCat({ product, onAddToCart }) {
  const {
    _id,
    productId,
    name = "",
    price = 0,
    labelledPrice = 0,
    images = [],
    imageUrl: imageUrlProp,
    unit,
  } = product ?? {};

  const derivedImage =
    imageUrlProp ??
    (
      (Array.isArray(images) && images.length > 0
        ? typeof images[0] === "string"
          ? images[0]
          : images[0]?.url || images[0]?.publicUrl
        : null) || "/images/placeholder.png"
    );

  const cleanPrice = Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  const cleanLabelled =
    Number(String(labelledPrice).replace(/[^0-9.]/g, "")) || 0;

  const discount =
    cleanLabelled > 0 && cleanPrice > 0
      ? Math.round(((cleanLabelled - cleanPrice) / cleanLabelled) * 100)
      : null;

  // ✅ product id (from backend, could be _id or productId)
  const productKey = _id || productId;

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center relative">
      {/* Discount pill */}
      {discount && discount > 0 && (
        <span className="absolute top-2 left-2 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
          {discount}% OFF
        </span>
      )}

      {/* Wrap clickable content in Link */}
      <Link
        to={`/product/${productKey}`}
        className="flex flex-col items-center text-center w-full"
      >
        <img
          src={derivedImage}
          alt={name}
          className="h-32 object-contain mb-3"
          loading="lazy"
        />
        <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
        {unit && <p className="text-sm text-gray-500">{unit}</p>}
      </Link>

      {/* Price Section */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-bold text-emerald-600">
          LKR {cleanPrice.toFixed(2)}
        </span>
        {cleanLabelled > 0 && cleanLabelled > cleanPrice && (
          <span className="text-sm text-gray-400 line-through">
            LKR {cleanLabelled.toFixed(2)}
          </span>
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={onAddToCart}
        className="mt-4 flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
      >
         Add to Cart
      </button>
    </div>
  );
}
