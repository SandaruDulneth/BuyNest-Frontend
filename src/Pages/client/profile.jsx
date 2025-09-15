import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FiLogOut } from "react-icons/fi";

export default function ProfilePage() {
    const [me, setMe] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        setMe({ name: decoded.name, email: decoded.email });

        axios
            .get("http://localhost:5000/api/orders/my-orders", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;
                setOrders(Array.isArray(data) ? data : data?.orders || []);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const statusBadge = (status = "") => {
        const s = status.toLowerCase();
        const base = "px-3 py-1 rounded-full text-xs font-semibold";
        if (s === "completed") return `${base} bg-green-100 text-green-700`;
        if (s === "processing") return `${base} bg-yellow-100 text-yellow-700`;
        if (s === "pending") return `${base} bg-orange-100 text-orange-600`;
        if (s === "returned") return `${base} bg-gray-100 text-gray-600`;
        return `${base} bg-red-100 text-red-600`; // cancelled or others
    };


    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Profile header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-accent text-white grid place-items-center text-2xl font-semibold">
                        {me?.name?.[0]?.toUpperCase() }
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{me?.name}</h2>
                        <p className="text-gray-600">{me?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                    <FiLogOut className="text-lg" />
                    Logout
                </button>
            </div>

            {/* Orders table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h3 className="text-lg font-semibold px-4 pt-4 pb-2 border-b">
                    My Orders
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-center">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Products</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="hidden sm:table-cell py-3 px-4">Name</th>
                            <th className="hidden sm:table-cell py-3 px-4">Phone</th>

                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr
                                    key={order._id || index}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="py-3 px-4 font-medium text-gray-800">
                                        {order.orderId}
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.products?.map((p, i) => (
                                            <div key={i}>
                                                {p.productInfo?.name} x {p.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-gray-800">
                                        {order.total?.toLocaleString("en-LK", {
                                            style: "currency",
                                            currency: "LKR",
                                        })}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">
                                        {new Date(order.date || order.createdAt).toLocaleDateString(
                                            "en-GB"
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                      <span className={statusBadge(order.status)}>
                        {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1)}
                      </span>
                                    </td>
                                    <td className="hidden sm:table-cell py-3 px-4">
                                        {order.name}
                                    </td>
                                    <td className="hidden sm:table-cell py-3 px-4">
                                        {order.phone}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="py-4 px-4 text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
