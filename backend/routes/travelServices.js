const router = require("express").Router();
const controller = require("../controllers/travelServiceController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", controller.listServices);
router.get("/mine", protect, requireRole("vendor", "admin"), controller.myServices);
router.post("/", protect, requireRole("vendor", "admin"), controller.createService);
router.put("/:id", protect, requireRole("vendor", "admin"), controller.updateService);
router.delete("/:id", protect, requireRole("vendor", "admin"), controller.deleteService);
module.exports = router;
