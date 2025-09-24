import { Routes, Route, useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Home from "./home.jsx";
import CategoryPage from "./CategoryPage.jsx";
import ProductOverview from "./ProductOverview.jsx";
import CartPage from "./cart.jsx";
import CheckoutPage from "./checkout.jsx";
import ProfilePage from "./profile.jsx";
import ContactUs from "./ContactUs.jsx";
import FaqWidget from "../../components/FaqWidget.jsx"; 
import AboutUs from "./AboutUs.jsx"; // ✅ added


function CategoryWrapper() {
  const { slug } = useParams();


  // Convert slug back to category name
  let category = decodeURIComponent(slug.replace(/-/g, " "));
  category = category.replace(/\band\b/gi, "&");


  return <CategoryPage title={category} category={category} />;
}

export default function CR() {
  return (

    <div className="flex flex-col min-h-screen font-poppins">

      {/* Header always at top */}
      <Header />

      {/* Page content fills remaining space */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryWrapper />} />
          <Route path="/product/:id" element={<ProductOverview />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
             <Route path="/contact" element={<ContactUs />} />
             <Route path="/about" element={<AboutUs />} /> {/* ✅ added */}

          <Route
            path="*"
            element={<p className="p-8">404 - Page not found</p>}
          />
        </Routes>
      </div>

      {/* Footer always at bottom */}
      <Footer />

       {/* ✅ Floating FAQ Widget */}
      <FaqWidget />

    </div>
  );
}
