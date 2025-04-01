import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin session and redirect to sign-in
    localStorage.removeItem("isAdmin");
    navigate("/signin");
  };

  return (
    <nav className="bg-[#3B080F] text-white h-auto p-4 sticky top-0 shadow-md z-50">
      <div className="w-full flex items-center justify-between">
        
        {/* Left Title */}
        <div className="pl-2">
          <h1
            className="text-[20px] md:text-[30px] lg:text-[40px] font-bold italic"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Retail Connect
          </h1>
          <p className="text-sm italic text-gray-200">Admin</p>
        </div>
        

        {/* Logout Button */}
        <div>
        <button
  onClick={handleLogout}
  className="text-[16px] font-bold italic bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
>
  Logout
</button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
