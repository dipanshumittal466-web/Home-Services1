// routes/admin_disputes.js
const express = require("express");
const router = express.Router();
const Dispute = require("../models/Dispute");

// basic admin check stub - replace with your real auth middleware
function isAdmin(req, res, next) {
  if (req.user && (req.user.role === "admin" || req.user.isAdmin)) return next();
  return res.status(403).json({ error: "Admin only" });
}

// List disputes
router.get("/", isAdmin, async (req, res) => {
  const { status } = req.query;
  const q = {};
  if (status) q.status = status;
  try {
    const list = await Dispute.find(q).sort({ createdAt: -0 });
    res.json(list);
  } catch (e) {
    console.error("admin disputes list error:", e);
    res.status(500).json({ error: "Failed to fetch disputes" });
  }
});

// Update status / add note
router.patch("/:id", isAdmin, async (req, res) => {
  try {
    const update = {};
    if (req.body.status) update.status = req.body.status;
    if (req.body.note) {
      update.$push = { notes: { text: req.body.note, at: new Date(), by: req.user?._id } };
    }
    const item = await Dispute.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ error: "Dispute not found" });
    res.json(item);
  } catch (e) {
    console.error("admin disputes patch error:", e);
    res.status(500).json({ error: "Failed to update dispute" });
  }
});

module.exports = router;
