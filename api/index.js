const express = require("express");
const cors = require("cors");
const { getDistance } = require("geolib");

const app = express();

// Enable CORS properly
app.use(
  cors({
    origin: "*", // Allows requests from all domains (for development)
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Restaurant Coordinates
const RESTAURANT_LOCATION = {
  latitude: 27.853372491266995,
  longitude: 69.11390292443679,
};

// Function to calculate delivery fee
const calculateDeliveryPrice = (distance) => {
  if (distance > 10) return "Out of delivery range";
  return Math.min(50 + (distance - 1) * 30, 320);
};

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

  // ✅ Set CORS headers manually for each response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
  return res.json({ distance: distance.toFixed(2), deliveryPrice });
});

// Default Route
app.get("/", (req, res) => {
  res.send(
    "Delivery API is working! Use /calculate-delivery?latitude=LAT&longitude=LONG"
  );
});

// Export for Vercel
module.exports = app;
