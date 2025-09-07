const express = require("express");
const router = express.Router();
const multer = require("multer");
const VerificationDoc = require("../models/VerificationDoc");

// Disk storage (files will go to uploads/ folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder must exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { user, type, expiresAt } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    const doc = await VerificationDoc.create({
      user,
      type,
      expiresAt,
      filePath: fileUrl, // path store in DB
    });

    res.json({ ok: true, doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Upload failed" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const docs = await VerificationDoc.find({ user: req.params.userId }).sort(
      "-createdAt"
    );
    res.json({ ok: true, docs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to fetch docs" });
  }
});

module.exports = router;
