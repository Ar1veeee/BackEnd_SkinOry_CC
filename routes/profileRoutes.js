const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
  updatePassword,
  Profile,
} = require("../controllers/profileController");

router.use(verifyToken)
router.patch("/:user_id", verifyToken,updatePassword);
router.get("/:user_id", verifyToken,Profile);

module.exports = router;
