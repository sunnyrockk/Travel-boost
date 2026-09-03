const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemType: { type: String, enum: ["Hotel", "Experience", "TravelService"], required: true },
    item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "itemType" },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    guests: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "confirmed" },
    couponCode: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
