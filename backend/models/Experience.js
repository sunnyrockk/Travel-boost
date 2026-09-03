const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Adventure",
        "Cultural",
        "Food & Dining",
        "Nature",
        "Wellness",
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

    durationHours: {
      type: Number,
      default: 2,
      min: 1,
    },

    images: [{ type: String }],

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

    // Local experience verification
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

experienceSchema.index({
  location: "2dsphere",
});

experienceSchema.index({
  title: "text",
  destination: "text",
  description: "text",
});

module.exports = mongoose.model("Experience", experienceSchema);