import { useEffect, useMemo, useState } from "react";
import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // toolbar state
    const [q, setQ] = useState(""); // search text (name/email/comment/id)
    const [minRating, setMinRating] = useState("all"); // all | 5..1

    useEffect(() => {
        if (!isLoading) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            setIsLoading(false);
            return;
        }

        axios
            .get("http://localhost:5000/api/reviews", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                setReviews(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to load reviews");
                setReviews([]);
                setIsLoading(false);
            });
    }, [isLoading]);

    // ---------- KPIs ----------
    const kpis = useMemo(() => {
        const total = reviews.length;
        const sum = reviews.reduce((a, r) => a + Number(r.rating || 0), 0);
        const avg = total ? (sum / total).toFixed(1) : "0.0";
        const fiveStar = reviews.filter((r) => Number(r.rating) === 5).length;
        return { total, avg, fiveStar };
    }, [reviews]);

    // ---------- Filtering ----------
    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        const min = minRating === "all" ? 0 : Number(minRating);

        return reviews.filter((r) => {
            const matchesText =
                !term ||
                String(r.reviewId || "").toLowerCase().includes(term) ||
                String(r.usersName || "").toLowerCase().includes(term) ||
                String(r.email || "").toLowerCase().includes(term) ||
                String(r.comment || "").toLowerCase().includes(term);

            const ratingNum = Number(r.rating || 0);
            const matchesRating = ratingNum >= min;

            return matchesText && matchesRating;
        });
    }, [reviews, q, minRating]);

    const clearFilters = () => {
        setQ("");
        setMinRating("all");
    };

    return (
        <div className="w-full h-full max-h-full overflow-y-auto p-4 md:p-6 font-[var(--font-main)]">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-bold text-dgreen">
                    Reviews Management
                </h1>
                <p className="text-sm text-slate-500">
                    View, filter, and reply to customer reviews
                </p>
            </div>

            {/* KPI cards */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard title="Total Reviews" value={kpis.total} />
                <KpiCard title="Average Rating" value={`${kpis.avg} / 5`} />
                <KpiCard title="5★ Reviews" value={kpis.fiveStar} />
            </div>

            {/* Toolbar */}
            <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                        <FiFilter />
                        <span className="text-sm font-medium">Filters</span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
                        {/* Search */}
                        <div className="relative md:w-72">
                            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search name, email, ID or comment"
                                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                            />
                        </div>

                        {/* Min rating */}
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">Minimum 5★</option>
                            <option value="4">Minimum 4★</option>
                            <option value="3">Minimum 3★</option>
                            <option value="2">Minimum 2★</option>
                            <option value="1">Minimum 1★</option>
                        </select>

                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 active:scale-[.98]"
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
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <Th>Review ID</Th>
                                <Th>User</Th>
                                <Th>Email</Th>
                                <Th>Rating</Th>
                                <Th>Comment</Th>
                                <Th className="text-center">Actions</Th>
                            </tr>
                            </thead>

                            <tbody>
                            {filtered.map((r, index) => {
                                const rowKey = r.reviewId || r._id || index;
                                const subject = `Reply to your review (${r.reviewId})`;
                                const body = `Hi ${r.usersName || "customer"},%0D%0A%0D%0AThank you for your review:%0D%0A"${r.comment}"%0D%0A%0D%0AWe appreciate your feedback.%0D%0A%0D%0ABest regards,%0D%0AAdmin Team`;

                                return (
                                    <tr
                                        key={rowKey}
                                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                    >
                                        <Td className="max-w-[220px] truncate text-emerald-700 font-medium">
                                            {r.reviewId}
                                        </Td>
                                        <Td>{r.usersName || "-"}</Td>
                                        <Td className="truncate max-w-[260px]">{r.email || "-"}</Td>
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <RatingStars value={Number(r.rating) || 0} />
                                                <span className="text-xs text-slate-500">
                            {(Number(r.rating) || 0).toFixed(1)}
                          </span>
                                            </div>
                                        </Td>
                                        <Td className="max-w-[420px]">
                                            <span className="block truncate">{r.comment || "-"}</span>
                                        </Td>
                                        <Td className="text-center">
                                            <a
                                                href={`mailto:${r.email}?subject=${encodeURIComponent(
                                                    subject
                                                )}&body=${body}`}
                                                className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                                                title="Reply via Email"
                                            >
                                                Reply
                                            </a>
                                        </Td>
                                    </tr>
                                );
                            })}

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        className="py-10 px-4 text-center text-slate-500 italic"
                                        colSpan={6}
                                    >
                                        No reviews match your filters.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}



function KpiCard({ title, value }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3">
            <div className="text-xs text-slate-500">{title}</div>
            <div className="mt-1 text-xl font-bold text-slate-800">{value}</div>
        </div>
    );
}

function RatingStars({ value = 0, outOf = 5 }) {
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5 && full < outOf;
    const empty = outOf - full - (hasHalf ? 1 : 0);

    const Star = ({ type }) => (
        <span
            className={
                type === "full"
                    ? "text-amber-500"
                    : type === "half"
                        ? "text-amber-500"
                        : "text-slate-300"
            }
        >
      {type === "half" ? "☆" : "★"}
    </span>
    );

    return (
        <span className="leading-none text-sm">
      {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} type="full" />
      ))}
            {hasHalf && <Star type="half" />}
            {Array.from({ length: empty }).map((_, i) => (
                <Star key={`e${i}`} type="empty" />
            ))}
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
        <td className={`py-3 px-4 text-sm text-slate-700 ${className}`}>
            {children}
        </td>
    );
}
