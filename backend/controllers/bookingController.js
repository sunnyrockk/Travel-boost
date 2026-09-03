const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Experience = require("../models/Experience");
const TravelService = require("../models/TravelService");

const MODELS = { Hotel, Experience, TravelService };

exports.createBooking = async (req, res) => {
  try {
    const { itemType, item, checkIn, checkOut, guests, couponCode } = req.body;
    const Model = MODELS[itemType];
    if (!Model) return res.status(400).json({ message: "itemType must be Hotel, Experience, or TravelService" });

    const partySize = Number(guests || 1);
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : null;
    if (!checkIn || Number.isNaN(start.getTime()) || partySize < 1) {
      return res.status(400).json({ message: "A valid booking date and at least one guest are required" });
    }
    if (itemType === "Hotel" && (!end || Number.isNaN(end.getTime()) || end <= start)) {
      return res.status(400).json({ message: "Hotel check-out must be after check-in" });
    }

    const doc = await Model.findById(item);
    if (!doc) return res.status(404).json({ message: `${itemType} not found` });

    let totalPrice;
    if (itemType === "Hotel") {
      const nights = checkOut
        ? Math.ceil((end - start) / 86400000)
        : 1;
      totalPrice = doc.pricePerNight * nights;
    } else {
      totalPrice = doc.price * (guests || 1);
    }

    // simple coupon logic
    const coupons = { TRAVEL20: 0.2, FLY15: 0.15 };
    const normalizedCoupon = (couponCode || "").toUpperCase();
    if (coupons[normalizedCoupon]) {
      totalPrice = Math.round(totalPrice * (1 - coupons[normalizedCoupon]));
    }

    if (itemType === "Hotel") {
      const reserved = await Hotel.findOneAndUpdate(
        { _id: item, roomsAvailable: { $gt: 0 } },
        { $inc: { roomsAvailable: -1 } },
        { new: true }
      );
      if (!reserved) return res.status(409).json({ message: "This hotel is sold out" });
    }

    let booking;
    try {
      booking = await Booking.create({
      user: req.user.id,
      itemType,
      item,
      checkIn: start,
      checkOut: end,
      guests: partySize,
      totalPrice,
      couponCode: normalizedCoupon,
      });
    } catch (error) {
      if (itemType === "Hotel") await Hotel.findByIdAndUpdate(item, { $inc: { roomsAvailable: 1 } });
      throw error;
    }

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: "Failed to create booking", error: err.message });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("item")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: { $in: ["pending", "confirmed"] } },
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.itemType === "Hotel") {
      await Hotel.findByIdAndUpdate(booking.item, { $inc: { roomsAvailable: 1 } });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};
