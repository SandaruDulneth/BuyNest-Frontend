import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../components/loading";
import Modal from "react-modal";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {
        if (isLoading) {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login first");
                return;
            }
            axios
                .get("http://localhost:5000/api/orders", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((res) => {
                    setOrders(res.data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    alert(
                        "Error fetching orders: " +
                        (e.response?.data?.message || "Unknown error")
                    );
                    setIsLoading(false);
                });
        }
    }, [isLoading]);

    // KPI counts
    const kpis = useMemo(() => {
        const total = orders.length;
        const processing = orders.filter(
            (o) =>
                String(o.status).toLowerCase() === "pending" ||
                String(o.status).toLowerCase() === "processing"
        ).length;
        const delivered = orders.filter(
            (o) =>
                String(o.status).toLowerCase() === "completed" ||
                String(o.status).toLowerCase() === "delivered"
        ).length;
        const pendingPayment = orders.filter(
            (o) => String(o.paymentStatus || "").toLowerCase() === "unpaid"
        ).length;
        return { total, processing, delivered, pendingPayment };
    }, [orders]);

    // Badges
    const statusBadge = (status) => {
        const s = String(status || "").toLowerCase();
        if (s === "completed" || s === "delivered")
            return <Pill tone="green">Delivered</Pill>;
        if (s === "pending" || s === "processing")
            return <Pill tone="amber">{s[0].toUpperCase() + s.slice(1)}</Pill>;
        if (s === "cancelled") return <Pill tone="rose">Cancelled</Pill>;
        if (s === "returned") return <Pill tone="slate">Returned</Pill>;
        return <Pill tone="slate">{status || "-"}</Pill>;
    };

    const paymentBadge = (paymentStatus) => {
        const p = String(paymentStatus || "paid").toLowerCase();
        if (p === "paid") return <Pill tone="green">Paid</Pill>;
        if (p === "unpaid") return <Pill tone="rose">Unpaid</Pill>;
        return <Pill tone="slate">{paymentStatus || "—"}</Pill>;
    };

    return (
        <div className="w-full h-full max-h-full overflow-y-auto p-4 md:p-6 font-[var(--font-main)]">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-800">
                    Order Management
                </h1>
                <p className="text-sm text-slate-500">
                    View, manage, and track customer orders
                </p>
            </div>

            {/* KPI cards */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Track Orders"
                    value={kpis.total}
                    icon={<span className="text-xl">📦</span>}
                />
                <KpiCard
                    title="Processing"
                    value={kpis.processing}
                    icon={<span className="text-xl">🚚</span>}
                />
                <KpiCard
                    title="Delivered"
                    value={kpis.delivered}
                    icon={<span className="text-xl">✅</span>}
                />
                <KpiCard
                    title="Pending Payment"
                    value={kpis.pendingPayment}
                    icon={<span className="text-xl">Rs.</span>}
                    danger
                />
            </div>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto my-10 p-6 outline-none"
                        overlayClassName="fixed inset-0 bg-[#00000040] flex justify-center items-center"
                    >
                        {activeOrder && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[var(--color-accent)]">
                                    Order Details - {activeOrder.orderId}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p>
                                            <span className="font-semibold">Name:</span>{" "}
                                            {activeOrder.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Email:</span>{" "}
                                            {activeOrder.email}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Phone:</span>{" "}
                                            {activeOrder.phone}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Delivery method:</span>{" "}
                                            {activeOrder.deliveryMethod}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Address:</span>{" "}
                                            {activeOrder.address}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold rounded-full">Status:</span>
                                            <span
                                                className={`font-bold ${
                                                    activeOrder.status === "pending"
                                                        ? "text-yellow-500"
                                                        : activeOrder.status === "completed" ||
                                                        activeOrder.status === "delivered"
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                }`}
                                            >
                        {String(activeOrder.status).toUpperCase()}
                      </span>
                                            <select
                                                className="ml-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                                                onChange={async (e) => {
                                                    const updatedValue = e.target.value;
                                                    try {
                                                        const token = localStorage.getItem("token");
                                                        await axios.put(
                                                            "http://localhost:5000/api/orders/" +
                                                            activeOrder.orderId +
                                                            "/" +
                                                            updatedValue,
                                                            {},
                                                            { headers: { Authorization: "Bearer " + token } }
                                                        );
                                                        setIsLoading(true);
                                                        const updatedOrder = { ...activeOrder };
                                                        updatedOrder.status = updatedValue;
                                                        setActiveOrder(updatedOrder);
                                                    } catch (e) {
                                                        toast.error("Error updating order status");
                                                        console.log(e);
                                                    }
                                                }}
                                            >
                                                <option disabled selected>
                                                    Change status
                                                </option>
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="completed">Completed</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="returned">Returned</option>
                                            </select>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Date:</span>{" "}
                                            {new Date(activeOrder.date).toLocaleDateString("en-GB")}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Total:</span>{" "}
                                            {activeOrder.total.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mt-4">Products</h3>
                                <table className="w-full text-center border border-gray-200 shadow rounded">
                                    <thead className="bg-[var(--color-accent)] text-white">
                                    <tr>
                                        <th className="py-2 px-2">Image</th>
                                        <th className="py-2 px-2">Product</th>
                                        <th className="py-2 px-2">Price</th>
                                        <th className="py-2 px-2">Quantity</th>
                                        <th className="py-2 px-2">Subtotal</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {activeOrder.products.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className={`${
                                                idx % 2 === 0
                                                    ? "bg-[var(--color-primary)]"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            <td className="py-2 px-2">
                                                <img
                                                    src={item.productInfo.images[0]}
                                                    alt={item.productInfo.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            </td>
                                            <td className="py-2 px-2">{item.productInfo.name}</td>
                                            <td className="py-2 px-2">
                                                {item.productInfo.price.toLocaleString("en-LK", {
                                                    style: "currency",
                                                    currency: "LKR",
                                                })}
                                            </td>
                                            <td className="py-2 px-2">{item.quantity}</td>
                                            <td className="py-2 px-2">
                                                {(
                                                    item.productInfo.price * item.quantity
                                                ).toLocaleString("en-LK", {
                                                    style: "currency",
                                                    currency: "LKR",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="mt-4 px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-800 transition"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="mt-4 px-4 py-2 rounded bg-[var(--color-accent)] text-white hover:bg-[var(--color-secondary)] transition"
                                    >
                                        Print
                                    </button>
                                </div>
                            </div>
                        )}
                    </Modal>

                    {/* Orders table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <Th>Order ID</Th>
                                <Th>Customer</Th>
                                <Th>Phone</Th>
                                <Th>Date</Th>
                                <Th>Total</Th>
                                <Th>Status</Th>
                                <Th>Delivery Method</Th>
                                <Th>Payment</Th>
                                <Th className="text-center">Actions</Th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order, index) => {
                                const date = new Date(order.date);
                                return (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                    >
                                        <Td className="max-w-[220px] truncate text-emerald-700 font-medium">
                                            {order.orderId}
                                        </Td>
                                        <Td>
                                            <div className="leading-tight">
                                                <div className="font-medium text-slate-800">
                                                    {order.name}
                                                </div>
                                            </div>
                                        </Td>
                                        <Td className="whitespace-nowrap">{order.phone}</Td>
                                        <Td className="whitespace-nowrap">
                                            {date.toLocaleDateString("en-GB")}
                                        </Td>
                                        <Td className="font-semibold">
                                            {order.total.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })}
                                        </Td>
                                        <Td>{statusBadge(order.status)}</Td>
                                        <Td>{statusBadge(order.deliveryMethod)}</Td>
                                        <Td>{paymentBadge(order.paymentStatus)}</Td>
                                        <Td className="text-center">
                                            <button
                                                className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                                                onClick={() => {
                                                    setActiveOrder(order);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                View
                                            </button>
                                        </Td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------------- Small UI atoms ---------------- */

function KpiCard({ title, value, icon, danger = false }) {
    return (
        <div
            className={`flex items-center gap-3 rounded-2xl bg-white border shadow-sm px-4 py-3 ${
                danger ? "border-rose-200" : "border-slate-200"
            }`}
        >
            <div
                className={`grid place-items-center h-10 w-10 rounded-full ${
                    danger ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"
                }`}
            >
                {icon}
            </div>
            <div>
                <div className="text-xs text-slate-500">{title}</div>
                <div className="text-xl font-bold text-slate-800">{value}</div>
            </div>
        </div>
    );
}

function Pill({ children, tone = "slate" }) {
    const tones = {
        green: "bg-green-100 text-green-700",
        amber: "bg-amber-100 text-amber-700",
        rose: "bg-rose-100 text-rose-700",
        slate: "bg-slate-100 text-slate-700",
    }[tone];
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones}`}
        >
      {children}
    </span>
    );
}

function Th({ children, className = "" }) {
    return (
        <th className={`py-3 px-4 text-xs font-semibold uppercase ${className}`}>
            {children}
        </th>
    );
}

function Td({ children, className = "" }) {
    return (
        <td className={`py-4 px-4 align-middle text-sm text-slate-700 ${className}`}>
            {children}
        </td>
    );
}
