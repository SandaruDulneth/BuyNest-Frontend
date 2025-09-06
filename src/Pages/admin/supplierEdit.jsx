import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditSupplierPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [supplierId] = useState(location.state.supplierId); // locked
  const [productId] = useState(location.state.productId);   // locked
  const [email, setEmail] = useState(location.state.email);
  const [name, setName] = useState(location.state.Name); // schema uses "Name"
  const [stock, setStock] = useState(location.state.stock);
  const [cost, setCost] = useState(location.state.cost);
  const [contactNo, setContactNo] = useState(location.state.contactNo || "");

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Edit Supplier
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Update supplier details including contact, stock and cost.
        </p>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supplier ID (disabled) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supplier ID *
            </label>
            <input
              type="text"
              disabled
              value={supplierId}
              className="w-full rounded-lg border border-slate-300 bg-gray-100 px-3 py-2 focus:outline-none text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Product ID (disabled) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Product ID *
            </label>
            <input
              type="text"
              disabled
              value={productId}
              className="w-full rounded-lg border border-slate-300 bg-gray-100 px-3 py-2 focus:outline-none text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supplier@email.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supplier Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Supplier Name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock quantity"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cost (LKR)
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Cost"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* Contact No */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact No
            </label>
            <input
              type="text"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              placeholder="+94 71 123 4567"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Link
            to="/admin/suppliers"
            className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </Link>
          <button
            onClick={updateSupplier}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Update Supplier
          </button>
        </div>
      </div>
    </div>
  );
}
