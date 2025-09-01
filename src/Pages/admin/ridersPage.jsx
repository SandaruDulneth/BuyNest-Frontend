import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminRiderPage() {
    const [riders, setRiders] = useState([]);
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
            .get("http://localhost:5000/api/riders", {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => {
                setRiders(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to load riders");
                setRiders([]);
                setIsLoading(false);
            });
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
                setIsLoading(true);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message || "Failed to delete rider");
            });
    }

    return (
        <div className="relative w-full h-full max-h-full overflow-y-auto p-4 font-[var(--font-main)]">
            <Link
                to="/admin/add-riders"
                className="fixed bottom-6 right-6 bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-bold py-3 px-5 rounded-full shadow-lg transition duration-300"
            >
                + Add Rider
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
                            <th className="py-3 px-2">Rider ID</th>
                            <th className="py-3 px-2">Name</th>
                            <th className="py-3 px-2">Email</th>
                            <th className="py-3 px-2">Contact No</th>
                            <th className="py-3 px-2">Vehicle Type</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {riders.map((r, index) => {
                            const key = r.riderId || r._id || index;
                            const isActive = !!r.status;
                            return (
                                <tr
                                    key={key}
                                    className={`${
                                        index % 2 === 0
                                            ? "bg-[var(--color-primary)]"
                                            : "bg-gray-100"
                                    } hover:bg-gray-200 transition`}
                                >
                                    <td className="py-2 px-2">{r.riderId}</td>
                                    <td className="py-2 px-2">{r.Name || "-"}</td>
                                    <td className="py-2 px-2">{r.email || "-"}</td>
                                    <td className="py-2 px-2">{r.contactNo || "-"}</td>
                                    <td className="py-2 px-2">{r.vehicleType || "-"}</td>
                                    <td className="py-2 px-2">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                                    </td>

                                    <td className="py-2 px-2">
                                        <div className="flex justify-center items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    navigate("/admin/edit-riders", { state: r })
                                                }
                                                className="text-blue-500 hover:text-blue-700 transition"
                                                title="Edit"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteRider(r.riderId)}
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

                        {riders.length === 0 && (
                            <tr>
                                <td className="py-6 px-2 text-gray-500 italic" colSpan={7}>
                                    No riders found.
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
