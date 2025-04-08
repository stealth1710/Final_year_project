import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const API_BASE_URL = import.meta.env.VITE_API_URL;

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

    if (
      formData.email === adminCredentials.email &&
      formData.password === adminCredentials.password
    ) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
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
        localStorage.removeItem("isAdmin");
        navigate("/home");
      } else {
        setError(data.message || "Sign-in failed");
      }
    } catch (err) {
      setError("An error occurred during sign-in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#11454A] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center justify-between gap-10">
        
        {/* Retail Connect Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white text-4xl font-bold italic font-[Inter] flex space-x-0.5 mb-8 md:mb-0"
        >
          {"Retail Connect.".split("").map((char, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.2 }}
              className="inline-block cursor-pointer"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#AEF3E6] shadow-lg rounded-xl p-6 sm:p-8"
        >
          <h1 className="text-3xl font-bold text-center text-[#11454A] mb-6">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["email", "password"].map((field, idx) => (
              <div key={idx} className="relative">
                <motion.input
                  whileFocus={{ scale: 1.05 }}
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder=" "
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-[#11454A] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#11454A] peer"
                />
                <label
                  className={`absolute transition-all duration-300 ease-in-out text-white ${
                    formData[field]
                      ? "right-4 top-0 text-xs"
                      : "left-4 top-3 text-base"
                  } peer-focus:right-4 peer-focus:top-0 peer-focus:text-xs`}
                >
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace("Password", " Password")}
                </label>
              </div>
            ))}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center text-sm"
              >
                {error}
              </motion.p>
            )}

             <div className="flex justify-end space-x-4 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-2 bg-[#11454A] text-white rounded-full text-base font-semibold shadow-md hover:bg-[#0e3d42] cursor-pointer"
                          >
                            Sign In
                          </motion.button>
                        </div>

            <div className="flex justify-end mt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate("/signup")}
                className="text-sm text-[#11454A] hover:underline cursor-pointer"
              >
                Don’t have an account? 
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
