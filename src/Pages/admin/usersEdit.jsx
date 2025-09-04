import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditUserPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId: userIdFromParams } = useParams();


    const initial = location?.state || {};
    const [userId, setUserId] = useState(initial.userId || userIdFromParams || "");
    const [firstName, setFirstName] = useState(initial.firstName || "");
    const [lastName, setLastName] = useState(initial.lastName || "");
    const [email, setEmail] = useState(initial.email || "");
    const [role, setRole] = useState(initial.role || "");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(!initial.userId && !!userIdFromParams);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        async function fetchOne() {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }
            try {

                const res = await axios.get(`http://localhost:5000/api/users/${userIdFromParams}`, {
                    headers: { Authorization: "Bearer " + token },
                });
                const u = res.data || {};
                setUserId(u.userId || u._id || "");
                setFirstName(u.firstName || "");
                setLastName(u.lastName || "");
                setEmail(u.email || "");
                setRole(u.role || "");
            } catch (e) {
                toast.error(e.response?.data?.message || "Failed to load user");
                navigate("/admin/users");
            } finally {
                setIsLoading(false);
            }
        }
        if (!initial.userId && userIdFromParams) fetchOne();
    }, [initial.userId, navigate, userIdFromParams]);

    const commonRoles = useMemo(
        () => ["admin", "manager", "staff", "customer"],
        []
    );

    async function updateUser() {
        if (!userId) {
            toast.error("Missing userId");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        setIsSubmitting(true);
        try {
            const body = {

                firstName: firstName?.trim(),
                lastName: lastName?.trim(),
                email: email?.trim(),
                role: role?.trim(),
            };
            if (password?.trim()) body.password = password.trim();

            await axios.put(`http://localhost:5000/api/users/${userId}`, body, {
                headers: { Authorization: "Bearer " + token },
            });

            toast.success("✅ User updated successfully");
            navigate("/admin/users");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to update user");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                    Edit User
                </h2>

                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User ID (disabled) */}
                    <input
                        type="text"
                        disabled
                        placeholder="User ID"
                        className="input input-bordered w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        value={userId}
                        onChange={() => {}}
                    />

                    {/* Role */}
                    <select
                        className="input input-bordered w-full p-2 border rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select role</option>
                        {commonRoles.map((r) => (
                            <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* First Name */}
                    <input
                        type="text"
                        placeholder="First name *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    {/* Last Name */}
                    <input
                        type="text"
                        placeholder="Last name *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <input
                        type="email"
                        placeholder="Email *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password (optional) */}
                <div className="mt-4">
                    <input
                        type="password"
                        placeholder="New Password (leave blank to keep current)"
                        className="input input-bordered w-full p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        If provided, it will be securely hashed by the server.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <Link
                        to="/admin/users"
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={updateUser}
                        disabled={isSubmitting}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded ${
                            isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting ? "Updating..." : "Update User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
