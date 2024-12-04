const express = require("express");
const router = express.Router();
const { testAPI, testDB, testRedis } = require("../controllers/testController");

router.get("/api", testAPI);
router.get("/db", testDB);
router.get("/redist", testRedis);

module.exports = router;
