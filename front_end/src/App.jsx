import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import AdminOrders from "./pages/AdminOrders"; // Import Admin Orders Page
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home route, protected for logged-in users */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAdminRoute={false}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Sign In Route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Sign Up Route */}
        <Route path="/signup" element={<SignUp />} />

        {/* Cart Route */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute isAdminRoute={false}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Admin Orders Route */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
