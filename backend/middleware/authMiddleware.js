const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware to protect a route
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWIth("Bearer")
    ) {
      token = req.headers.authorization.split("")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate(
      "houses",
      "name inviteCode emoji",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or user no longer exists.",
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "token expired. Please log in again",
      });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

//Generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_secret, {
    expiresIn: process.env.JWT__EXPIRES_IN || "7d",
  });
};

module.exports = { protect, generateToken };
