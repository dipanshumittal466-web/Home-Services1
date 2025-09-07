// lib/plan.js
// Map Stripe Price IDs to internal plan names and limits.
// Fill PRICE IDs from your Stripe Dashboard in .env

const PLANS = {
  BASIC_10: { name: "BASIC_10", limit: 10 },
  PLUS_20: { name: "PLUS_20", limit: 20 },
  PRO_35: { name: "PRO_35", limit: 35 },
  UNLIMITED: { name: "UNLIMITED", limit: -1 }, // -1 => unlimited
};

function getPlanFromPrice(priceId) {
  if (!priceId) return null;
  const map = {
    [process.env.STRIPE_PRICE_BASIC_10]: PLANS.BASIC_10,
    [process.env.STRIPE_PRICE_PLUS_20]: PLANS.PLUS_20,
    [process.env.STRIPE_PRICE_PRO_35]: PLANS.PRO_35,
    [process.env.STRIPE_PRICE_UNLIMITED]: PLANS.UNLIMITED,
  };
  return map[priceId] || null;
}

module.exports = { PLANS, getPlanFromPrice };
