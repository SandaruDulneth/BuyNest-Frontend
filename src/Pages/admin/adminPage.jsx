import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import {
    FiMenu, FiX, FiHome, FiUsers, FiBox, FiShoppingBag, FiStar, FiTruck,
    FiUser, FiCalendar, FiHelpCircle, FiMap, FiBarChart2, FiPieChart,
    FiTrendingUp, FiFileText, FiPlusCircle, FiEdit, FiLogOut, FiSend
} from "react-icons/fi";

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
import AddUserPage from "./userAdd.jsx";
import EditUserPage from "./usersEdit.jsx";

export default function AdminPage() {
    const [open, setOpen] = useState(false); // mobile drawer
    const [me, setMe] = useState(null);
    const [loadingMe, setLoadingMe] = useState(true);


    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token");
                const r = await fetch("http://localhost:5000/api/auth/me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                });
                if (!r.ok) throw new Error(await r.text().catch(() => "Failed to load profile"));
                const j = await r.json();
                if (isMounted) setMe(j);
            } catch {
                if (isMounted) setMe(null);
            } finally {
                if (isMounted) setLoadingMe(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    const linkBase =
        "group flex items-center gap-3 px-4 py-2 my-2 rounded-lg transition-colors";
    const linkIdle = "text-slate-300 hover:bg-white hover:text-accent";
    const linkActive = "bg-white text-accent";

    const SectionTitle = ({ children }) => (
        <div className="mt-6 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {children}
        </div>
    );


    const Item = ({ to, icon, label, end = false }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
            end={end}
            onClick={() => setOpen(false)} // close drawer on mobile
        >
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </NavLink>
    );

    const handleLogout = () => {
        try { localStorage.removeItem("token"); } catch {}
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-2 md:hidden">
                <button
                    aria-label="Open menu"
                    className="rounded-lg border border-slate-200 p-2 active:scale-95"
                    onClick={() => setOpen(true)}
                >
                    <FiMenu className="h-5 w-5" />
                </button>
                <div className="text-sm font-semibold text-slate-700">Admin Dashboard</div>
            </div>


            <aside
                className="
          hidden md:flex md:flex-col
          fixed inset-y-0 left-0 z-40 w-[280px]
          bg-green-900/85 text-slate-200 border-r
        "
            >
                <SidebarContent me={me} loadingMe={loadingMe} />
            </aside>


            {open && (
                <div className="md:hidden">

                    <div
                        className="fixed inset-0 z-40 bg-black/40"
                        onClick={() => setOpen(false)}
                    />

                    <div className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col">
                        <HeaderProfile me={me} loadingMe={loadingMe} onClose={() => setOpen(false)} />
                        {/* Nav list (mobile) */}
                        <nav className="py-4 overflow-y-auto h-[calc(100vh-56px-68px)] scrollbar-dark">
                            <NavSections Item={Item} />
                        </nav>
                        {/* Logout pinned bottom (mobile) */}
                        <FooterLogout handleLogout={handleLogout} />
                    </div>
                </div>
            )}

            {/* Main content area (add left margin only on md+) */}
            <main className="min-w-0 md:ml-[280px] p-3 md:p-6">
                <div className="min-h-[calc(100vh-24px)] rounded-xl border border-slate-200 bg-white p-3 md:p-5">
                    <Routes>
                        {/* Dashboard / Overview */}
                        <Route
                            path="/"
                            element={<div className="text-slate-600">Welcome to Admin Dashboard</div>}
                        />

                        <Route path="/users" element={<UserPage />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/add-product" element={<AddProductPage />} />
                        <Route path="/edit-product" element={<EditProductPage />} />

                        <Route path="/orders" element={<AdminOrdersPage />} />

                        <Route path="/reviews" element={<AdminReviewPage />} />

                        <Route path="/suppliers" element={<AdminSupplierPage />} />
                        <Route path="/add-suppliers" element={<AddSupplierPage />} />
                        <Route path="/edit-suppliers" element={<EditSupplierPage />} />
                        <Route
                            path="/delivery"
                            element={<div className="text-slate-600">Delivery coming soon…</div>}
                        />
                        <Route path="/riders" element={<AdminRiderPage />} />
                        <Route path="/add-riders" element={<AddRiderPage />} />
                        <Route path="/edit-riders" element={<EditRiderPage />} />
                        <Route path="/faqs" element={<AdminFaqPage />} />
                        <Route path="/add-faqs" element={<AddFaqPage />} />
                        <Route path="/edit-faqs" element={<EditFaqPage />} />
                        <Route path="/add-users" element={<AddUserPage />} />
                        <Route path="/edit-users" element={<EditUserPage />} />



                        {/* Stubs for the “Charts / Calendar” links (optional) */}
                        <Route
                            path="/charts/:type"
                            element={<div className="text-slate-600">Charts coming soon…</div>}
                        />
                        <Route
                            path="/calendar"
                            element={<div className="text-slate-600">Calendar coming soon…</div>}
                        />
                    </Routes>
                </div>
            </main>

            {/* Desktop sidebar content component + scrollbar styles */}
            <style>{`
        /* Sidebar scroll height (minus header and logout) */
        .sidebar-scroll {
          height: calc(100vh - 56px - 68px);
        }
        /* Dark scrollbar to match sidebar (WebKit: Chrome/Edge/Safari) */
        .scrollbar-light::-webkit-scrollbar {
          width: 10px;
        }
        .scrollbar-light::-webkit-scrollbar-track {
          background: #064e3b; /* slate-900 */
        }
        .scrollbar-light::-webkit-scrollbar-thumb {
          background-color: #10b981; /* slate-700 */
          border-radius: 9999px;
          border: 2px solid #0f172a; /* match track (sidebar bg) */
        }
        .scrollbar-light::-webkit-scrollbar-thumb:hover {
          background-color: #34d399; /* slate-600 */
        }
        /* Firefox */
        .scrollbar-dark {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #064e3b; /* thumb track */
        }
      `}</style>
        </div>
    );



    function Avatar({ name = "", src }) {
        const initials =
            name
                ?.split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((s) => s[0]?.toUpperCase())
                .join("") || "AD";
        if (src) {
            return (
                <img
                    src={src}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                />
            );
        }
        return (
            <div className="h-10 w-10 rounded-full bg-white text-slate-800 grid place-items-center text-sm font-semibold">
                {initials}
            </div>
        );
    }

    function HeaderProfile({ me, loadingMe, onClose }) {
        return (
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <Avatar name={me?.name} src={me?.avatarUrl} />
                    <div>
                        <div className="text-sm font-semibold">
                            {loadingMe ? "Loading..." : me?.name || "Admin"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                            {loadingMe
                                ? "Please wait"
                                : me?.title || (me?.role ? me.role.toUpperCase() : "Admin")}
                        </div>
                    </div>
                </div>
                <button
                    aria-label="Close menu"
                    className="rounded-lg border border-slate-700 p-2 active:scale-95"
                    onClick={onClose}
                >
                    <FiX className="h-5 w-5" />
                </button>
            </div>
        );
    }

    function SidebarContent({ me, loadingMe }) {
        return (
            <>
                {/* Brand / Profile block */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
                    <Avatar name={me?.name}  src={me?.avatarUrl} />
                    <div>
                        <div className="text-sm font-semibold">
                            {loadingMe ? "Loading..." : me?.name || "Admin"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                            {loadingMe
                                ? "Please wait"
                                : me?.title || (me?.role ? me.role.toUpperCase() : "Admin")}
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="py-4 overflow-y-auto sidebar-scroll scrollbar-dark">
                    <NavSections Item={Item} />
                </nav>

                {/* Logout pinned bottom (desktop) */}
                <FooterLogout handleLogout={handleLogout} />
            </>
        );
    }

    function NavSections({ Item }) {
        return (
            <>
                <SectionTitle>Dashboard</SectionTitle>
                <Item to="/admin" icon={<FiHome />} label="Overview" end />

                <SectionTitle>Data</SectionTitle>
                <Item to="/admin/users" icon={<FiUsers />} label="Manage Users" />
                <Item to="/admin/orders" icon={<FiShoppingBag />} label="Order Management" />

                <SectionTitle>Pages</SectionTitle>
                <Item to="/admin/products" icon={<FiBox />} label="Products" />
                <Item to="/admin/reviews" icon={<FiStar />} label="Reviews" />
                <Item to="/admin/riders" icon={<FiTruck />} label="Riders" />
                <Item to="/admin/faqs" icon={<FiHelpCircle />} label="FAQ Page" />

                <Item to="/admin/suppliers" icon={<FiFileText />} label="Suppliers" />

                <Item to="/admin/delivery" icon={<FiSend />} label="Delivery" />

                <SectionTitle>Quick Actions</SectionTitle>
                <Item to="/admin/add-product" icon={<FiPlusCircle />} label="Add Product" />
                <Item to="/admin/add-suppliers" icon={<FiPlusCircle />} label="Add Supplier" />
                <Item to="/admin/add-riders" icon={<FiPlusCircle />} label="Add Rider" />
                <Item to="/admin/add-faqs" icon={<FiPlusCircle />} label="Add FAQ" />
                <Item to="/admin/add-users" icon={<FiPlusCircle />} label="Add Users" />

                <SectionTitle>Charts</SectionTitle>
                <Item to="/admin/charts/bar" icon={<FiBarChart2 />} label="Bar Chart" />
                <Item to="/admin/charts/pie" icon={<FiPieChart />} label="Pie Chart" />
                <Item to="/admin/charts/line" icon={<FiTrendingUp />} label="Line Chart" />
                <Item to="/admin/charts/geo" icon={<FiMap />} label="Geography Chart" />

                <SectionTitle>Calendar</SectionTitle>
                <Item to="/admin/calendar" icon={<FiCalendar />} label="Calendar" />
            </>
        );
    }

    function FooterLogout({ handleLogout }) {
        return (
            <div className="mt-auto px-4 py-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white text-slate-800 hover:bg-slate-100 active:scale-[.99]"
                >
                    <FiLogOut className="text-lg" />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        );
    }
}
