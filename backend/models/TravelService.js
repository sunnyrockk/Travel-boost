const mongoose = require("mongoose");

const travelServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Taxi",
        "Airport Transfer",
        "Local Guide",
        "Bus",
        "Car Rental",
      ],
      required: true,
    },

    destination: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    capacity: {
      type: Number,
      default: 4,
      min: 1,
    },

    durationHours: {
      type: Number,
      default: 2,
      min: 1,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📍 Real local location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // Local service verification
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    isLocalBusiness: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

travelServiceSchema.index({
  location: "2dsphere",
});

travelServiceSchema.index({
  title: "text",
  destination: "text",
  description: "text",
});

module.exports = mongoose.model(
  "TravelService",
  travelServiceSchema
);