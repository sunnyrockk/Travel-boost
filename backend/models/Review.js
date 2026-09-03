const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemType: { type: String, enum: ["Hotel", "Experience", "TravelService"], required: true },
    item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "itemType" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // verified-review link
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
