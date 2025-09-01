import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminFaqPage() {
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            setIsLoading(false);
            return;
        }
        axios
            .get("http://localhost:5000/api/faqs", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                // Use res.data.faqs instead of res.data
                setFaqs(Array.isArray(res.data.faqs) ? res.data.faqs : []);
                setIsLoading(false);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to load FAQs");
                setFaqs([]);
                setIsLoading(false);
            });

    }, [isLoading]);

    function deleteFaq(faqId) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }
        axios
            .delete(`http://localhost:5000/api/faqs/${faqId}`, {
                headers: { Authorization: "Bearer " + token },
            })
            .then(() => {
                toast.success("FAQ deleted successfully");
                setIsLoading(true);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to delete FAQ");
            });
    }

    return (
        <div className="relative w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">
            <Link
                to="/admin/add-faqs"
                className="fixed bottom-6 right-6 bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300"
            >
                + Add FAQ
            </Link>

            {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[var(--color-accent)] text-white">
                        <tr>
                            <th className="py-3 px-3">FAQ ID</th>
                            <th className="py-3 px-3 w-1/3">Question</th>
                            <th className="py-3 px-3 w-1/2">Answer</th>
                            <th className="py-3 px-3 text-center">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {faqs.map((f, index) => {
                            const key = f.faqId || f._id || index;
                            return (
                                <tr
                                    key={key}
                                    className={`${index % 2 === 0 ? "bg-[var(--color-primary)]" : "bg-gray-100"} hover:bg-gray-200 transition`}
                                >
                                    <td className="py-2 px-3 align-top">{f.faqId}</td>
                                    <td className="py-2 px-3 align-top">{f.question || "-"}</td>
                                    <td className="py-2 px-3 align-top">{f.answer || "-"}</td>
                                    <td className="py-2 px-3">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => navigate("/admin/edit-faqs", { state: f })}
                                                className="text-blue-500 hover:text-blue-700 transition"
                                                title="Edit"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteFaq(f.faqId)}
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

                        {faqs.length === 0 && (
                            <tr>
                                <td className="py-6 px-3 text-gray-500 italic text-center" colSpan={4}>
                                    No FAQs found.
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
