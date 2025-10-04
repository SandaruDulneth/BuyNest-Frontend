import { useEffect, useState } from "react";
import ProductCard from "./ProductCard"; // keep for default

export default function ProductsByCategory({
  category,
  apiBase = import.meta.env.VITE_BACKEND_URL,
  CardComponent = ProductCard, // 👈 default to old ProductCard
}) {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const ac = new AbortController();

    async function fetchProducts() {
      setState({ loading: true, error: null });
      try {
        const res = await fetch(`${apiBase}/api/products/category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
          signal: ac.signal,
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setState({ loading: false, error: err.message || "Failed to fetch" });
          return;
        }
      }
      setState({ loading: false, error: null });
    }

    fetchProducts();
    return () => ac.abort();
  }, [category, apiBase]);

  if (state.loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-poppins">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (state.error) {
    return <p className="text-red-600 font-poppins">Error: {state.error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-gray-600 font-poppins">No products found in <b>{category}</b></p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 font-poppins">
      {products.map((p) => (
        <CardComponent
          key={p._id || p.productId}
          product={p}
          onAddToCart={() => console.log("add to cart", p._id || p.productId)}
        />
      ))}
    </div>
  );
}
