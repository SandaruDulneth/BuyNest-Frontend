import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminSupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; // rows per page

  const navigate = useNavigate();

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 2,
      }),
    []
  );

  // format date nicely
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-LK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    if (!isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/suppliers", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setSuppliers(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to load suppliers");
        setSuppliers([]);
        setIsLoading(false);
      });
  }, [isLoading]);

  function deleteSupplier(supplierId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    axios
      .delete("http://localhost:5000/api/suppliers/" + supplierId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        toast.success("Supplier deleted successfully");
        setIsLoading(true);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to delete Supplier");
      });
  }

  // filters + search
  const filteredSuppliers = suppliers.filter((s) => {
    return (
      s.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplierId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // pagination
  const totalPages = Math.ceil(filteredSuppliers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + pageSize
  );

  // summary
  const totalSuppliers = suppliers.length;

  return (
    <div className="relative w-full h-full max-h-full overflow-y-auto p-6 font-[var(--font-main)] bg-gray-50">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Suppliers Inventory</h1>
        <p className="text-gray-500 text-sm">
          Manage your supplier details, stock, and contact information.
        </p>
      </div>

      {/* Summary Card (only total) */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Total Suppliers</p>
          <p className="text-2xl font-bold">{totalSuppliers}</p>
        </div>
      </div>

      {/* Filters Bar (search + add button) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        {/* Search Bar */}
        <div className="flex items-center border border-slate-300 rounded px-2 py-1 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name or supplier ID"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow outline-none px-2 py-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-500 hover:text-red-600 px-2"
            >
              ✕
            </button>
          )}
        </div>

        {/* Add Button */}
        <Link
          to="/admin/add-suppliers"
          className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition"
        >
          + Add Supplier
        </Link>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="min-w-full text-sm md:text-base">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Supplier ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Product ID</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Contact No</th>
                <th className="py-3 px-4">Date</th> {/* ✅ Added Date column */}
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {currentSuppliers.length > 0 ? (
                currentSuppliers.map((s, index) => (
                  <tr
                    key={s.supplierId || index}
                    className="hover:bg-slate-50 transition duration-200"
                  >
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {s.supplierId}
                    </td>
                    <td className="py-3 px-4">{s.Name || "-"}</td>
                    <td className="py-3 px-4">{s.email || "-"}</td>
                    <td className="py-3 px-4">{s.productId || "-"}</td>
                    <td className="py-3 px-4">{Number(s.stock) ?? 0}</td>
                    <td className="py-3 px-4">
                      {typeof s.cost === "number" ? fmt.format(s.cost) : "-"}
                    </td>
                    <td className="py-3 px-4">{s.contactNo || "-"}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(s.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() =>
                            navigate("/admin/edit-suppliers", { state: s })
                          }
                          className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteSupplier(s.supplierId)}
                          className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="py-6 text-slate-500 text-center italic"
                  >
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 bg-slate-50">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-800"
                }`}
              >
                Previous
              </button>
              <p className="text-slate-600 text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-800"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
