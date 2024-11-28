const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { AddBestProduct, ShowBestProduct } = require("../controllers/bestproductController");

router.post("/", verifyToken, AddBestProduct);
router.get("/", verifyToken, ShowBestProduct);

module.exports = router;