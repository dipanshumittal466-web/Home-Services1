const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Dispute = require("../models/Dispute");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const signature = req.headers["stripe-signature"];
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case "charge.dispute.created": {
          const d = event.data.object;
          await Dispute.create({
            stripeDisputeId: d.id,
            paymentIntentId: d.payment_intent || null,
            reason: d.reason || null,
            status: d.status || "open",
            amount: d.amount || 0,
            currency: d.currency || null,
            evidence: d.evidence || {},
          });
          break;
        }
        case "payment_intent.succeeded":
          console.log("Payment succeeded:", event.data.object.id);
          break;
        default:
          console.log("Unhandled Stripe event:", event.type);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Stripe webhook error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

module.exports = router;
