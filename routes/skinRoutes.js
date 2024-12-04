const express = require("express");
const router = express.Router();
const multer = require("multer");
const { classifySkinAndUpdate } = require("../controllers/skinController");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000000 }, 
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  }
  next(err); 
};

router.post(
  "/classify/:user_id",
  upload.single("image"),
  handleMulterError,
  classifySkinAndUpdate
);

module.exports = router;
