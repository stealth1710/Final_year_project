import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <motion.h1
  className="text-4xl font-bold mb-4"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  404
</motion.h1>

      <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-[#11454A] text-white rounded-md hover:bg-[#0d363c] transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
