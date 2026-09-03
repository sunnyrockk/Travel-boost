const router = require("express").Router();
const {
  listExperiences,
  getExperience,
  myExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", listExperiences);
router.get("/mine", protect, requireRole("vendor", "admin"), myExperiences);
router.get("/:id", getExperience);
router.post("/", protect, requireRole("vendor", "admin"), createExperience);
router.put("/:id", protect, requireRole("vendor", "admin"), updateExperience);
router.delete("/:id", protect, requireRole("vendor", "admin"), deleteExperience);

module.exports = router;
