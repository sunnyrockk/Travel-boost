const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    destination: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    // Local business contact
    phone: {
      type: String,
      default: "",
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [{ type: String }],

    amenities: [{ type: String }],

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

    roomsAvailable: {
      type: Number,
      default: 10,
      min: 0,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    tags: [{ type: String }],

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

    // Local business verification
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

hotelSchema.index({
  name: "text",
  destination: "text",
  tags: "text",
});

hotelSchema.index({
  location: "2dsphere",
});

module.exports = mongoose.model("Hotel", hotelSchema);