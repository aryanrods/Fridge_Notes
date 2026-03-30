const User = require("../models/User");
const { generateToken } = require("../middleware/authMiddleware");

// @desc Register a new User
// @route POST  /api/auth/signup
// @access Public
