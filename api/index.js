const express = require("express");
const cors = require("cors");
const { getDistance } = require("geolib");

const app = express();

// ✅ Enable CORS (Allow requests from frontend)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend to make requests
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Middleware to set CORS headers for every response
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// 🏠 Restaurant Location
const RESTAURANT_LOCATION = {
  latitude: 27.853372491266995,
  longitude: 69.11390292443679,
};

// 🚚 Calculate delivery price based on distance
const calculateDeliveryPrice = (distance) => {
  if (distance > 10) return "Out of delivery range";
  return Math.min(50 + (distance - 1) * 30, 320);
};

// 📌 Route: Calculate Delivery Fee
app.get("/calculate-delivery", (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const distance =
    getDistance({ latitude: lat, longitude: lon }, RESTAURANT_LOCATION) / 1000;
  const deliveryPrice = calculateDeliveryPrice(distance);

  return res.json({ distance: distance.toFixed(2), deliveryPrice });
});

// 🏠 Default Route
app.get("/", (req, res) => {
  res.send(
    "Delivery API is running! Use /calculate-delivery?latitude=LAT&longitude=LONG"
  );
});

// 🚀 Start Server (For local testing)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// 📦 Export for Vercel
module.exports = app;
