import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (isLoading) {
      axios
        .get("http://localhost:5000/api/products")
        .then((res) => {
          setProducts(res.data);
          setAllProducts(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load products");
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  function deleteProduct(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    axios
      .delete("http://localhost:5000/api/products/" + productId, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        toast.success("Product deleted successfully");
        setIsLoading(true);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Failed to delete product");
      });
  }

  // filters
  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  }
  function handleStockChange(e) {
    setStockFilter(e.target.value);
    setCurrentPage(1);
  }

  const categories = [
    "All",
    ...new Set(allProducts.flatMap((p) => p.categories || [])),
  ];

  // apply filters + search
  const filteredProducts = allProducts.filter((p) => {
    const categoryMatch =
      selectedCategory === "All" ||
      p.categories.some(
        (c) => c.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );

    let stockMatch = true;
    if (stockFilter === "Low Stock") stockMatch = p.stock > 0 && p.stock < 10;
    else if (stockFilter === "Out of Stock") stockMatch = p.stock === 0;
    else if (stockFilter === "In Stock") stockMatch = p.stock >= 10;

    const searchMatch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && stockMatch && searchMatch;
  });

  // pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  // summary counts
  const totalCount = allProducts.length;
  const inStockCount = allProducts.filter((p) => p.stock >= 10).length;
  const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

  // format LKR prices
  function formatLKR(value) {
    return `LKR ${Number(value).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div className="relative w-full h-full max-h-full overflow-y-auto p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dgreen">Product Inventory</h1>
        <p className="text-gray-500 text-sm">
          Manage your product details, categories, pricing, and stock information.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{inStockCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-slate-300 rounded px-3 py-2"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={handleStockChange}
            className="border border-slate-300 rounded px-3 py-2"
          >
            <option value="All">All Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="In Stock">In Stock</option>
          </select>

          {/* Search with Clear Button */}
          <div className="flex items-center border border-slate-300 rounded px-2 py-1">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>

        <Link
          to="/admin/add-product"
          className="bg-dgreen hover:bg-dgreen/80 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition"
        >
          + Add Product
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
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Product ID</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Name</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Image</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Categories</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Original Price</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Selling Price</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase text-left">Stock</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 transition duration-200 text-sm"
                  >
                    <td className="py-3 px-4 font-medium text-slate-700 text-sm">
                      {item.productId}
                    </td>
                    <td className="py-3 px-4 text-sm">{item.name}</td>
                    <td className="py-3 px-4 text-center">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-full shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {item.categories?.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {formatLKR(item.labelledPrice)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {formatLKR(item.price)}
                    </td>
                    <td className="py-3 px-4">
                      {item.stock === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          Out of Stock
                        </span>
                      ) : item.stock < 10 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          Low ({item.stock})
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {item.stock}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                            onClick={() =>
                                navigate("/admin/edit-product", { state: item })
                            }
                            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(item.productId)}
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
                  <td colSpan="8" className="py-6 text-slate-500 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 bg-slate-50">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-dgreen text-white hover:bg-dgreen/90"
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
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-dgreen text-white hover:bg-dgreen/90"
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
