const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 🔐 Auth middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next(); // ✅ IMPORTANT
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  // 🔌 Connection
  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.user.name} (${socket.id})`);

    // 🏠 Join house
    socket.on("join:house", (houseId) => {
      socket.join(`house:${houseId}`);
      console.log(`${socket.user.name} joined house: ${houseId}`);
    });

    // 🚪 Leave house
    socket.on("leave:house", (houseId) => {
      socket.leave(`house:${houseId}`);
      console.log(`${socket.user.name} left house: ${houseId}`);
    });

    // ❌ Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.user.name} (${socket.id})`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
