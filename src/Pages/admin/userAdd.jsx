import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddUserPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName,  setLastName]  = useState("");
    const [email,     setEmail]     = useState("");
    const [password,  setPassword]  = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role,      setRole]      = useState("customer");

    const navigate = useNavigate();

    async function addUser() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        if (!firstName || !lastName || !email || !password) {
            toast.error("Please fill all required fields");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const user = { firstName, lastName, email, password, role };

            await axios.post("http://localhost:5000/api/users", user, {
                headers: { Authorization: "Bearer " + token },
            });

            toast.success("User added successfully!");
            navigate("/admin/users");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to add user");
        }
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                    Add New User
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="First Name *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email *"
                        className="input input-bordered w-full p-2 border rounded col-span-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <select
                        className="select select-bordered w-full p-2 border rounded col-span-2"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="customer">Customer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </select>

                    <input
                        type="password"
                        placeholder="Password *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password *"
                        className="input input-bordered w-full p-2 border rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
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
                        onClick={addUser}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                    >
                        Add User
                    </button>
                </div>
            </div>
        </div>
    );
}
