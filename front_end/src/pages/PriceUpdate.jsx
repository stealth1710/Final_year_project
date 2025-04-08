import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const SkeletonLoader = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-md shadow-md bg-gray-200 animate-pulse">
    <div className="w-1/2 sm:w-1/4 h-4 bg-gray-300 mb-2 sm:mb-0"></div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      <div className="w-1/4 h-8 bg-gray-300 rounded"></div>
      <div className="w-1/4 h-8 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const PriceUpdate = () => {
  const [products, setProducts] = useState([]);
  const [updatedPrices, setUpdatedPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePriceChange = (id, value) => {
    setUpdatedPrices((prev) => ({ ...prev, [id]: value }));
  };

  const updatePrice = async (id) => {
    const newPrice = updatedPrices[id];
    if (!newPrice) return;

    await fetch(`${API_BASE_URL}/products/update-price/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: newPrice }),
    });

    setProducts((prev) =>
      prev.map((product) =>
        product._id === id ? { ...product, price: newPrice } : product
      )
    );

    setUpdatedPrices((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <>
      <AdminNavbar />

      {/* Home Button */}
      <div className="w-full flex justify-start px-4 mt-4">
        <button
          onClick={() => navigate("/admin")}
          className="bg-[#3B080F] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#0e3d42] transition"
        >
          Home
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 italic">
          Product Price Update
        </h2>

        {loading ? (
          // Show skeleton loaders while loading
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-md shadow-md bg-white"
              >
                <div className="text-sm sm:text-base mb-2 sm:mb-0">
                  <span className="font-semibold">{product.name}</span> - SAR {product.price}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    value={updatedPrices[product._id] || ""}
                    onChange={(e) => handlePriceChange(product._id, e.target.value)}
                    placeholder="New Price"
                    className="border px-3 py-2 rounded w-full sm:w-32"
                  />
                  <button
                    onClick={() => updatePrice(product._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PriceUpdate;
