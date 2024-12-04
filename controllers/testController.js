const redisClient = require("../config/redistClient");
const { Storage } = require("@google-cloud/storage");
const db = require("../config/db");

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});
const bucketName = process.env.GCP_BUCKET_NAME;

// Test Google Cloud Storage (GCS) Connectivity
exports.testGCS = async (req, res) => {
  try {
    const bucket = storage.bucket(bucketName);

    const [exists] = await bucket.exists();

    if (exists) {
      res.status(200).json({
        message: "Google Cloud Storage is connected and bucket exists!",
      });
    } else {
      res.status(404).json({
        message: "Bucket does not exist!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to connect to Google Cloud Storage!",
      error: error.message,
    });
  }
};

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