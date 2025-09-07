const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req,res)=>{
  const user = await User.findById(req.user.id).select('-password');
  res.json({ ok:true, user });
});

router.get('/tradies', async (req,res)=>{ // GET /api/users/tradies
  const { skill, rating, verified, q } = req.query;
  const filter = { role: 'tradie' };
  if(typeof verified !== 'undefined') filter.verified = verified === 'true';
  if(rating) filter.rating = { $gte: Number(rating) };
  if(skill) filter.skills = { $in: [ new RegExp(skill, 'i') ] };
  if(q) filter.$or = [ { name: new RegExp(q, 'i') }, { bio: new RegExp(q, 'i') } ];
  const list = await User.find(filter).select('-password').limit(100);
  res.json({ ok:true, tradies: list });
});
module.exports = router;
