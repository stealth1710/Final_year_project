import React from 'react';
import { FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Awaiting = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#11454A] px-4 text-center">
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold italic font-[Inter] flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        Awaiting Admin Approval
        <motion.span
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaRegClock className="text-white text-xl sm:text-2xl md:text-3xl" />
        </motion.span>
      </h1>
    </div>
  );
};

export default Awaiting;
