const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const packageRoutes = require("./routes/packageRoutes");
const optimizeRoute = require("./routes/optimizeRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ROUTES
app.use("/api", ocrRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", packageRoutes);
app.use("/api/optimize-route", optimizeRoute);
app.use("/api", locationRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend Rute Kurir berjalan");
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});