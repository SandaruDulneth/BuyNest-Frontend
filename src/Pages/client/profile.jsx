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
        setMe({
            userId: decoded.userId,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            phone: decoded.contactNo,
        });

        axios
            .get("http://localhost:5000/api/orders/my-orders", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;
                setOrders(Array.isArray(data) ? data : data?.orders || []);
            })
            .catch(console.error);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        window.location.href = "/login";
    };

    const statusBadge = (status = "") => {
        const s = status.toLowerCase();
        const base = "px-3 py-1 rounded-full text-xs font-semibold";
        if (s === "completed") return `${base} bg-green-100 text-green-700`;
        if (s === "processing") return `${base} bg-yellow-100 text-yellow-700`;
        if (s === "pending") return `${base} bg-orange-100 text-orange-600`;
        if (s === "returned") return `${base} bg-gray-100 text-gray-600`;
        return `${base} bg-red-100 text-red-600`;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-10 font-poppins">
            <div className="w-full max-w-5xl">
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors duration-300 delay-200"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden font-poppins">
                    {/* Name & avatar strip like screenshot */}
                    <div className="flex items-center gap-4 p-6 border-b bg-gray-50">
                        <img
                            src="https://avatar.iran.liara.run/public/boy?username=Ash"
                            alt="avatar"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {me?.firstName} {me?.lastName}
                            </h2>
                            <p className="text-sm text-gray-500">Customer</p>
                        </div>
                    </div>

                    {/* Personal Info section */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Personal Information
                            </h3>
                            <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/60 transition">
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                            <div>
                                <span className="font-medium">First Name: </span>
                                {me?.firstName}
                            </div>
                            <div>
                                <span className="font-medium">Last Name: </span>
                                {me?.lastName}
                            </div>
                            <div>
                                <span className="font-medium">Email: </span>
                                {me?.email}
                            </div>
                            <div>
                                <span className="font-medium">Phone: </span>
                                {me?.phone}
                            </div>
                            <div>
                                <span className="font-medium">User ID: </span>
                                {me?.userId}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="px-4 py-2 bg-dgreen text-white rounded-md hover:bg-dgreen/70 transition">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-md mt-8 font-poppins">
                    <h3 className="text-lg font-semibold px-6 pt-6 pb-4 border-b text-gray-800">
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
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {orders.length ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{order.orderId}</td>
                                        <td className="py-3 px-4">
                                            {order.products?.map((p, i) => (
                                                <div key={i}>
                                                    {p.productInfo?.name} x {p.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-3 px-4 font-semibold">
                                            {order.total?.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(order.date || order.createdAt).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="py-3 px-4">
                        <span className={statusBadge(order.status)}>
                          {order.status?.[0]?.toUpperCase() + order.status?.slice(1)}
                        </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
