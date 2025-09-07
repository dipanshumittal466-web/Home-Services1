
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

router.post('/create-checkout-session', async (req, res) => {
  const { priceId, success_url, cancel_url, customer_email } = req.body;
  try{
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url,
      cancel_url,
      customer_email
    });
    res.json({ ok:true, url: session.url });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error: e.message });
  }
});

router.post('/create-payment-intent', async (req,res)=>{
  const { amount, currency } = req.body; // for one-time verification fee
  try{
    const pi = await stripe.paymentIntents.create({ amount, currency });
    res.json({ ok:true, clientSecret: pi.client_secret });
  }catch(e){
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Stripe webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req,res)=>{
  const sig = req.headers['stripe-signature'];
  let event;
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }catch(e){
    console.error('Webhook signature verification failed.', e.message);
    return res.sendStatus(400);
  }
  // TODO: handle events: checkout.session.completed, invoice.paid, etc.
  res.json({ received: true });
});

module.exports = router;
