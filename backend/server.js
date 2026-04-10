require("dotenv").config();
const express = require("express");
const { initSocket } = require("./sockets/socketManager");
const http = require("http");

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
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/items", itemRoutes);
//Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 4121;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
