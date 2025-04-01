import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [formError, setFormError] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errorMessages.length > 0 || fieldErrors[name]) {
      setErrorMessages([]);
      setFieldErrors({ ...fieldErrors, [name]: false });
      setFormError(false);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFieldErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
      confirmPassword:
        formData.confirmPassword.trim() === "" ||
        formData.confirmPassword !== formData.password,
    };

    setFieldErrors(newFieldErrors);

    const errors = [];
    if (newFieldErrors.name) errors.push("Please enter your name.");
    if (newFieldErrors.email) errors.push("Please provide a valid email.");
    if (newFieldErrors.password) errors.push("Please enter a password.");
    if (newFieldErrors.confirmPassword) errors.push("Passwords do not match.");

    if (errors.length > 0) {
      setErrorMessages(errors);
      setFormError(true);
      return;
    }

    setErrorMessages([]);
    setFormError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setMessage(data.message);

      //  Reset form fields after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      if (data.message === "Sign-up successful. Awaiting admin approval.") {
        navigate("/Awaiting-Approval");
      }
    } catch (error) {
      setMessage("Error signing up.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#11454A] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center justify-between gap-10">
        {/* Brand / Logo */}
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

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md shadow-lg rounded-xl p-4 sm:p-8 bg-[#AEF3E6]"
        >
          <h1 className="text-3xl font-bold text-center text-[#11454A] mb-6">
            Sign Up
          </h1>

          {errorMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4"
            >
              {errorMessages.map((msg, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {msg}
                </motion.p>
              ))}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "email", "password", "confirmPassword"].map(
              (field, idx) => (
                <div key={idx} className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.05 }}
                    type={field.includes("password") ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder=" "
                    className={`w-full px-4 py-3 border border-gray-300 rounded-md ${
                      fieldErrors[field] && formError
                        ? "bg-red-500"
                        : "bg-[#11454A]"
                    } text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#11454A] peer`}
                  />
                  <label
                    className={`absolute transition-all duration-300 ease-in-out text-white ${
                      formData[field]
                        ? "right-4 top-0 text-xs"
                        : "left-4 top-3 text-base"
                    } peer-focus:right-4 peer-focus:top-0 peer-focus:text-xs`}
                  >
                    {field
                      .charAt(0)
                      .toUpperCase()
                      .concat(field.slice(1).replace(/Password/g, " Password"))}
                  </label>
                </div>
              )
            )}
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}

            <div className="flex justify-end space-x-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-[#11454A] text-white rounded-full text-base font-semibold shadow-md hover:bg-[#0e3d42] cursor-pointer"
              >
                Sign Up
              </motion.button>
            </div>

            <div className="flex justify-end mt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => (window.location.href = "/signin")}
                className="text-sm text-[#11454A] hover:underline cursor-pointer"
              >
                Already have an account?
              </motion.button>
            </div>
          </form>

          {message && (
            <p className="text-center mt-4 text-[#11454A] font-medium">
              {message}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
