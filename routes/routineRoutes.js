const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
  getRecommendedProducts,  
  updateAppliedStatus,
  DayRoutine,
  NightRoutine,
  getUserDayRoutines,
  getUserNightRoutines,
} = require("../controllers/routineController");

router.get("/routine/:user_id/day", verifyToken, getUserDayRoutines);
router.get("/routine/:user_id/night", verifyToken, getUserNightRoutines);

router.get(
  "/routine/:user_id/:category",
  verifyToken,
  getRecommendedProducts
);

router.post("/routine/:user_id/:category/day", verifyToken, DayRoutine);
router.post("/routine/:user_id/:category/night", verifyToken, NightRoutine);

router.patch("/routine/:user_id/:product_id", verifyToken, updateAppliedStatus);

module.exports = router;
