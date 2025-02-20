import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error signing up.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-white shadow-md p-6 rounded-md"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 mb-4 border rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-[#11454A] text-white py-2 rounded-md"
        >
          Sign Up
        </button>
      </form>
      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
};

export default SignUp;
