import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductOverview({ apiBase = "http://localhost:5000" }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const ac = new AbortController();

    async function fetchProduct() {
      setState({ loading: true, error: null });
      try {
        const res = await fetch(`${apiBase}/api/products/${id}`, {
          signal: ac.signal,
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setState({
            loading: false,
            error: err.message || "Failed to fetch",
          });
          return;
        }
      }
      setState({ loading: false, error: null });
    }

    fetchProduct();
    return () => ac.abort();
  }, [id, apiBase]);

  if (state.loading) {
    return <p className="p-8">Loading product...</p>;
  }

  if (state.error) {
    return <p className="p-8 text-red-600">Error: {state.error}</p>;
  }

  if (!product) {
    return <p className="p-8 text-gray-600">Product not found</p>;
  }

  const {
    name,
    price,
    labelledPrice,
    description,
    images = [],
    imageUrl,
    categories, // 👈 from backend
  } = product;

  // 👇 derive single category for breadcrumb
  const category = Array.isArray(categories) ? categories[0] : categories;

  // ✅ safer derived image
  let derivedImage = null;
  if (imageUrl) {
    derivedImage = imageUrl;
  } else if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") {
      derivedImage = first;
    } else if (first?.url) {
      derivedImage = first.url;
    } else if (first?.publicUrl) {
      derivedImage = first.publicUrl;
    }
  }
  if (!derivedImage) {
    derivedImage = "/images/placeholder.png";
  }

  const cleanPrice = Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  const cleanLabelled =
    Number(String(labelledPrice).replace(/[^0-9.]/g, "")) || 0;

  return (
    <main className="container mx-auto px-6 py-10">
      {/* ✅ Breadcrumb */}
      <nav className="text-sm mb-6 flex items-center space-x-2">
        <Link to="/" className="text-emerald-600 font-medium hover:underline">
          Home
        </Link>

        {category && (
          <>
            <span className="text-gray-400">›</span>
            <Link
              to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-emerald-600 font-medium hover:underline"
            >
              {category}
            </Link>
          </>
        )}

        <span className="text-gray-400">›</span>
        <span className="text-gray-700">{name}</span>
      </nav>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left side: image */}
        <div className="flex flex-col items-center">
          <img
            src={derivedImage}
            alt={name}
            className="max-h-[400px] object-contain rounded-lg border p-2"
          />
        </div>

        {/* Right side: product info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-emerald-600 text-2xl font-bold">
              Rs {cleanPrice.toFixed(2)}
            </span>
            {cleanLabelled > 0 && cleanLabelled > cleanPrice && (
              <span className="text-gray-400 line-through text-lg">
                Rs {cleanLabelled.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">
            {description || "No description available."}
          </p>

          <button
            onClick={() => console.log("add to cart", product._id)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
