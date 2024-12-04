const redisClient = require("../config/redistClient");
const db = require("../config/db");

// Test API Connectivity
exports.testAPI = (req, res) => {
  res.status(200).json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
};

// Test Database Connectivity
exports.testDB = (req, res) => {
  db.query("SELECT 1", (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database connection failed!",
        error: err.message,
      });
    }
    res.status(200).json({
      message: "Database is connected!",
      results,
    });
  });
};

// Test Redis (Memstore) Connectivity
exports.testRedis = (req, res) => {
  redisClient.ping((err, reply) => {
    if (err) {
      return res.status(500).json({
        message: "Redis connection failed!",
        error: err.message,
      });
    }
    res.status(200).json({
      message: "Redis is connected!",
      reply,
    });
  });
};