// middleware/planLimit.js
// Checks per-cycle application limit before allowing an action (e.g., apply for job).
// Expected user fields (extend User schema if missing):
// - planName: String
// - appsLimit: Number  (-1 => unlimited)
// - appsUsedCurrentCycle: Number
// - currentPeriodEnd: Date
//
// NOTE: Incrementing the counter after a successful action is your controller's job.
// You can import { incrementUsage } helper to do it safely.

async function incrementUsage(user) {
  if (!user) return;
  if (typeof user.appsLimit === "number" && user.appsLimit !== -1) {
    user.appsUsedCurrentCycle = (user.appsUsedCurrentCycle || 0) + 1;
    await user.save();
  }
}

function withinCycle(user) {
  if (!user || !user.currentPeriodEnd) return true;
  const now = new Date();
  return now <= new Date(user.currentPeriodEnd);
}

module.exports = function planLimit(req, res, next) {
  try {
    const u = req.user;
    if (!u) return res.status(401).json({ error: "Unauthorized" });

    // reset usage if new billing cycle started
    if (!withinCycle(u)) {
      u.appsUsedCurrentCycle = 0;
    }

    const limit = typeof u.appsLimit === "number" ? u.appsLimit : 0;
    const used = typeof u.appsUsedCurrentCycle === "number" ? u.appsUsedCurrentCycle : 0;

    if (limit === -1) return next(); // unlimited
    if (used < limit) return next();

    return res.status(403).json({ error: "Application limit reached for current cycle" });
  } catch (e) {
    console.error("planLimit error:", e);
    return res.status(500).json({ error: "Plan limit check failed" });
  }
};

module.exports.incrementUsage = incrementUsage;
