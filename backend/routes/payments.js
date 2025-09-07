const express = require('express');
const router = express.Router();
// stripe placeholder - replace with real stripe integration using keys in .env
router.post('/checkout', async (req, res) => {
  // create a payment intent or subscription in real integration
  res.json({ ok:true, message:'Checkout placeholder - configure Stripe keys in .env' });
});
router.post('/webhook', express.raw({type: 'application/json'}), (req,res)=>{
  // handle stripe webhook events here
  console.log('webhook received');
  res.status(200).send('ok');
});
module.exports = router;
