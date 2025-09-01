import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddSupplierPage() {
    const [supplierId, setSupplierId] = useState("");
    const [productId, setProductId] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [stock, setStock] = useState(0);
    const [cost, setCost] = useState(0);
    const [contactNo, setContactNo] = useState("");

    const navigate = useNavigate();

    async function addSupplier() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        if (!supplierId || !productId || !email || !name) {
            toast.error("Please fill all required fields");
            return;
        }

        const supplier = {
            supplierId,
            productId,
            email,
            Name: name, // 👈 note: schema has "Name" with capital N
            stock,
            cost,
            contactNo,
        };

        try {
            await axios.post("http://localhost:5000/api/suppliers", supplier, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            toast.success("Supplier added successfully");
            navigate("/admin/suppliers");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to add supplier");
            console.error(e);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <input
                type="text"
                placeholder="Supplier ID"
                className="input input-bordered w-full max-w-xs"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Product ID"
                className="input input-bordered w-full max-w-xs"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
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
                placeholder="Supplier Name"
                className="input input-bordered w-full max-w-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Stock"
                className="input input-bordered w-full max-w-xs"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
            />
            <input
                type="number"
                placeholder="Cost"
                className="input input-bordered w-full max-w-xs"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
            />
            <input
                type="text"
                placeholder="Contact No"
                className="input input-bordered w-full max-w-xs"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
            />

            <div className="w-full flex justify-center flex-row items-center mt-4">
                <Link
                    to="/admin/suppliers"
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    Cancel
                </Link>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={addSupplier}
                >
                    Add Supplier
                </button>
            </div>
        </div>
    );
}
