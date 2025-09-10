import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";

export default function EditProductPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [productId] = useState(location.state.productId); // ID stays fixed
  const [name, setName] = useState(location.state.name);
  const [category, setCategory] = useState(location.state.categories[0] || ""); // single category
  const [description, setDescription] = useState(location.state.description);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(location.state.images || []);
  const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice);
  const [price, setPrice] = useState(location.state.price);
  const [stock, setStock] = useState(location.state.stock);

  // predefined categories
  const categoriesList = [
    "Fresh Fruits",
    "Meat & Fish",
    "Snacks",
    "Fresh Vegetables",
    "Cooking Essentials",
    "Milk & Diary",
    "Health & Wellness",
    "Beverages",
    "Household Needs",
    "Personal Care",
    "Spices & Masalas",
    "Tea & Coffee",
    "Baby Care",
    "Canned & Packaged Food",
    "Frozen Foods",
    "Pet Supplies",
    "Offers",
  ];

  function handleImageChange(e) {
    const files = e.target.files;
    setImages(files);
    setPreviewImages([...files].map((f) => URL.createObjectURL(f)));
  }

  function removeImage(idx) {
    const newPreviews = [...previewImages];
    newPreviews.splice(idx, 1);
    setPreviewImages(newPreviews);
  }

  async function updateProduct() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    let imageUrls = location.state.images;
    if (images.length > 0) {
      imageUrls = await Promise.all([...images].map((f) => mediaUpload(f)));
    }

    const product = {
      productId,
      name,
      categories: [category], // now single dropdown value
      description,
      images: imageUrls,
      labelledPrice,
      price,
      stock,
    };

    axios
        .put(`http://localhost:5000/api/products/${productId}`, product, {
          headers: { Authorization: "Bearer " + token },
        })
        .then(() => {
          toast.success("✅ Product updated successfully");
          navigate("/admin/products");
        })
        .catch((e) => {
          toast.error(e.response?.data?.message || "Failed to update product");
        });
  }

  return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-50 p-6">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Edit Product
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Product ID (disabled) */}
            <input
                type="text"
                disabled
                placeholder="Product ID"
                className="input input-bordered w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                value={productId}
            />

            <input
                type="text"
                placeholder="Product Name *"
                className="input input-bordered w-full p-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {/* Category Dropdown */}
            <select
                className="input input-bordered w-full p-2 border rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category *</option>
              {categoriesList.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
              ))}
            </select>

            <input
                type="number"
                placeholder="Stock *"
                className="input input-bordered w-full p-2 border rounded"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <textarea
              placeholder="Description"
              className="textarea textarea-bordered w-full mt-4 p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
                type="number"
                placeholder="Original Price *"
                className="input input-bordered w-full p-2 border rounded"
                value={labelledPrice}
                onChange={(e) => setLabelledPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Selling Price *"
                className="input input-bordered w-full p-2 border rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
            <input
                type="file"
                multiple
                className="hidden"
                id="imageUpload"
                onChange={handleImageChange}
            />
            <label
                htmlFor="imageUpload"
                className="cursor-pointer text-green-700 font-medium"
            >
              Click to upload new product images
            </label>

            <div className="flex flex-wrap gap-4 mt-4">
              {previewImages.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                        src={src}
                        alt="preview"
                        className="h-28 w-28 object-cover border rounded"
                    />
                    <button
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                        onClick={() => removeImage(idx)}
                    >
                      ❌
                    </button>
                  </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Link
                to="/admin/products"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </Link>
            <button
                onClick={updateProduct}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
  );
}
