require("dotenv").config();
const express = require("express");
const { initSocket } = require("./sockets/socketManager");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");

//Import Routes
const authRoutes = require("./routes/authRoutes");
const houseRoutes = require("./routes/houseRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const server = http.createServer(app);

//Initialize Socket.io
initSocket(server);

// Connect to MongoDb
connectDB();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/items", itemRoutes);
//Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 4121;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
