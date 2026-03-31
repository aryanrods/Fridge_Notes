require("dotenv").config();
const express = require("express");

const connectDB = require("./config/db");

const app = express();

//Import Routes
const authRoutes = require("./routes/authRoutes");
// Connect to MongoDb
connectDB();

//Middleware
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
//Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 4121;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
