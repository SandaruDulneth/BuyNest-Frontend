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
      Name: name, // 👈 backend schema requires capital "N"
      stock,
      cost,
      contactNo,
    };

    try {
      await axios.post("http://localhost:5000/api/suppliers", supplier, {
        headers: { Authorization: "Bearer " + token },
      });
      toast.success("Supplier added successfully");
      navigate("/admin/suppliers");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add supplier");
      console.error(e);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-green-700 text-center mb-2">
          Add New Supplier
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Enter supplier details including product, contact, and stock
          information.
        </p>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact No
            </label>
            <input
              type="text"
              placeholder="+94 71 123 4567"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Link
            to="/admin/suppliers"
            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button
            onClick={addSupplier}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
          >
            Add Supplier
          </button>
        </div>
      </div>
    </div>
  );
}
