import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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

        const response = await fetch(`${API_BASE_URL}/orders/admin/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            isAdmin: "true",
          },
        });

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
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 italic">
          Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse border border-gray-300 p-4 rounded shadow bg-white"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="border p-4 rounded shadow-md bg-white flex flex-col gap-2"
              >
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
