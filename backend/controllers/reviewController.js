const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const Experience = require("../models/Experience");
const TravelService = require("../models/TravelService");

const MODELS = { Hotel, Experience, TravelService };

exports.listReviews = async (req, res) => {
  try {
    const { itemType, item } = req.query;
    if (!MODELS[itemType] || !item) return res.status(400).json({ message: "itemType and item are required" });
    const reviews = await Review.find({ itemType, item }).populate("user", "name avatar").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { booking: bookingId, rating, comment = "" } = req.body;
    const booking = await Booking.findOne({ _id: bookingId, user: req.user.id });
    if (!booking || !["confirmed", "completed"].includes(booking.status)) {
      return res.status(400).json({ message: "A confirmed booking is required to leave a review" });
    }
    const score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
    }
    const review = await Review.create({
      user: req.user.id, itemType: booking.itemType, item: booking.item, booking: booking._id, rating: score, comment,
    });
    const aggregate = await Review.aggregate([
      { $match: { itemType: booking.itemType, item: booking.item } },
      { $group: { _id: null, rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
    ]);
    await MODELS[booking.itemType].findByIdAndUpdate(booking.item, {
      rating: Math.round((aggregate[0].rating || 0) * 10) / 10,
      reviewCount: aggregate[0].reviewCount || 0,
    });
    res.status(201).json(review);
  } catch (err) {
    const message = err.code === 11000 ? "You have already reviewed this booking" : "Failed to create review";
    res.status(400).json({ message, error: err.message });
  }
};
