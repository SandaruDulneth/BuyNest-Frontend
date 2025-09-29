import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

export default function AdminDeliveryPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [riders, setRiders] = useState([]);
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchDeliveries();
        fetchRiders();
    }, []);

    async function fetchDeliveries() {
        try {
            const res = await axios.get("http://localhost:5000/api/delivery", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeliveries(res.data.deliveries || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load deliveries");
        }
    }

    async function fetchRiders() {
        try {
            const res = await axios.get("http://localhost:5000/api/riders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRiders(res.data || []);
        } catch {
            toast.error("Failed to load riders");
        }
    }

    async function assignRider(deliveryId, riderId) {
        try {
            await axios.put(
                `http://localhost:5000/api/delivery/${deliveryId}`,
                { riderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Rider assigned");
            fetchDeliveries();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Assign failed");
        }
    }

    const filtered = deliveries.filter((d) =>
        [d.deliveryId, d.orderId, d.phone]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <main className="p-6 bg-neutral-50 min-h-screen space-y-6 ">
            {/* Header */}
            <h1 className="text-3xl font-extrabold tracking-tight">
                Delivery Inventory
            </h1>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard label="Total Deliveries" value={deliveries.length} />
                <KpiCard
                    label="Assigned"
                    value={deliveries.filter((d) => d.riderId).length}
                />
                <KpiCard
                    label="Unassigned"
                    value={deliveries.filter((d) => !d.riderId).length}
                />
            </section>

            {/* Filters / Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search delivery/order/phone…"
                        className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-emerald-700 text-white">
                    <tr>
                        <Th>Delivery ID</Th>
                        <Th>Order ID</Th>
                        <Th>Phone</Th>
                        <Th>Assigned Rider</Th>
                        <Th>Date</Th>
                        <Th className="text-center">Assign Rider</Th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filtered.map((d, idx) => (
                        <tr
                            key={d.deliveryId}
                            className={idx % 2 ? "bg-gray-50" : "bg-white"}
                        >
                            <Td>{d.deliveryId}</Td>
                            <Td>{d.orderId}</Td>
                            <Td>{d.phone || "-"}</Td>
                            <Td>{d.riderId || "Unassigned"}</Td>
                            <Td>
                                {d.date ? new Date(d.date).toLocaleDateString("en-GB") : "-"}
                            </Td>
                            <Td className="text-center">
                                <select
                                    defaultValue=""
                                    onChange={(e) =>
                                        e.target.value &&
                                        assignRider(d.deliveryId, e.target.value)
                                    }
                                    className="border rounded-lg px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="" disabled>
                                        Select Rider
                                    </option>
                                    {riders.map((r) => (
                                        <option key={r.riderId} value={r.riderId}>
                                            {r.Name}
                                        </option>
                                    ))}
                                </select>
                            </Td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

/* === Small Reusable Components === */
function KpiCard({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
    );
}

const Th = ({ children, className = "" }) => (
    <th className={`px-4 py-3 text-left font-semibold ${className}`}>{children}</th>
);
const Td = ({ children, className = "" }) => (
    <td className={`px-4 py-3 ${className}`}>{children}</td>
);
