const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// Simple proxy to fetch invoice PDFs from Stripe and return links/metadata
router.get("/", async (req, res) => {
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { customer, limit = 20 } = req.query;
    const invoices = await stripe.invoices.list({ customer, limit: Number(limit) });
    const data = invoices.data.map(i => ({
      id: i.id,
      number: i.number,
      hosted_invoice_url: i.hosted_invoice_url,
      invoice_pdf: i.invoice_pdf,
      total: i.total,
      currency: i.currency,
      status: i.status,
      created: i.created
    }));
    res.json({ data });
  } catch (e) {
    console.error("invoices list error:", e);
    res.status(500).json({ error: "Failed to list invoices" });
  }
});

module.exports = router;
