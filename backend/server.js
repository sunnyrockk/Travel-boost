require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotels");
const experienceRoutes = require("./routes/experiences");
const bookingRoutes = require("./routes/bookings");
const plannerRoutes = require("./routes/planner");
const reviewRoutes = require("./routes/reviews");
const travelServiceRoutes = require("./routes/travelServices");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TravelBoost API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/travel-services", travelServiceRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
 app.listen(PORT, "0.0.0.0", () => {
  console.log(`TravelBoost backend running on port ${PORT}`);
});
});