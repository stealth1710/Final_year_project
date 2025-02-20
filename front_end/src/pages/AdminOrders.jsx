import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar"; // Import Admin Navbar

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin");

        if (!isAdmin || isAdmin !== "true") {
          setError("Unauthorized access. Admins only.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/orders/admin/orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              isAdmin: "true", // ✅ Send admin flag
            },
          }
        );

        if (response.status === 403) {
          setError("Unauthorized access. Admins only.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Error fetching orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      {/* Admin Navbar */}
      <AdminNavbar />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Orders</h1>

        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 rounded mb-4 shadow-md">
                <p>
                  <strong>User:</strong> {order.user.name} ({order.user.email})
                </p>
                <p>
                  <strong>Items:</strong>{" "}
                  {order.products
                    .map((p) => `${p.productId.name} (x${p.quantity})`)
                    .join(", ")}
                </p>
                <p>
                  <strong>Total Price:</strong> SAR{" "}
                  {order.totalPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      order.status === "Pending"
                        ? "text-yellow-500"
                        : order.status === "Shipped"
                        ? "text-blue-500"
                        : order.status === "Delivered"
                        ? "text-green-500"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-gray-500"
                    } font-bold`}
                  >
                    {order.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
