const router = require("express").Router();
const { listReviews, createReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.get("/", listReviews);
router.post("/", protect, createReview);

module.exports = router;
