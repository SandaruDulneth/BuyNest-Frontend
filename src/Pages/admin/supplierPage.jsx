/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-emerald-700">
            <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg font-semibold">Loading Suppliers...</p>
        </div>
    );
}

export default function AdminSupplierPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const navigate = useNavigate();
    const fmt = useMemo(
        () =>
            new Intl.NumberFormat("en-LK", {
                style: "currency",
                currency: "LKR",
                maximumFractionDigits: 2,
            }),
        []
    );

    function formatDate(dateStr) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("en-LK", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // ---------- Fetch suppliers ----------
    useEffect(() => {
        if (!isLoading) return;
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            setIsLoading(false);
            return;
        }
        axios
            .get("http://localhost:5000/api/suppliers", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                setSuppliers(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to load suppliers");
                setSuppliers([]);
                setIsLoading(false);
            });
    }, [isLoading]);

    function deleteSupplier(supplierId) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }
        axios
            .delete("http://localhost:5000/api/suppliers/" + supplierId, {
                headers: { Authorization: "Bearer " + token },
            })
            .then(() => {
                toast.success("Supplier deleted successfully");
                setIsLoading(true);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to delete Supplier");
            });
    }

    // Filters & pagination
    const filteredSuppliers = suppliers.filter(
        (s) =>
            s.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.supplierId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filteredSuppliers.length / pageSize);
    const currentSuppliers = filteredSuppliers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalSuppliers = suppliers.length;
    const totalStock = suppliers.reduce(
        (sum, s) => sum + (Number(s.stock) || 0),
        0
    );
    const totalCost = suppliers.reduce(
        (sum, s) => sum + (Number(s.cost) || 0),
        0
    );

    // ---------- Analysis Data for Report ----------
    const analysisData = useMemo(() => {
        if (!fromDate || !toDate) return [];
        const filtered = suppliers.filter((s) => {
            const d = new Date(s.date);
            return d >= fromDate && d <= toDate;
        });

        const map = {};
        filtered.forEach((s) => {
            if (!map[s.Name])
                map[s.Name] = { name: s.Name, totalStock: 0, totalCost: 0 };
            map[s.Name].totalStock += Number(s.stock) || 0;
            map[s.Name].totalCost += Number(s.cost) || 0;
        });

        const arr = Object.values(map);
        const grandCost = arr.reduce((a, b) => a + b.totalCost, 0) || 1;
        return arr.map((x) => ({
            ...x,
            costShare: ((x.totalCost / grandCost) * 100).toFixed(1),
        }));
    }, [suppliers, fromDate, toDate]);

    // ---------- Generate PDF with table heading ----------
    const handleCreateReport = async () => {
        if (!fromDate || !toDate) {
            toast.error("Please select a date range first");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        // Logo & Header
        const logo = new Image();
        logo.src = "/logo1.png";
        await new Promise((res) => (logo.onload = res));
        doc.addImage(logo, "PNG", 15, 10, 25, 15);

        doc.setFontSize(14);
        doc.text("BuyNest Inventory & Supply Cost Analysis", pageWidth / 2, 30, {
            align: "center",
        });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 15, 20, {
            align: "right",
        });

        const fromTxt = fromDate.toLocaleDateString();
        const toTxt = toDate.toLocaleDateString();
        doc.setTextColor(0, 128, 0);
        doc.text(`Report Period: ${fromTxt} - ${toTxt}`, pageWidth / 2, 37, {
            align: "center",
        });
        doc.setTextColor(0, 0, 0);

        // Capture Bar Chart
        const barEl = document.getElementById("stockBarChart");
        if (barEl) {
            const canvas = await html2canvas(barEl, { backgroundColor: "#ffffff" });
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "PNG", 15, 40, pageWidth - 30, 80);
        }

        // ✅ Add Supplier Cost Summary heading above the table
        doc.setFontSize(13);
        doc.setFont(undefined, "bold");
        doc.text("Supplier Cost Summary", pageWidth / 2, 125, { align: "center" });
        doc.setFont(undefined, "normal");

        autoTable(doc, {
            startY: 135,
            head: [["Supplier", "Total Stock", "Total Cost (LKR)", "% of Cost"]],
            body: analysisData.map((row) => [
                row.name,
                row.totalStock,
                fmt.format(row.totalCost),
                `${row.costShare}%`,
            ]),
            styles: { fontSize: 10, halign: "center" },
            headStyles: { fillColor: [16, 185, 129] },
            columnStyles: {
                0: { halign: "left" },
                1: { halign: "right" },
                2: { halign: "right" },
                3: { halign: "right" },
            },
        });

        // Footer
        doc.setFontSize(9);
        doc.text("Report generated by: System Administrator", 15, 285);
        doc.text("BuyNest Supplier Analysis System", 15, 290);
        doc.text("Page 1 / 1", pageWidth - 20, 290);

        doc.save("Supplier_Inventory_Cost_Analysis.pdf");
    };

    if (isLoading)
        return (
            <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
                <LoadingScreen />
            </div>
        );

    return (
        <div className="relative w-full h-full p-6 font-[var(--font-main)]">
            {/* ---- Title ---- */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-dgreen">Suppliers Inventory</h1>
                <p className="text-gray-500 text-sm">
                    Manage your supplier details, stock, and contact information.
                </p>
            </div>

            {/* ---- Summary Cards ---- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <SummaryCard label="Total Suppliers" value={totalSuppliers} />
                <SummaryCard label="Total Stock" value={totalStock} />
                <SummaryCard label="Total Supply Cost" value={fmt.format(totalCost)} />
            </div>

            {/* ---- Search + Add ---- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center border border-slate-300 rounded px-2 py-1 w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search by name or supplier ID"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="flex-grow outline-none px-2 py-1"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-gray-500 hover:text-red-600 px-2"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <Link
                    to="/admin/add-suppliers"
                    className="bg-dgreen hover:bg-dgreen/80 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition"
                >
                    + Add Supplier
                </Link>
            </div>

            {/* ---- Date Range + Create Report ---- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-4 mb-6">
                <div className="flex items-center text-emerald-600 gap-2">
                    <FiCalendar className="text-xl" />
                    <span className="text-sm text-slate-600 font-medium">From:</span>
                    <DatePicker
                        selected={fromDate}
                        onChange={(d) => setFromDate(d)}
                        dateFormat="dd/MM/yyyy"
                        className="border rounded px-3 py-1 text-sm"
                        placeholderText="dd/mm/yyyy"
                    />
                    <span className="text-sm text-slate-600 font-medium">To:</span>
                    <DatePicker
                        selected={toDate}
                        onChange={(d) => setToDate(d)}
                        dateFormat="dd/MM/yyyy"
                        className="border rounded px-3 py-1 text-sm"
                        placeholderText="dd/mm/yyyy"
                    />
                    <button
                        onClick={handleCreateReport}
                        className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm"
                    >
                        Create report
                    </button>
                </div>
            </div>

            {/* ---- Hidden Bar Chart for PDF ---- */}
            <div className="absolute -left-[9999px]">
                <div id="stockBarChart" style={{ width: 800, height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysisData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalStock" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ---- Supplier Table ---- */}
            <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="min-w-full text-sm md:text-base">
                    <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">
                            Supplier ID
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">Name</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">Email</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">
                            Product ID
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">Stock</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">Cost</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">
                            Contact No
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">Date</th>
                        <th className="py-3 px-4 text-xs font-semibold uppercase">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                    {currentSuppliers.length > 0 ? (
                        currentSuppliers.map((s, index) => (
                            <tr
                                key={s.supplierId || index}
                                className="hover:bg-slate-50 transition duration-200"
                            >
                                <td className="py-3 px-4 font-medium text-slate-700">
                                    {s.supplierId}
                                </td>
                                <td className="py-3 px-4">{s.Name || "-"}</td>
                                <td className="py-3 px-4">{s.email || "-"}</td>
                                <td className="py-3 px-4">{s.productId || "-"}</td>
                                <td className="py-3 px-4">{Number(s.stock) ?? 0}</td>
                                <td className="py-3 px-4">
                                    {typeof s.cost === "number" ? fmt.format(s.cost) : "-"}
                                </td>
                                <td className="py-3 px-4">{s.contactNo || "-"}</td>
                                <td className="py-3 px-4 text-gray-600">
                                    {formatDate(s.date)}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() =>
                                                navigate("/admin/edit-suppliers", { state: s })
                                            }
                                            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteSupplier(s.supplierId)}
                                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="py-6 text-slate-500 text-center italic">
                                No suppliers found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 bg-slate-50">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === 1
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-700 text-white hover:bg-slate-800"
                            }`}
                        >
                            Previous
                        </button>
                        <p className="text-slate-600 text-sm">
                            Page {currentPage} of {totalPages}
                        </p>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === totalPages
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : "bg-slate-700 text-white hover:bg-slate-800"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- Summary Card ---------- */
function SummaryCard({ label, value }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
