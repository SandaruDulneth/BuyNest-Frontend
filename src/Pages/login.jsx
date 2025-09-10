import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
            toast.success("Login Successful");
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", res.data.email);
            if (res.data.role === "admin") navigate("/admin/");
            else navigate("/");
        } catch (e) {
            toast.error(e.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top bar with back + tabs */}
            <div className="mx-auto max-w-6xl px-4 pt-6">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 text-xl">←</Link>
                    <div className="flex gap-8 text-sm font-semibold">
                        <span className="pb-2 border-b-2 border-gray-900">LOG IN</span>
                        <Link to="/signup" className="text-gray-500 hover:text-gray-900 pb-2">REGISTER</Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-4 max-w-6xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left image panel (hidden on mobile) */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="h-[420px] w-full bg-gray-300 rounded-lg border border-gray-200 grid place-items-center">
                            <span className="text-gray-600">Image</span>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="md:col-span-2">
                        <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Email */}
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    placeholder="you@example.com"
                                    required
                                />

                                {/* Password */}
                                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                    placeholder="••••••••"
                                    required
                                />

                                <div className="mt-2">
                                    <button
                                        type="button"
                                        className="text-xs text-gray-500 hover:text-gray-900"
                                        onClick={() => toast("Forgot password — wire this route later")}
                                    >
                                        Forgotten your password?
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="w-full rounded-md bg-gray-900 text-white py-2 font-semibold hover:bg-black transition"
                                    >
                                        Log In
                                    </button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="border-t" />

                            {/* Mobile / OTP section (UI only) */}
                            <div className="p-6">
                                <p className="text-xs text-gray-500 mb-3">Or log in with your mobile number</p>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="sm:col-span-8 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                        placeholder="Enter your mobile number"
                                    />
                                    <button
                                        type="button"
                                        className="sm:col-span-4 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium hover:bg-gray-100"
                                        onClick={() => toast("Send/Verify OTP — hook your API")}
                                    >
                                        Verify Number
                                    </button>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="sm:col-span-8 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                        placeholder="OTP Number"
                                    />
                                    <button
                                        type="button"
                                        className="sm:col-span-4 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium hover:bg-gray-100"
                                        onClick={() => toast("Submit OTP — hook your API")}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>

                            {/* OR line */}
                            <div className="relative">
                                <div className="border-t" />
                                <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-xs text-gray-500">OR</div>
                            </div>

                            {/* Social logins */}
                            <div className="p-6">
                                <p className="text-sm text-gray-700 mb-3">log in with:</p>
                                <div className="flex items-center gap-4">
                                    <button type="button" className="h-10 w-10 rounded-full border grid place-items-center hover:bg-gray-50">
                                        <FcGoogle className="text-xl" />
                                    </button>
                                    <button type="button" className="h-10 w-10 rounded-full border grid place-items-center hover:bg-gray-50">
                                        <FaFacebook className="text-lg text-[#1877F2]" />
                                    </button>
                                    <button type="button" className="h-10 w-10 rounded-full border grid place-items-center hover:bg-gray-50">
                                        <FaXTwitter className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Small link for register on mobile */}
                        <p className="mt-4 text-sm text-center md:hidden">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-gray-900 underline">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
