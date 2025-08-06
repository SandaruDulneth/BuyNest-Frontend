
import React from "react";

const products = [
    {
        id: 1,
        name: "Surf Excel Detergent Powder Comfort 1kg",
        image: "/images/deal1.png",
        oldPrice: 540,
        newPrice: 405,
        unit: "/ Unit",
        discount: "25%",
    },
    {
        id: 2,
        name: "Watawala Tea Kahata Pouch 400g",
        image: "/images/deal2.png",
        oldPrice: 1140,
        newPrice: 855,
        unit: "/ Unit",
        discount: "25%",
    },
    {
        id: 3,
        name: "Daily Flavored Milk Uht Chocolate Milk Tetra 180Ml",
        image: "/images/deal3.png",
        oldPrice: 200,
        newPrice: 120,
        unit: "/ KG",
        discount: "20%",
    },
    {
        id: 4,
        name: "Ambewela Full Cream Fresh Milk Tetra 1L\n",
        image: "/images/deal4.png",
        oldPrice: 500,
        newPrice: 420,
        unit: "/ Unit",
        discount: "20%",
    },
    {
        id: 5,
        name: "Yeti Isotonic Yeti Blast Pet Bottle 500ml",
        image: "/images/deal5.png",
        oldPrice: 360,
        newPrice: 270,
        unit: "/ Unit",
        discount: "25%",
    },
];

const DealsRow = () => {
    return (
        <div className="px-6 py-10 font-light">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-700">Top Deals</h2>
            </div>

            <div className="flex gap-15 mb-10 overflow-x-auto pb-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-60 min-w-[240px] bg-white rounded-2xl border shadow p-4 relative"
                    >


                        {/* Product Image */}
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-contain mb-4"
                        />

                        {/* Product Name */}
                        <h3 className="text-sm font-semibold mb-2">{product.name}</h3>

                        {/* Prices */}
                        <p className="text-sm text-gray-400 line-through">Rs {product.oldPrice}.00</p>
                        <p className="text-green-600 font-bold text-md">
                            Rs {product.newPrice}.00 <span className="text-sm">{product.unit}</span>
                        </p>

                        {/* Add to Cart Button */}
                        <button
                            className="mt-4 px-6 py-2 bg-green-400 text-white font-semibold rounded-lg shadow hover:bg-[#ffdd55] hover:text-black transition-colors duration-500 delay-100"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsRow;
