import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductsByCategory({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products/category", {
          method: "POST", // ✅ use POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }) // ✅ send category in body
        });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading {category}...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))
      ) : (
        <p>No products found in {category}</p>
      )}
    </div>
  );
}
