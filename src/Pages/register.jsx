import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName]   = useState("");
    const [email, setEmail]         = useState("");
    const [postcode, setPostcode]   = useState("");
    const [phone, setPhone]         = useState("");
    const [password, setPassword]   = useState("");
    const [agree, setAgree]         = useState(false);

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        if (!agree) {
            toast.error("Please agree to Terms and Conditions");
            return;
        }
        try {
            // extend payload with phone/postcode if your backend supports it
            await axios.post("http://localhost:5000/api/users", {
                firstName, lastName, email, password, phone, postcode
            });
            toast.success("Registration Successful");
            navigate("/login");
        } catch (e) {
            toast.error(e.response?.data?.message || "Registration Failed");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top bar with back + tabs */}
            <div className="mx-auto max-w-6xl px-4 pt-6">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 text-xl">←</Link>
                    <div className="flex gap-8 text-sm font-semibold">
                        <Link to="/login" className="text-gray-500 hover:text-gray-900 pb-2">LOG IN</Link>
                        <span className="pb-2 border-b-2 border-gray-900">REGISTER</span>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-4 max-w-6xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left image panel */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="h-[420px] w-full bg-gray-300 rounded-lg border border-gray-200 grid place-items-center">
                            <span className="text-gray-600">Image</span>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="md:col-span-2">
                        <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
                            <form onSubmit={handleRegister} className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                            placeholder="First name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                            placeholder="Last name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Postcode</label>
                                        <input
                                            value={postcode}
                                            onChange={(e) => setPostcode(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                            placeholder="e.g. 10115"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                            placeholder="+94 7X XXX XXXX"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Password <span className="text-gray-400">(min. of 5 characters)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                                        placeholder="••••••••"
                                        required
                                        minLength={5}
                                    />
                                </div>

                                <label className="mt-4 flex items-start gap-2 text-xs text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={agree}
                                        onChange={(e) => setAgree(e.target.checked)}
                                        className="mt-0.5"
                                    />
                                    <span>
                    By creating your account, you agree with our <span className="underline">Terms and Conditions</span>.
                  </span>
                                </label>

                                <div className="mt-5">
                                    <button
                                        type="submit"
                                        className="w-full rounded-md bg-gray-900 text-white py-2 font-semibold hover:bg-black transition"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>

                            {/* OR line */}
                            <div className="relative">
                                <div className="border-t" />
                                <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-xs text-gray-500">OR</div>
                            </div>

                            {/* Social register */}
                            <div className="p-6">
                                <p className="text-sm text-gray-700 mb-3">Register with:</p>
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

                        {/* Small link for login on mobile */}
                        <p className="mt-4 text-sm text-center md:hidden">
                            Already have an account?{" "}
                            <Link to="/login" className="text-gray-900 underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
