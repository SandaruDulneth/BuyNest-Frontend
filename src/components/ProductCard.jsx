import React from "react";

export default function ProductCard({
                                        name,
                                        price,
                                        labelledPrice,
                                        imageUrl,
                                        onAddToCart,
                                        className = "",
                                    }) {
    // clean numbers (remove $ if provided)
    const cleanPrice = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    const cleanLabelled = parseFloat(String(labelledPrice).replace(/[^0-9.]/g, ""));

    // calc discount
    const discount =
        cleanLabelled && cleanPrice
            ? Math.round(((cleanLabelled - cleanPrice) / cleanLabelled) * 100)
            : null;

    return (
        <div
            className={`
        relative overflow-visible
        rounded-2xl border border-gray-200 bg-white
        shadow-sm hover:shadow-md transition-shadow
        p-4 sm:p-5 min-h-[180px]
        ${className}
      `}
        >
            {/* Discount pill */}
            {discount && discount > 0 && (
                <span className="absolute -top-2 left-4 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
          {discount}% OFF
        </span>
            )}

            {/* Text + pricing */}
            <div className="pr-40">
                <h3 className="line-clamp-2 text-[15px] font-semibold text-gray-800">
                    {name}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
          <span className="text-emerald-600 text-lg font-bold">
            LKR{cleanPrice.toFixed(2)}
          </span>
                    {cleanLabelled && (
                        <span className="text-slate-400 line-through">
             LKR{cleanLabelled.toFixed(2)}
            </span>
                    )}
                </div>

                {/* Add to cart */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={onAddToCart}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 transition"
                        aria-label="Add to cart"
                    >
                        {/* cart icon */}
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M6 6h15l-1.5 9h-12z" />
                            <circle cx="9" cy="20" r="1.5" />
                            <circle cx="18" cy="20" r="1.5" />
                            <path d="M6 6l-1-3H2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Bigger product image */}
            <div className="pointer-events-none absolute top-3 right-0 h-36 w-36 ">
                <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
