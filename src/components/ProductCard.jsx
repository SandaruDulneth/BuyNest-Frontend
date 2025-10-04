import React from "react";
import { Link } from "react-router-dom";

import {addToCart} from "../utils/cart.js";


export default function ProductCard(props) {
  const p = props.product ?? props;

  const {
    _id,
    name = "",
    price = 0,
    labelledPrice = 0,
    images = [],
    imageUrl: imageUrlProp,
    stock = 0,
  } = p;

  const derivedImage =
    imageUrlProp ??
    (
      (Array.isArray(images) && images.length > 0
        ? (typeof images[0] === "string"
            ? images[0]
            : images[0]?.url || images[0]?.publicUrl)

        : null) || "/images/placeholder.png"

    );

  const cleanPrice = Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  const cleanLabelled =
    Number(String(labelledPrice).replace(/[^0-9.]/g, "")) || 0;

  const discount =
    cleanLabelled > 0 && cleanPrice > 0
      ? Math.round(((cleanLabelled - cleanPrice) / cleanLabelled) * 100)
      : null;

  // Stock label
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
    <div
      className={`
        relative flex items-center font-poppins justify-between
        rounded-2xl border border-gray-200 bg-white
        shadow-sm hover:shadow-md transition-shadow
        p-4 sm:p-5 min-h-[190px] w-[340px]
        ${props.className || ""}
      `}
    >

      {/* ✅ Inline badges row */}
      {(discount || stockLabel) && (
        <div className="absolute top-2 left-4 right-4 flex justify-between items-center">
          {discount && discount > 0 && (
            <span className="rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
          {stockLabel}
        </div>
      )}

      {/* Left side: Text + pricing */}
      <div className="flex-1 pr-4 mt-6">

        <Link
          to={`/product/${_id}`}
          className="line-clamp-2 text-[15px] font-semibold text-gray-800 hover:text-emerald-600"
        >
          {name}
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-emerald-600 text-lg font-bold">
            LKR {cleanPrice.toFixed(2)}
          </span>
          {cleanLabelled > 0 && cleanLabelled > cleanPrice && (
            <span className="text-slate-400 line-through">
              LKR {cleanLabelled.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <div className="mt-4">
          <button
            type="button"
            onClick={()=>addToCart(p,1)}
            disabled={stock === 0}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition
              ${
                stock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600"
              }`}
            aria-label="Add to cart"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M6 6l-1-3H2" />
            </svg>
          </button>
        </div>
      </div>


      {/* Right side: Product image */}
      <div className="flex-shrink-0 h-32 w-32 relative mt-6">

        <Link to={`/product/${_id}`}>
          <img
            src={derivedImage}
            alt={name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </Link>
      </div>
    </div>
  );
}
