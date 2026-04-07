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

  //Auth middleware for socket connections

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("authentication required"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));
      socket.user = user;
    } catch (err) {
      next(new Error("Invalid token "));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected : ${socket.user.name} (${socket.id})`);
  });
  // Join a house room to receive real-time updates
  socket.on("join:house", (houseId) => {
    socket.join(`house:${houseId}`);
    console.log(`${socket.user.name} joined house room: ${houseId}`);
  });

  // Leave a house room
  socket.on("leave:house", (houseId) => {
    socket.leave(`house:${houseId}`);
    console.log(`${socket.user.name} left house room: ${houseId}`);
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.user.name} (${socket.id})`);
    });
  });
  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
