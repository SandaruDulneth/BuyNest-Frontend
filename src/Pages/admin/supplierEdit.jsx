import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditSupplierPage() {
    const location = useLocation();
    const navigate = useNavigate();


    const [supplierId, setSupplierId] = useState(location.state.supplierId);
    const [productId, setProductId]   = useState(location.state.productId);
    const [email, setEmail]           = useState(location.state.email);
    const [name, setName]             = useState(location.state.Name); // schema uses "Name"
    const [stock, setStock]           = useState(location.state.stock);
    const [cost, setCost]             = useState(location.state.cost);
    const [contactNo, setContactNo]   = useState(location.state.contactNo || "");

    async function updateSupplier() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }


        const body = {
            supplierId,
            productId,
            email,
            Name: name,
            stock: Number(stock),
            cost: Number(cost),
            contactNo,
        };

        try {
            await axios.put(`http://localhost:5000/api/suppliers/${supplierId}`, body, {
                headers: { Authorization: "Bearer " + token },
            });
            toast.success("Supplier updated successfully");
            navigate("/admin/suppliers");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Failed to update supplier");
            console.error(e);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">Edit Supplier</h1>

            <input
                type="text"
                disabled
                placeholder="Supplier ID"
                className="input input-bordered w-full max-w-xs"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
            />

            <input
                type="text"
                disabled
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
                    onClick={updateSupplier}
                >
                    Update Supplier
                </button>
            </div>
        </div>
    );
}
