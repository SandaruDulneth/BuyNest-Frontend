import { AiFillStar } from "react-icons/ai";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md p-4 relative flex flex-col border border-gray-100">
      {/* Discount & Stock Labels */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {product.discount && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
            {product.discount}
          </span>
        )}
        {product.stock && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              product.stock === "New"
                ? "bg-blue-500 text-white"
                : product.stock === "Out of Stock"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {product.stock}
          </span>
        )}
      </div>

      {/* Product Image */}
      <img
        src={product.images [0]}
        alt={product.name}
        className="h-32 mx-auto mb-4 object-contain"
      />

      {/* Category */}
      <p className="text-xs text-gray-500">{product.category}</p>

      {/* Name */}
      <p className="font-medium text-gray-800 mb-1 text-sm line-clamp-2">
        {product.name}
      </p>

      {/* Rating */}
      <div className="flex items-center text-yellow-400 text-sm mb-1">
        {[...Array(5)].map((_, i) => (
          <AiFillStar key={i} className={i < product.rating ? "" : "text-gray-300"} />
        ))}
      </div>

      {/* Vendor */}
      <p className="text-xs text-gray-500 mb-2">
        By <span className="text-green-600">{product.vendor}</span>
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-600 font-semibold">{product.price}</span>
        {product.oldPrice && (
          <span className="text-gray-400 line-through text-sm">
            {product.oldPrice}
          </span>
        )}
      </div>

      {/* Add Button */}
      <button className="mt-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
        + Add
      </button>
    </div>
  );
}
