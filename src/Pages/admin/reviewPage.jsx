import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


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

    function deleteReview (reviewId) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }
        axios
            .delete("http://localhost:5000/api/reviews/" + reviewId, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then(() => {
                toast.success("Review deleted successfully");
                setIsLoading(true);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to delete review");
            });
    }

    return (
        <div className="relative w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">
            <Link
                to="/admin/add-review"
                className="fixed bottom-6 right-6 bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300"
            >
                + Add Review
            </Link>

            {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-center border border-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[var(--color-accent)] text-white">
                        <tr>
                            <th className="py-3 px-2">Review ID</th>
                            <th className="py-3 px-2">User Name</th>
                            <th className="py-3 px-2">Email</th>
                            <th className="py-3 px-2">Rating</th>
                            <th className="py-3 px-2">Comment</th>
                            <th className="py-3 px-2">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {reviews.map((r, index) => {
                            const rowKey = r.reviewId || r._id || index;
                            return (
                                <tr
                                    key={rowKey}
                                    className={`${
                                        index % 2 === 0
                                            ? "bg-[var(--color-primary)]"
                                            : "bg-gray-100"
                                    } hover:bg-gray-200 transition`}
                                >
                                    <td className="py-2 px-2">{r.reviewId}</td>
                                    <td className="py-2 px-2">{r.usersName || "-"}</td>
                                    <td className="py-2 px-2">{r.email || "-"}</td>
                                    <td className="py-2 px-2">{Number(r.rating) || 0}/5</td>

                                    {/* Clamp long comments to one line with ellipsis */}
                                    <td className="py-2 px-2 max-w-[360px]">
                                        <span className="block truncate">{r.comment || "-"}</span>
                                    </td>

                                    <td className="py-2 px-2">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => deleteReview(r.reviewId)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Delete"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {reviews.length === 0 && (
                            <tr>
                                <td className="py-6 px-2 text-gray-500 italic" colSpan={6}>
                                    No reviews found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
