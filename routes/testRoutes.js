const express = require("express");
const router = express.Router();
const { testAPI, testDB, testRedis, testGCS } = require("../controllers/testController");

router.get("/api", testAPI);
router.get("/db", testDB);
router.get("/redist", testRedis);
router.get("/gcs", testGCS)

module.exports = router;
