import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdminRoute }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Ensure it checks for admin

  // If the route is for admin but the user is not an admin, redirect to sign-in
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/signin" />;
  }

  // If the route is not admin-specific and the user is not authenticated, redirect to sign-in
  if (!isAdminRoute && !token) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
