// routes/stripe_billing_webhook.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { getPlanFromPrice } = require("../lib/plan");
const User = require("../models/User"); // adjust if your User model path differs

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // You can use a separate WEBHOOK_SECRET for billing if preferred
      );
    } catch (err) {
      console.error("Stripe billing webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const sub = event.data.object;
          const priceId = sub.items?.data?.[0]?.price?.id;
          const plan = getPlanFromPrice(priceId);

          // Identify user: prefer stripeCustomerId, fallback to email via customer lookup
          let user = await User.findOne({ stripeCustomerId: sub.customer });
          if (!user) {
            try {
              const cust = await stripe.customers.retrieve(sub.customer);
              if (cust && cust.email) {
                user = await User.findOne({ email: cust.email.toLowerCase() });
              }
            } catch {}
          }
          if (!user) break;

          user.subscriptionId = sub.id;
          user.subscriptionStatus = sub.status;
          user.currentPeriodEnd = new Date(sub.current_period_end * 1000);

          if (plan) {
            user.planName = plan.name;
            user.appsLimit = plan.limit;
            // reset usage on plan change or renewal
            if (event.type === "customer.subscription.created") {
              user.appsUsedCurrentCycle = 0;
            }
          }
          await user.save();
          break;
        }

        case "customer.subscription.deleted": {
          const sub = event.data.object;
          const user = await User.findOne({ subscriptionId: sub.id });
          if (user) {
            user.subscriptionStatus = "canceled";
            user.planName = null;
            user.appsLimit = 0;
            user.appsUsedCurrentCycle = 0;
            await user.save();
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const inv = event.data.object;
          // Optionally store invoice info or reset counters at cycle start
          break;
        }

        case "invoice.payment_failed": {
          const inv = event.data.object;
          // Mark user for dunning emails, if needed
          break;
        }

        default:
          console.log("Unhandled billing event", event.type);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Stripe billing webhook handler error:", err);
      res.status(500).json({ error: "Internal billing webhook error" });
    }
  }
);

module.exports = router;
