import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import AdminOrders from "./pages/AdminOrders"; // Import Admin Orders Page
import AdminScrapedPrices from "./pages/AdminScrapedPrices"; // ✅ Import Scraped Prices Page
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Awaiting from "./pages/Awaiting";
import UserApprovals from "./pages/UserApprovals";
import PriceUpdate from "./pages/PriceUpdate";



const App = () => {
  return (
    <Router>
      
        <Routes>
          {/* Home route, protected for logged-in users */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAdminRoute={false}>
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
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

          {/* Admin Scraped Prices Route */}
          <Route
            path="/admin/scraped-prices"
            element={
              <ProtectedRoute isAdminRoute={true}>
                <AdminScrapedPrices />
              </ProtectedRoute>
            }
          />

          {/* Admin User Approvals Route */}
          <Route
            path="/admin/user-approvals"
            element={
              <ProtectedRoute isAdminRoute={true}>
                <UserApprovals />
              </ProtectedRoute>
            }
          />

          {/* Admin Price Update Route */}
          <Route
            path="/admin/price-update"
            element={
              <ProtectedRoute isAdminRoute={true}>
                <PriceUpdate />
              </ProtectedRoute>
            }
          />

          {/* Awaiting Approval Route */}
          <Route path="/Awaiting-Approval" element={<Awaiting />} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      
    </Router>
  );
};

export default App;
