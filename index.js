const express = require("express");
const cors = require("cors");
const { getDistance } = require("geolib");

const app = express();

// ✅ Enable CORS for all routes
app.use(cors());
app.use(express.json());

// 🏠 Restaurant Location
const RESTAURANT_LOCATION = {
  latitude: 27.853372491266995,
  longitude: 69.11390292443679,
};

// 🚚 Function to calculate delivery price
const calculateDeliveryPrice = (distance) => {
  if (distance > 10) return "Out of delivery range";
  return Math.min(50 + (distance - 1) * 30, 320);
};

// 📌 API Route: Calculate Delivery Fee
app.get("/calculate-delivery", (req, res) => {
  // ✅ Fix CORS for Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

// 📦 Export for Vercel Deployment
module.exports = app;
