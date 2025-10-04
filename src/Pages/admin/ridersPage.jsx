/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, Fragment } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiFilter, FiRefreshCw, FiPlus, FiDownload } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-emerald-700">
            <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg font-semibold">Loading Riders...</p>
        </div>
    );
}

export default function AdminRiderPage() {
    const [riders, setRiders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [status, setStatus] = useState("all");
    const [vehicle, setVehicle] = useState("all");
    const [reportOpen, setReportOpen] = useState(false);

    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);

    // ---------- Fetch Riders ----------
    useEffect(() => {
        if (!isLoading) return;
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            setIsLoading(false);
            return;
        }
        axios
            .get(import.meta.env.VITE_BACKEND_URL+"/api/riders", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => setRiders(Array.isArray(res.data) ? res.data : []))
            .catch((e) =>
                toast.error(e.response?.data?.message || "Failed to load riders")
            )
            .finally(() => setIsLoading(false));
    }, [isLoading]);

    function deleteRider(riderId) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }
        axios
            .delete(`http://localhost:5000/api/riders/${riderId}`, {
                headers: { Authorization: "Bearer " + token },
            })
            .then(() => {
                toast.success("Rider deleted successfully");
                setIsLoading(true);
            })
            .catch((e) =>
                toast.error(e.response?.data?.message || "Failed to delete rider")
            );
    }

    const { total, activeCount, inactiveCount } = useMemo(() => {
        const total = riders.length;
        const activeCount = riders.filter((r) => !!r.status).length;
        const inactiveCount = total - activeCount;
        return { total, activeCount, inactiveCount };
    }, [riders]);

    const vehicleOptions = useMemo(() => {
        const set = new Set(
            riders.map((r) => r?.vehicleType).filter((v) => typeof v === "string" && v.trim())
        );
        return ["all", ...Array.from(set)];
    }, [riders]);

    const filtered = useMemo(() => {
        return riders.filter((r) => {
            const matchStatus =
                status === "all" ||
                (status === "active" && !!r.status) ||
                (status === "inactive" && !r.status);
            const matchVehicle =
                vehicle === "all" ||
                String(r.vehicleType || "").toLowerCase() === vehicle.toLowerCase();
            return matchStatus && matchVehicle;
        });
    }, [riders, status, vehicle]);

    useEffect(() => setPage(1), [status, vehicle, riders]);
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ---------- Pie Chart Data ----------
    const vehicleStats = useMemo(() => {
        const counts = {};
        riders.forEach((r) => {
            const v = r.vehicleType || "Unknown";
            counts[v] = (counts[v] || 0) + 1;
        });
        const totalR = riders.length || 1;
        return Object.entries(counts).map(([type, count]) => ({
            type,
            count,
            pct: ((count / totalR) * 100).toFixed(1),
        }));
    }, [riders]);

    // ---------- Download PDF ----------
    const downloadPDF = async () => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        // Logo
        const logo = new Image();
        logo.src = "/logo1.png";
        await new Promise((resolve) => (logo.onload = resolve));
        doc.addImage(logo, "PNG", 15, 10, 25, 15);

        // Header
        doc.setFontSize(14);
        doc.text("BuyNest Vehicle Type Distribution Report", pageWidth / 2, 30, {
            align: "center",
        });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 15, 18, {
            align: "right",
        });

        // Capture pie chart
        const node = document.getElementById("report-content");
        if (node) {
            const canvas = await html2canvas(node, {
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "PNG", 15, 35, pageWidth - 30, 90);
        }

        // Table below chart
        const tableData = vehicleStats.map((v) => [v.type, v.count, v.pct + "%"]);
        autoTable(doc, {
            startY: 135, // position below the chart
            head: [["Vehicle Type", "Count", "Percentage"]],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [16, 185, 129] }, // emerald
        });

        // Footer
        doc.setFontSize(9);
        doc.text("Report generated by: System Administrator", 15, 285);
        doc.text("BuyNest Rider Delivery System", 15, 290);
        doc.text("Page 1 / 1", pageWidth - 20, 290);

        doc.save("BuyNest_Vehicle_Type_Report.pdf");
    };

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full p-4 font-[var(--font-main)]">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">
                        Riders Inventory
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your delivery riders, availability and contact details.
                    </p>
                </div>
                <Link
                    to="/admin/add-riders"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    <FiPlus className="text-base" /> Add Rider
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <StatCard title="Total Riders" value={total} pill="All" tone="emerald" />
                <StatCard title="Active Riders" value={activeCount} pill="Online" tone="green" />
                <StatCard title="Inactive Riders" value={inactiveCount} pill="Offline" tone="amber" />
            </div>

            {/* Filters */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <FiFilter />
                        <span className="text-sm font-medium">Filters</span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-lg border px-3 py-2 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select
                            value={vehicle}
                            onChange={(e) => setVehicle(e.target.value)}
                            className="rounded-lg border px-3 py-2 text-sm"
                        >
                            {vehicleOptions.map((v) => (
                                <option key={v} value={v}>
                                    {v === "all" ? "All Vehicles" : v}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                setStatus("all");
                                setVehicle("all");
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <FiRefreshCw className="text-slate-500" /> Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Report Button */}
            <div className="mb-4 flex justify-end rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <button
                    onClick={() => setReportOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                    Create Report
                </button>
            </div>

            {/* Riders Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <Th>Rider ID</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Contact No</Th>
                            <Th>Vehicle Type</Th>
                            <Th>Status</Th>
                            <Th className="text-center">Actions</Th>
                        </tr>
                        </thead>
                        <tbody>
                        {pageItems.map((r, index) => {
                            const key = r.riderId || r._id || index;
                            const isActive = !!r.status;
                            return (
                                <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                    <Td>{r.riderId}</Td>
                                    <Td>{r.Name || "-"}</Td>
                                    <Td>{r.email || "-"}</Td>
                                    <Td>{r.contactNo || "-"}</Td>
                                    <Td>{r.vehicleType || "-"}</Td>
                                    <Td>
                      <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                                    </Td>
                                    <Td className="text-center">
                                        <div className="inline-flex items-center gap-3">
                                            <button
                                                onClick={() => navigate("/admin/edit-riders", { state: r })}
                                                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"
                                                title="Edit"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteRider(r.riderId)}
                                                className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                                                title="Delete"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </Td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Report Modal */}
            <Transition appear show={reportOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setReportOpen(false)}>
                    <div className="fixed inset-0 bg-black/40" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white p-6 space-y-4 shadow-lg">
                            <Dialog.Title className="text-lg font-bold text-center">
                                Vehicle Type Distribution
                            </Dialog.Title>

                            {/* Chart content to export */}
                            <div id="report-content" className="min-h-[300px]">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={vehicleStats}
                                            dataKey="count"
                                            nameKey="type"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {vehicleStats.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][i % 4]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={downloadPDF}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                                >
                                    <FiDownload /> Download PDF
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

/* ---- Small UI helpers ---- */
function StatCard({ title, value, pill, tone = "emerald" }) {
    const tones = {
        emerald: { ring: "ring-emerald-500/20", dot: "bg-emerald-500" },
        green: { ring: "ring-green-500/20", dot: "bg-green-500" },
        amber: { ring: "ring-amber-500/20", dot: "bg-amber-500" },
    }[tone];
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                        {title}
                    </div>
                    <div className="mt-1 text-2xl font-bold text-slate-800">{value}</div>
                </div>
                <div
                    className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-2 ${tones.ring}`}
                >
                    <span className={`h-2 w-2 rounded-full ${tones.dot}`} />
                    {pill}
                </div>
            </div>
        </div>
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
        <td className={`py-3 px-4 text-sm text-slate-700 ${className}`}>{children}</td>
    );
}
