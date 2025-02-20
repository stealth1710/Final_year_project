import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa"; // Import search icon

// Import all images from the folder
const images = import.meta.glob("../assets/product_pictures/*", { eager: true });

const ProductList = ({ currentLanguage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const name = currentLanguage === "en" ? product.name : product.name_ar;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get the correct image from the imported images
  const getImage = (imagePath) => {
    const imageName = imagePath.split("/").pop(); // Extract the filename from the path
    const match = Object.keys(images).find((key) => key.includes(imageName));
    return match ? images[match].default : ""; // Return the matched image or an empty string
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full md:w-64 lg:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search "
            className="text-black w-full px-4 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Product List */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3,
              duration: 1,
            },
          },
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            className="flex flex-col items-center border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <img
              src={getImage(product.image)}
              alt={product.name}
              className="w-24 h-24 object-contain mb-4 rounded"
            />
            <h2 className="text-lg font-bold text-center">
              {currentLanguage === "en" ? product.name : product.name_ar}
            </h2>
            <p className="font-bold text-blue-600 mt-2">SAR {product.price}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* No Products Found */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products match your search.
        </p>
      )}
    </div>
  );
};

export default ProductList;
