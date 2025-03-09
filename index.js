const express = require("express");
const cors = require("cors");
const { getDistance } = require("geolib");

const app = express();

// ✅ Fix: Apply CORS Middleware Correctly
app.use(
  cors({
    origin: "*", // Allow all origins (change to specific origin in production)
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// ✅ Fix: Manually Set CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ Fix: Handle Preflight (OPTIONS) Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

// 🏠 Restaurant Location
const RESTAURANT_LOCATION = {
  latitude: 27.853372491266995,
  longitude: 69.11390292443679,
};

// 🚚 Function to Calculate Delivery Price
const calculateDeliveryPrice = (distance) => {
  if (distance > 10) return "Out of delivery range";
  return Math.min(50 + (distance - 1) * 30, 320);
};

// 📌 API Route: Calculate Delivery Fee
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

// 🚀 Export for Vercel Deployment
module.exports = app;
