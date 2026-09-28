const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // -----------------------------------------
    // Get token from Authorization header
    // -----------------------------------------

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -----------------------------------------
    // Extract token
    // -----------------------------------------

    const token = authHeader.split(" ")[1];

    // -----------------------------------------
    // Verify token
    // -----------------------------------------

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // -----------------------------------------
    // Find user
    // -----------------------------------------

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // -----------------------------------------
    // Check admin role
    // -----------------------------------------

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // -----------------------------------------
    // Attach user to request
    // -----------------------------------------

    req.user = user;

    next();
  } catch (error) {
    // Invalid or expired token
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = {
  protect,
};