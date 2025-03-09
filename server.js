const express = require("express");
const cors = require("cors");
const { getDistance } = require("geolib");

const app = express();
app.use(cors());
app.use(express.json());

// Restaurant Coordinates
const RESTAURANT_LOCATION = {
  latitude: 27.853372491266995,
  longitude: 69.11390292443679,
};

// Function to calculate delivery fee based on distance
const calculateDeliveryPrice = (distance) => {
  if (distance > 10) return "Out of delivery range";
  if (distance <= 1) return 50;
  if (distance <= 2) return 80;
  if (distance <= 3) return 110;
  if (distance <= 4) return 140;
  if (distance <= 5) return 170;
  if (distance <= 6) return 200;
  if (distance <= 7) return 230;
  if (distance <= 8) return 260;
  if (distance <= 9) return 290;
  return 320; // 9.1km to 10km
};

// API Endpoint to calculate delivery fee
app.get("/calculate-delivery", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // Calculate distance (in meters) and convert to kilometers
  const distance =
    getDistance({ latitude: lat, longitude: lon }, RESTAURANT_LOCATION) / 1000;

  const deliveryPrice = calculateDeliveryPrice(distance);

  return res.json({ distance: distance.toFixed(2), deliveryPrice });
});

// Handle preflight OPTIONS request
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// Default route for browser testing
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Delivery API! Use /calculate-delivery?latitude=YOUR_LAT&longitude=YOUR_LONG"
  );
});

// Start Server
const PORT = 5007;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
