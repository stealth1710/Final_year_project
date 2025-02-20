const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object

    next(); // Continue to the next middleware or route
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
