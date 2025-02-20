module.exports = (req, res, next) => {
   

  // Extract admin flag from headers
  const isAdminHeader = req.header("isadmin");

  // Check if the admin flag exists and is correctly set
  if (!isAdminHeader || isAdminHeader !== "true") {
    return res.status(403).json({ message: "Unauthorized access. Admins only." });
  }

  next();
};
