import React from "react";

import { Link } from "react-router-dom";
import {addToCart} from "../utils/cart.js";


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

    stock = 0,

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


  const productKey = _id || productId;

  // Stock badge
  let stockLabel = null;
  if (stock === 0) {
    stockLabel = (
      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
        Out of Stock
      </span>
    );
  } else if (stock < 10) {
    stockLabel = (
      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center relative font-poppins">
      {/* ✅ Inline top bar for badges */}
      {(discount || stockLabel) && (
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
          {discount && discount > 0 && (
            <span className="rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
          {stockLabel}
        </div>
      )}


      <Link
        to={`/product/${productKey}`}
        className="flex flex-col items-center text-center w-full"
      >
        <img
          src={derivedImage}
          alt={name}

          className="h-32 object-contain mb-3 mt-6"

          loading="lazy"
        />
        <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
        {unit && <p className="text-sm text-gray-500">{unit}</p>}
      </Link>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-bold text-accent">

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

        onClick={()=>addToCart(product,1)}
        disabled={stock === 0}
        className={`mt-4 flex items-center gap-1 px-4 py-2 rounded-lg transition
          ${
            stock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-accent hover:bg-accent/80 text-white"
          }`}
      >
        {stock === 0 ? "Unavailable" : "Add to Cart"}

      </button>
    </div>
  );
}
