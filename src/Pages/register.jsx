import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import AuthTabs from "../components/AuthTabs.jsx";

export default function RegisterPage() {
    const [firstName, setFirstName]     = useState("");
    const [lastName, setLastName]       = useState("");
    const [email, setEmail]             = useState("");
    const [password, setPassword]       = useState("");
    const [confirmPassword, setConfirm] = useState("");
    const [agree, setAgree]             = useState(false);
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        if (!agree) return toast.error("Please accept the Terms and Conditions");
        if (password !== confirmPassword) return toast.error("Passwords don’t match");

        try {
            await axios.post("http://localhost:5000/api/users", {
                firstName,
                lastName,
                email,
                password,
            });
            toast.success("Registration successful");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-poppins">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-md border border-gray-200">

                {/* Left image */}
                <div className="hidden md:block bg-gray-100">
                    <img src="/pci3.jpeg" alt="Illustration" className="h-full w-full object-cover" />
                </div>

                {/* Right form */}
                <div className="p-8 bg-white">
                    <AuthTabs />

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                            <input
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                required
                            />
                        </div>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                            minLength="8"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                            minLength="8"
                        />

                    
                        <label className="flex items-start gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                className="mt-1 accent-accent"
                                required
                            />
                            <span>
                I agree to the Terms and Conditions.
              </span>
                        </label>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-accent text-white py-2 font-semibold hover:opacity-90 transition"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 border-t border-gray-200" />

                    {/* Social register */}
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
