import ProductsByCategory from "../../components/ProductsByCategory.jsx";
import ProductCardCat from "../../components/ProductCardCat.jsx";

export default function CategoryPage({ title, category }) {
  return (
    <main className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
      {/* 👇 inject ProductCardCat here */}
      <ProductsByCategory category={category} CardComponent={ProductCardCat} />
    </main>
  );
}
