import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const UserApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const response = await fetch(`${API_BASE_URL}/admin/pending-users`);
      const data = await response.json();
      setPendingUsers(data);
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (id) => {
    await fetch(`${API_BASE_URL}/admin/approve-user/${id}`, {
      method: "PUT",
    });
    setPendingUsers((prev) => prev.filter((user) => user._id !== id));
  };

  const rejectUser = async (id) => {
    await fetch(`${API_BASE_URL}/admin/reject-user/${id}`, {
      method: "DELETE",
    });
    setPendingUsers((prev) => prev.filter((user) => user._id !== id));
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
           User Approvals
        </h2>

        {pendingUsers.length === 0 ? (
          <p className="text-center text-gray-500 italic">No pending users.</p>
        ) : (
          <ul className="space-y-4">
            {pendingUsers.map((user) => (
              <li
                key={user._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded shadow bg-white"
              >
                <div className="text-sm sm:text-base mb-2 sm:mb-0">
                  <span className="font-medium">{user.name}</span> ({user.email})
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => approveUser(user._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
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

export default UserApprovals;
