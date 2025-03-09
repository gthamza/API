const express = require("express");
const cors = require("cors");
const { getDistance } = require("geolib");

const app = express();

// ✅ FIX: CORS Middleware (Make Sure It's at the Top)
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, OPTIONS",
    allowedHeaders: "Content-Type",
  })
);
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
  // ✅ FIX: Ensure CORS Headers Exist
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

// ✅ FIX: Handle Preflight (OPTIONS) Requests
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

// 🏠 Default Route
app.get("/", (req, res) => {
  res.send(
    "Delivery API is running! Use /calculate-delivery?latitude=LAT&longitude=LONG"
  );
});

// 🚀 Export for Vercel
module.exports = app;
