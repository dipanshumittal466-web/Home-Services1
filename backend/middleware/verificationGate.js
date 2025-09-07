// middleware/verificationGate.js
// Blocks access if verification/indemnity requirements are not complete.
//
// Expected user fields (extend your User schema if missing):
// - indemnityAcceptedAt: Date
// - verificationDocs: {
//     license: { url: String, expiry: Date },
//     id: { url: String },
//     insurance: { url: String, expiry: Date }
//   }

module.exports = function verificationGate(req, res, next) {
  try {
    const u = req.user;
    if (!u) return res.status(401).json({ error: "Unauthorized" });

    const docs = u.verificationDocs || {};
    const lic = docs.license || {};
    const ins = docs.insurance || {};

    const hasIndemnity = !!u.indemnityAcceptedAt;
    const hasId = !!(docs.id && docs.id.url);
    const hasLicense = !!lic.url && lic.expiry && new Date(lic.expiry) > new Date();
    const hasInsurance = !!ins.url && ins.expiry && new Date(ins.expiry) > new Date();

    if (hasIndemnity && hasId && hasLicense && hasInsurance) {
      return next();
    }
    return res.status(423).json({
      error: "Complete verification & indemnity to proceed",
      details: {
        indemnity: !!hasIndemnity,
        id: !!hasId,
        license: !!hasLicense,
        insurance: !!hasInsurance
      }
    });
  } catch (e) {
    console.error("verificationGate error:", e);
    return res.status(500).json({ error: "Verification check failed" });
  }
};
