import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminScrapedPrices = () => {
  const [scrapedPrices, setScrapedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load API URL from .env
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchScrapedPrices = async () => {
      try {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin");

        // Ensure only admin can access
        if (!token || isAdmin !== "true") {
          setError("Unauthorized access. Admins only.");
          navigate("/"); // Redirect to homepage
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

        if (!response.ok) {
          throw new Error("Failed to fetch scraped prices");
        }

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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Scraped Prices</h1>

        {loading ? (
          <p className="text-center">Loading scraped prices...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : scrapedPrices.length === 0 ? (
          <p className="text-center">No scraped prices found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2"></th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Source</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {scrapedPrices.map((item,index) => (
                <tr key={item._id} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.product_name}</td>
                  <td className="border p-2">{item.source}</td>
                  <td className="border p-2">{item.price}</td>
                  <td className="border p-2">{item.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminScrapedPrices;
