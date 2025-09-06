
const router = require('express').Router();
const User = require('../models/User');
const VerificationDoc = require('../models/VerificationDoc');
const Job = require('../models/Job');

router.get('/users', async (req,res)=>{
  const users = await User.find().limit(200).sort('-createdAt');
  res.json({ ok:true, users });
});
router.get('/docs', async (req,res)=>{
  const docs = await VerificationDoc.find().limit(200).sort('-createdAt');
  res.json({ ok:true, docs });
});
router.post('/docs/approve', async (req,res)=>{
  const doc = await VerificationDoc.findByIdAndUpdate(req.body.id, { status:'approved' }, { new:true });
  res.json({ ok:true, doc });
});
router.post('/docs/reject', async (req,res)=>{
  const doc = await VerificationDoc.findByIdAndUpdate(req.body.id, { status:'rejected' }, { new:true });
  res.json({ ok:true, doc });
});
router.get('/jobs', async (req,res)=>{
  const jobs = await Job.find().limit(200).sort('-createdAt');
  res.json({ ok:true, jobs });
});

module.exports = router;
