import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaChartLine, FaUserCheck, FaClipboardList } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";

const AdminPanel = () => {
  const navigate = useNavigate();

  const cards = [
    {
      label: "Product Price Update",
      icon: <FaTag className="text-3xl text-[#11454A]" />,
      path: "/admin/price-update",
      border: "border-blue-500",
    },
    {
      label: "Real-Time Prices",
      icon: <FaChartLine className="text-3xl text-[#11454A]" />,
      path: "/admin/scraped-prices",
      border: "border-purple-500",
    },
    {
      label: "User Approvals",
      icon: <FaUserCheck className="text-3xl text-[#11454A]" />,
      path: "/admin/user-approvals",
      border: "border-green-500",
    },
    {
      label: "Order Management",
      icon: <FaClipboardList className="text-3xl text-[#11454A]" />,
      path: "/admin/orders",
      border: "border-yellow-500",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <div className="container mx-auto p-6 min-h-[calc(100vh-80px)] flex flex-col justify-start">
        <h2 className="text-[20px] md:text-[30px] lg:text-[40px] font-bold italic text-center text-[#11454A]">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.path)}
              className={`flex flex-col justify-between items-start p-6 border-4 rounded-xl h-48 hover:shadow-xl transition duration-300 text-left bg-gray-100 ${card.border}`}
            >
              <div className="self-end">{card.icon}</div>
              <span className="text-lg font-bold text-[#11454A]  italic">
                {card.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
