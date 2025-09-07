const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Dispute = require("../models/Dispute");

router.get("/summary", async (req, res) => {
  try {
    const [providers, posters, jobs, disputes] = await Promise.all([
      User.countDocuments({ role: "provider" }),
      User.countDocuments({ role: "poster" }),
      Job.countDocuments({}),
      Dispute.countDocuments({})
    ]);
    res.json({ providers, posters, jobs, disputes });
  } catch (e) {
    console.error("analytics/summary error:", e);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

router.get("/trends", async (req, res) => {
  try {
    // naive monthly aggregation on Jobs (createdAt)
    const months = await Job.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ jobsPerMonth: months });
  } catch (e) {
    console.error("analytics/trends error:", e);
    res.status(500).json({ error: "Failed to get trends" });
  }
});

module.exports = router;
