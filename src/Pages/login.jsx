import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password,
            });

            toast.success("Login Successful");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.email);

            if (response.data.role === "admin") {
                navigate("/admin/");
            } else {
                navigate("/");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>


                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
