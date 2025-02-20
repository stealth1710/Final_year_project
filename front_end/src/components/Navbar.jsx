import React from "react";
import ukFlag from "../assets/pics/ukflag.png";
import ksaFlag from "../assets/pics/ksa.webp";
import { motion } from "framer-motion";

const Navbar = ({ toggleLanguage, currentLanguage }) => {
  return (
    <nav className="bg-[#11454A] text-white h-[100px] p-4 sticky top-0 shadow-md z-50">
      <div className="w-full flex items-center justify-between">
        {/* Left Title */}
        <div className="pl-2 pt-7 md:pt-0">
          <h1
            className="text-[20px] md:text-[30px] lg:text-[40px] font-bold italic"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Retail Connect
          </h1>
        </div>

        {/* Right Language Switcher */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="text-[16px] font-medium bg-white text-[#11454A] px-3 py-1 rounded-full hover:bg-gray-200"
          >
            <motion.span
              key={currentLanguage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentLanguage === "en" ? "ع" : "En"}
            </motion.span>
          </button>

          {/* Dynamic Flag */}
          <motion.img
            key={currentLanguage} // Trigger re-render for animation
            src={currentLanguage === "en" ? ksaFlag : ukFlag}
            alt={currentLanguage === "en" ? "UK Flag" : "KSA Flag"}
            className="w-8 h-8 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
