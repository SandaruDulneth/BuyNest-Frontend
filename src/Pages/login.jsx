import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import AuthTabs from "../components/AuthTabs.jsx";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password,
            });
            toast.success("Login successful");
            localStorage.setItem("token", res.data.token);
            if (res.data.role === "admin") navigate("/admin/");
            else navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-poppins">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-md border border-gray-200">

                {/* Left image */}
                <div className="hidden md:block bg-gray-100">
                    <img src="/authimage1.jpeg" alt="Illustration" className="h-full w-full object-cover" />
                </div>

                {/* Right form */}
                <div className="p-8 bg-white font-poppins">
                    <AuthTabs />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                required

                            />
                            {/* Forgot password */}
                            <div className="mt-1 text-right">
                                <button
                                    type="button"
                                    onClick={() => toast("Forgot password route pending")}
                                    className="text-xs text-gray-500 hover:text-accent font-poppins"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-accent text-white py-2 font-semibold hover:opacity-90 transition"
                        >
                            Log In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 border-t border-gray-200" />

                    {/* Social login */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
                        >
                            <FcGoogle className="text-xl" /> Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
