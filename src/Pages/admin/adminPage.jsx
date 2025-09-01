import {Link, Route, Routes, useLocation} from "react-router-dom";
import UserPage from "./userPage.jsx";
import ProductPage from "./productPage.jsx";
import AddProductPage from "./productAdd.jsx";
import EditProductPage from "./productsEdit.jsx";
import AdminOrdersPage from "./ordersPage.jsx";
import AdminReviewPage from "./reviewPage.jsx";
import AdminSupplierPage from "./supplierPage.jsx";
import AddSupplierPage from "./supplierAdd.jsx";
import EditSupplierPage from "./supplierEdit.jsx";
import AdminRiderPage from "./ridersPage.jsx";
import EditRiderPage from "./riderEdit.jsx";
import AddRiderPage from "./riderAdd.jsx";
import AdminFaqPage from "./faqsPage.jsx";
import EditFaqPage from "./faqEdit.jsx";
import AddFaqPage from "./faqAdd.jsx";



export default function AdminPage() {
    const location = useLocation();
    const path = location.pathname;


    function getClass(name) {
        if (path.includes(name)) {
            return "bg-accent text-white p-4";
        } else {
            return "text-accent p-4";
        }
    }
    return(
        <>
            <div className="h-full w-[300px] text-accent font-bold   text-xl  flex flex-col bg-white">
                <Link className={getClass("users")} to="/admin/users">
                    users
                </Link>
                <Link className={getClass("products")} to="/admin/products">
                    products
                </Link>
                <Link className={getClass("orders")} to="/admin/orders">
                    Orders
                </Link>
                <Link className={getClass("reviews")} to="/admin/reviews">
                    Reviews
                </Link>
                <Link className={getClass("suppliers")} to="/admin/suppliers">
                    Suppliers
                </Link>
                <Link className={getClass("riders")} to="/admin/riders">
                    Riders
                </Link>
                <Link className={getClass("faqs")} to="/admin/faqs">
                    FAQ
                </Link>
            </div>
            <div className="h-full w-[calc(100%-300px)]  border-accent border-4 rounded-xl bg-white">
                <Routes path="/*">
                    <Route path="/users" element={<UserPage/>} />
                    <Route path="/products" element={<ProductPage/>} />
                    <Route path="/add-product" element={<AddProductPage/>} />
                    <Route path="/edit-product" element={<EditProductPage/>} />
                    <Route path="/orders" element={<AdminOrdersPage/>} />
                    <Route path="/reviews" element={<AdminReviewPage/>} />
                    <Route path="/suppliers" element={<AdminSupplierPage/>} />
                    <Route path="/add-suppliers" element={<AddSupplierPage/>} />
                    <Route path="/edit-suppliers" element={<EditSupplierPage/>} />
                    <Route path="/riders" element={<AdminRiderPage/>} />
                    <Route path="/add-riders" element={<AddRiderPage/>} />
                    <Route path="/edit-riders" element={<EditRiderPage/>} />
                    <Route path="/faqs" element={<AdminFaqPage/>} />
                    <Route path="/add-faqs" element={<AddFaqPage/>} />
                    <Route path="/edit-faqs" element={<EditFaqPage/>} />

                </Routes>
            </div>
        </>
    )
}