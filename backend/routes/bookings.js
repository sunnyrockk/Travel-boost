const router = require("express").Router();
const { createBooking, myBookings, cancelBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createBooking);
router.get("/mine", protect, myBookings);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
