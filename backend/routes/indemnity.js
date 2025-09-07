const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/accept', auth, async (req,res)=>{
  const user = await User.findByIdAndUpdate(req.user.id, { indemnityAccepted: true }, { new: true }).select('-password');
  res.json({ ok:true, user });
});

module.exports = router;
