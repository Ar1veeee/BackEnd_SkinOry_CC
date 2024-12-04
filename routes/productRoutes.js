const express = require("express");
const { BestProducts } = require("../controllers/productController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/best/:user_id", verifyToken, BestProducts);

module.exports = router;
