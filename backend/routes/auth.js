
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function token(user){
  return jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', 
  body('email').isEmail(),
  body('password').isLength({min:6}),
  async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const exists = await User.findOne({email:req.body.email});
    if(exists) return res.status(409).json({error:'Email already exists'});
    const user = await User.create(req.body);
    res.json({ ok:true, token: token(user), user });
});

router.post('/login', async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const ok = await user.compare(req.body.password);
  if(!ok) return res.status(401).json({error:'Invalid credentials'});
  res.json({ ok:true, token: token(user), user });
});

module.exports = router;
