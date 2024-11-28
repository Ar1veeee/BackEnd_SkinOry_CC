const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { AddBestProduct, ShowBestProduct } = require("../controllers/bestproductController");

router.use(verifyToken)
router.post("/", AddBestProduct);
router.get("/:user_id", ShowBestProduct);

module.exports = router;