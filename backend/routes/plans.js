const router = require('express').Router();
const User = require('../models/User');

// Simple endpoint to assign plan to a user (admin or webhook mapping)
router.post('/assign-plan', async (req,res)=>{
  const { userId, plan } = req.body; // plan: free/basic/standard/premium
  const user = await User.findByIdAndUpdate(userId, { plan }, { new:true }).select('-password');
  res.json({ ok:true, user });
});

module.exports = router;
