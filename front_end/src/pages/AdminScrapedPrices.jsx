import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminScrapedPrices = () => {
  const [scrapedPrices, setScrapedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchScrapedPrices = async () => {
      try {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin");

        if (!isAdmin || isAdmin !== "true") {
          setError("Unauthorized access. Admins only.");
          navigate("/");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/scraped-products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            isadmin: "true",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch scraped prices");

        const data = await response.json();
        setScrapedPrices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapedPrices();
  }, [navigate, API_BASE_URL]);

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
        <h1 className="text-2xl sm:text-3xl font-bold italic text-center mb-6">
          Real-Time Prices
        </h1>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse border border-gray-300 rounded-lg p-4 shadow bg-white"
              >
                <div className="h-4 bg-gray-300 rounded w-10 mb-3" />
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : scrapedPrices.length === 0 ? (
          <p className="text-center">No scraped prices found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scrapedPrices.map((item, index) => (
              <div
                key={item._id}
                className="border border-gray-300 rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition"
              >
                <div className="text-xs text-gray-500 mb-1">{index + 1}</div>
                <h3 className="text-lg font-semibold text-[#11454A] mb-2">
                  {item.product_name}
                </h3>
                <p className="text-sm mb-1">
                  <span className="font-medium">Source :</span> {item.source}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Price :</span> {item.price}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Updated :</span>{" "}
                  {item.updated_at}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminScrapedPrices;
