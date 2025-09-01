import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditRiderPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [riderId, setRiderId] = useState(location.state.riderId);
    const [email, setEmail] = useState(location.state.email);
    const [name, setName] = useState(location.state.Name); // capital N in schema
    const [contactNo, setContactNo] = useState(location.state.contactNo || "");
    const [vehicleType, setVehicleType] = useState(location.state.vehicleType || "");
    const [status, setStatus] = useState(Boolean(location.state.status));

    async function updateRider() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        const body = {
            riderId, // keep in body though URL identifies the resource
            email,
            Name: name,
            contactNo,
            vehicleType,
            status: Boolean(status),
        };

        try {
            await axios.put(`http://localhost:5000/api/riders/${riderId}`, body, {
                headers: { Authorization: "Bearer " + token },
            });
            toast.success("Rider updated successfully");
            navigate("/admin/riders");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Failed to update rider");
            console.error(e);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">Edit Rider</h1>

            <input
                type="text"
                disabled
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
                    onClick={updateRider}
                >
                    Update Rider
                </button>
            </div>
        </div>
    );
}
