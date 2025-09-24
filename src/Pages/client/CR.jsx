import { Routes, Route, useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Home from "./home.jsx";
import CategoryPage from "./CategoryPage.jsx";
import ProductOverview from "./ProductOverview.jsx";

function CategoryWrapper() {
  const { slug } = useParams();

  // Turn slug into "Fresh Fruits"
  const category = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return <CategoryPage title={category} category={category} />;
}

export default function CR() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header always at top */}
      <Header />

      {/* Page content fills remaining space */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryWrapper />} />
          <Route path="/product/:id" element={<ProductOverview />} />
          <Route
            path="*"
            element={<p className="p-8">404 - Page not found</p>}
          />
        </Routes>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}
