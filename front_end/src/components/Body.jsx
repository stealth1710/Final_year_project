import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Body = () => {
  // State to store the fetched hadith and its source
  const [hadith, setHadith] = useState(null);
  const [source, setSource] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for the button

  // Fetch random hadith
  const fetchRandomHadith = async () => {
    setLoading(true); // Start loading animation
    try {
      const response = await fetch("http://localhost:3001/hadiths/random");
      if (!response.ok) {
        throw new Error("Failed to fetch the hadith.");
      }

      const data = await response.json();

      setTimeout(() => {
        if (data && data.text_en) {
          setHadith(data.text_en); // Set the fetched hadith text
          setSource(data.source); // Set the fetched source
          setError(null); // Clear any previous errors
        } else {
          setHadith(null);
          setSource(null);
          setError("Kindly try again");
        }
        setLoading(false); // Stop loading animation
      }, 500); // Add delay to sync animation
    } catch (error) {
      setTimeout(() => {
        setHadith(null);
        setSource(null);
        setError("Error fetching hadith.");
        setLoading(false); // Stop loading animation
      }, 500); // Add delay to sync animation
    }
  };

  // Animation variants for blur effect
  const contentVariants = {
    hidden: { opacity: 0, filter: "blur(10px)" }, // Start hidden with blur
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5 } }, // Fade in with blur resolving
    exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }, // Fade out with blur
  };

  return (
    <div className="container text-center mt-10">
      {/* Title */}
      <motion.h1
        className="text-4xl font-thin tracking-tight mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        Hadith Generator
      </motion.h1>

      {/* Generate Button */}
      <motion.button
        className="btn btn-primary"
        onClick={fetchRandomHadith}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        disabled={loading} // Disable button during loading
      >
        {loading ? "Generate" : "Generate"}
      </motion.button>

      {/* Display the fetched hadith and source */}
      <div className="mt-10">
        <motion.div
          layout // Use Framer Motion's layout property for smooth resizing
          className="alert alert-info"
          style={{
            minHeight: "200px", // Preserve space for content
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence>
            {/* AnimatePresence handles smooth transitions */}
            {hadith && !loading && (
              <motion.div
                key={hadith} // Ensure animation triggers for new content
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Hadith Text */}
                <p className="text-lg font-semibold mb-4">{hadith}</p>
                {/* Source Text */}
                <p className="text-sm font-light text-grey-600 italic">
                  Source: {source || "Unknown"}
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key={error}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Body;
