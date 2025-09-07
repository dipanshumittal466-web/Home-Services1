const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const VerificationDoc = require("../models/VerificationDoc");

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Disk storage (files go to uploads/ folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload API
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { user, type, expiresAt } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    const doc = await VerificationDoc.create({
      user,
      type,
      expiresAt,
      filePath: fileUrl, // store path in DB
    });

    res.json({ ok: true, doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Upload failed" });
  }
});

// Get user docs
router.get("/user/:userId", async (req, res) => {
  try {
    const docs = await VerificationDoc.find({
      user: req.params.userId,
    }).sort("-createdAt");

    res.json({ ok: true, docs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to fetch docs" });
  }
});

module.exports = router;
