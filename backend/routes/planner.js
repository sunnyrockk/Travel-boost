const router = require("express").Router();
const { generateItinerary } = require("../controllers/plannerController");

router.post("/", generateItinerary);

module.exports = router;
