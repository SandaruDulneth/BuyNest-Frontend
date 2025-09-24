import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiFilter, FiSearch, FiRefreshCw, FiPlus } from "react-icons/fi";

export default function AdminRiderPage() {
    const [riders, setRiders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const navigate = useNavigate();


    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [vehicle, setVehicle] = useState("all");


    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);

    // Fetch riders
    useEffect(() => {
        if (!isLoading) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            setIsLoading(false);
            return;
        }

        axios
            .get("http://localhost:5000/api/riders", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                setRiders(Array.isArray(res.data) ? res.data : []);
                setFetchError("");
            })
            .catch((e) => {
                const msg = e.response?.data?.message || "Failed to load riders";
                setFetchError(msg);
                toast.error(msg);
                setRiders([]);
            })
            .finally(() => setIsLoading(false));
    }, [isLoading]);

    function deleteRider(riderId) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }
        axios
            .delete("http://localhost:5000/api/riders/" + riderId, {
                headers: { Authorization: "Bearer " + token },
            })
            .then(() => {
                toast.success("Rider deleted successfully");
                setIsLoading(true); // re-fetch
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to delete rider");
            });
    }


    const { total, activeCount, inactiveCount } = useMemo(() => {
        const total = riders.length;
        const activeCount = riders.filter((r) => !!r.status).length;
        const inactiveCount = total - activeCount;
        return { total, activeCount, inactiveCount };
    }, [riders]);


    const vehicleOptions = useMemo(() => {
        const set = new Set(
            riders
                .map((r) => r?.vehicleType)
                .filter((v) => typeof v === "string" && v.trim().length > 0)
        );
        return ["all", ...Array.from(set)];
    }, [riders]);


    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        return riders.filter((r) => {
            const matchesText =
                term.length === 0 ||
                String(r.riderId || "").toLowerCase().includes(term) ||
                String(r.Name || "").toLowerCase().includes(term) ||
                String(r.email || "").toLowerCase().includes(term);

            const matchesStatus =
                status === "all" ||
                (status === "active" && !!r.status) ||
                (status === "inactive" && !r.status);

            const matchesVehicle =
                vehicle === "all" ||
                String(r.vehicleType || "").toLowerCase() === vehicle.toLowerCase();

            return matchesText && matchesStatus && matchesVehicle;
        });
    }, [riders, q, status, vehicle]);


    useEffect(() => {
        setPage(1);
    }, [q, status, vehicle, riders]);


    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageItems = filtered.slice(start, end);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const clearFilters = () => {
        setQ("");
        setStatus("all");
        setVehicle("all");
    };

    return (
        <div className="relative w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dgreen">
                        Riders Inventory
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your delivery riders, availability and contact details.
                    </p>
                </div>

                <Link
                    to="/admin/add-riders"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-dgreen px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                    <FiPlus className="text-base" />
                    Add Rider
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <StatCard title="Total Riders" value={total} pill="All" tone="emerald" />
                <StatCard title="Active" value={activeCount} pill="Online" tone="green" />
                <StatCard title="Inactive" value={inactiveCount} pill="Offline" tone="amber" />
            </div>

            {/* Filter Toolbar */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <FiFilter />
                        <span className="text-sm font-medium">Filters</span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
                        {/* Search */}
                        <div className="relative md:w-64">
                            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search name, email or ID"
                                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                            />
                        </div>

                        {/* Status */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        {/* Vehicle */}
                        <select
                            value={vehicle}
                            onChange={(e) => setVehicle(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        >
                            {vehicleOptions.map((v) => (
                                <option key={v} value={v}>
                                    {v === "all" ? "All Vehicles" : v}
                                </option>
                            ))}
                        </select>

                        {/* Clear */}
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 active:scale-[.98]"
                            title="Clear filters"
                        >
                            <FiRefreshCw className="text-slate-500" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="w-full h-[40vh] flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                </div>
            ) : fetchError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
                    {fetchError}
                </div>
            ) : (
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
                                    <tr
                                        key={key}
                                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                    >
                                        <Td className="font-semibold">{r.riderId}</Td>
                                        <Td>{r.Name || "-"}</Td>
                                        <Td className="truncate max-w-[260px]">{r.email || "-"}</Td>
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
                                                    onClick={() =>
                                                        navigate("/admin/edit-riders", { state: r })
                                                    }
                                                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteRider(r.riderId)}
                                                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </Td>
                                    </tr>
                                );
                            })}

                            {pageItems.length === 0 && (
                                <tr>
                                    <td
                                        className="py-10 px-4 text-center text-slate-500 italic"
                                        colSpan={7}
                                    >
                                        No riders match your filters.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-3">
                        <button
                            onClick={() => canPrev && setPage((p) => p - 1)}
                            disabled={!canPrev}
                            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition
                ${canPrev
                                ? "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 active:scale-[.99]"
                                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            }`}
                        >
                            Previous
                        </button>

                        <div className="text-xs text-slate-500">
                            Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
                            <span className="font-semibold text-slate-700">{totalPages}</span>
                        </div>

                        <button
                            onClick={() => canNext && setPage((p) => p + 1)}
                            disabled={!canNext}
                            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition
                ${canNext
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.99]"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- tiny UI atoms ---------- */

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
    return <td className={`py-3 px-4 text-sm text-slate-700 ${className}`}>{children}</td>;
}
