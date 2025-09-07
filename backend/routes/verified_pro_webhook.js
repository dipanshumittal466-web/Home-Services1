const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const User = require("../models/User"); // adjust path if different

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("VerifiedPro webhook signature error:", e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Expect: session.metadata.userId OR customer email lookup
      let user = null;
      if (session.metadata && session.metadata.userId) {
        user = await User.findById(session.metadata.userId);
      }
      if (!user && session.customer) {
        try {
          const cust = await stripe.customers.retrieve(session.customer);
          if (cust?.email) {
            user = await User.findOne({ email: cust.email.toLowerCase() });
          }
        } catch {}
      }
      if (user) {
        const oneYear = new Date();
        oneYear.setFullYear(oneYear.getFullYear() + 1);
        user.verifiedPro = true;
        user.verifiedProExpiry = oneYear;
        await user.save();
      }
    }
    res.json({ received: true });
  } catch (e) {
    console.error("VerifiedPro webhook handler error:", e);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
