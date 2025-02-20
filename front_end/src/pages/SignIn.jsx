import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();


    // Load Admin Credentials & API URL from .env
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const API_BASE_URL = import.meta.env.VITE_API_URL;
    
  // Hardcoded admin credentials
  const adminCredentials = {
    email: adminEmail,
    password: adminPassword,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the entered credentials match admin credentials
    if (
      formData.email === adminCredentials.email &&
      formData.password === adminCredentials.password
    ) {
      localStorage.setItem("isAdmin", "true"); // ✅ Set admin flag
      navigate("/admin"); // Redirect to the Admin Panel
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.removeItem("isAdmin"); // ✅ Ensure admin flag is removed for normal users
        navigate("/");
      } else {
        setError(data.message || "Sign-in failed");
      }
    } catch (err) {
      setError("An error occurred during sign-in");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-white shadow-md p-6 rounded-md"
      >
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email "
          className="w-full px-3 py-2 mb-4 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 mb-4 border rounded-md"
          required
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#11454A] text-white py-2 rounded-md"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
