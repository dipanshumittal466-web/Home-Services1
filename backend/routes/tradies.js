const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req,res)=>{
  const { skill, rating, verified, q } = req.query;
  const filter = { role: 'tradie' };
  if(verified === 'true') filter.verified = true;
  if(q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  // skills & rating optional fields if exist
  if(skill) filter.skills = { $in: [ new RegExp(skill, 'i') ] };
  if(rating) filter.rating = { $gte: Number(rating) };
  const tradies = await User.find(filter).select('-password').limit(100);
  res.json({ ok:true, tradies });
});

module.exports = router;
