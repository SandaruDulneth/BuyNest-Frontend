import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddRiderPage() {
    const [riderId, setRiderId] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [status, setStatus] = useState(false);

    const navigate = useNavigate();

    async function addRider() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        if (!riderId || !email || !name) {
            toast.error("Please fill all required fields");
            return;
        }

        const rider = {
            riderId,
            email,
            Name: name,         // schema uses capital N
            contactNo,
            vehicleType,
            status: Boolean(status),
        };

        try {
            await axios.post("http://localhost:5000/api/riders", rider, {
                headers: { Authorization: "Bearer " + token },
            });
            toast.success("Rider added successfully");
            navigate("/admin/riders");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to add rider");
            console.error(e);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <input
                type="text"
                placeholder="Rider ID"
                className="input input-bordered w-full max-w-xs"
                value={riderId}
                onChange={(e) => setRiderId(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full max-w-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="text"
                placeholder="Rider Name"
                className="input input-bordered w-full max-w-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Contact No"
                className="input input-bordered w-full max-w-xs"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
            />

            {/* You can replace with a simple input if you prefer */}
            <select
                className="select select-bordered w-full max-w-xs"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
            >
                <option value="">Select Vehicle Type</option>
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Other">Other</option>
            </select>

            <label className="label cursor-pointer w-full max-w-xs justify-start gap-3 mt-2">
                <span className="label-text">Active</span>
                <input
                    type="checkbox"
                    className="toggle"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                />
            </label>

            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link
                    to="/admin/riders"
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    Cancel
                </Link>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={addRider}
                >
                    Add Rider
                </button>
            </div>
        </div>
    );
}
