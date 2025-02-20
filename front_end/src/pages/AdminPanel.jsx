import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar"; // Import the AdminNavbar component

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [updatedPrices, setUpdatedPrices] = useState({});

  //Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch pending users
    const fetchPendingUsers = async () => {
      const response = await fetch(`${API_BASE_URL}/admin/pending-users`);
      const data = await response.json();
      setPendingUsers(data);
    };

    // Fetch products
    const fetchProducts = async () => {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      setProducts(data);
    };

    fetchPendingUsers();
    fetchProducts();
  }, []);

  const approveUser = async (id) => {
    await fetch(`${API_BASE_URL}/admin/approve-user/${id}`, {
      method: "PUT",
    });
    setPendingUsers((prev) => prev.filter((user) => user._id !== id));
  };

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

    // Clear updated price for this product
    setUpdatedPrices((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <>
      {/* Add the Admin Navbar */}
      <AdminNavbar />

      <div className="container mx-auto p-4">
        {/* Pending Users Section */}
        <h2 className="text-xl font-bold mb-2">Pending Users</h2>
        {pendingUsers.length === 0 ? (
          <p className="text-center">No pending users.</p>
        ) : (
          <ul>
            {pendingUsers.map((user) => (
              <li key={user._id} className="mb-4 flex justify-between">
                <span>
                  {user.name} ({user.email})
                </span>
                <button
                  onClick={() => approveUser(user._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Products Section */}
        <h2 className="text-xl font-bold mt-8 mb-2">Products</h2>
        {products.length === 0 ? (
          <p className="text-center">No products available.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li
                key={product._id}
                className="mb-4 flex justify-between items-center"
              >
                <div>
                  <span className="font-bold">{product.name}</span> - SAR{" "}
                  {product.price}
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="New Price"
                    value={updatedPrices[product._id] || ""}
                    onChange={(e) =>
                      handlePriceChange(product._id, e.target.value)
                    }
                    className="border px-2 py-1 mr-2 rounded"
                  />
                  <button
                    onClick={() => updatePrice(product._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Update Price
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
