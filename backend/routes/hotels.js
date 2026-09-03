const router = require("express").Router();
const {
  listHotels,
  getHotel,
  myHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", listHotels);
router.get("/mine", protect, requireRole("vendor", "admin"), myHotels);
router.get("/:id", getHotel);
router.post("/", protect, requireRole("vendor", "admin"), createHotel);
router.put("/:id", protect, requireRole("vendor", "admin"), updateHotel);
router.delete("/:id", protect, requireRole("vendor", "admin"), deleteHotel);

module.exports = router;
