const router = require('express').Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

const PLAN_LIMITS = { free:10, basic:20, standard:35, premium:10000 };

router.post('/', async (req,res)=>{
  const job = await Job.create(req.body);
  res.json({ ok:true, job });
});

router.get('/', async (req,res)=>{
  // filter by query
  const { category, minBudget, maxBudget, location, status, q } = req.query;
  const filter = {};
  if(category) filter.category = category;
  if(status) filter.status = status;
  if(location) filter.location = new RegExp(location, 'i');
  if(q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
  if(minBudget || maxBudget){ filter.budget = {}; if(minBudget) filter.budget.$gte = Number(minBudget); if(maxBudget) filter.budget.$lte = Number(maxBudget); }
  const jobs = await Job.find(filter).sort('-createdAt');
  res.json({ ok:true, jobs });
});

// legacy list (kept for compatibility)
router.get('/all', async (req,res)=>{ /* FILTERS ADDED */
  const { category, status, location, minBudget, maxBudget, q } = req.query;
  const filter = {};
  if(category) filter.category = category;
  if(status) filter.status = status;
  if(location) filter.location = new RegExp(location, 'i');
  if(minBudget || maxBudget) filter.budget = { ...(minBudget?{ $gte: Number(minBudget) }:{}), ...(maxBudget?{ $lte: Number(maxBudget) }:{}) };
  if(q) filter.$or = [ { title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') } ];

  const jobs = await Job.find(filter).sort('-createdAt');
  res.json({ ok:true, jobs });
});

// Apply to a job with subscription limit enforcement
router.post('/:id/apply', async (req,res)=>{
  try{
    const tradieId = req.body.tradie; // assuming frontend sends tradie id in body
    const user = await User.findById(tradieId);
    if(!user) return res.status(400).json({ ok:false, error:'Tradie not found' });

    // monthly counter reset
    const now = new Date();
    if(!user.monthlyCountResetAt || user.monthlyCountResetAt.getMonth() !== now.getMonth() || user.monthlyCountResetAt.getFullYear() !== now.getFullYear()){
      user.monthlyApplicationCount = 0;
      user.monthlyCountResetAt = now;
    }

    const limit = PLAN_LIMITS[user.plan || 'free'];
    if(user.monthlyApplicationCount >= limit){
      return res.status(429).json({ ok:false, error:`Application limit reached for plan ${user.plan}`, code:'LIMIT_REACHED', limit });
    }

    user.monthlyApplicationCount += 1;
    await user.save();

    const app = await Application.create({ job: req.params.id, ...req.body });
    res.json({ ok:true, application: app });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error: 'Failed to apply' });
  }
});

module.exports = router;


// Advanced search & filters
router.get('/search', async (req,res)=>{
  const { category, minBudget, maxBudget, location, status, q } = req.query;
  const cond = {};
  if(category) cond.category = category;
  if(status) cond.status = status;
  if(location) cond.location = new RegExp(location, 'i');
  if(minBudget || maxBudget){
    cond.budget = {};
    if(minBudget) cond.budget.$gte = Number(minBudget);
    if(maxBudget) cond.budget.$lte = Number(maxBudget);
  }
  if(q){
    cond.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') }
    ];
  }
  const jobs = await Job.find(cond).sort('-createdAt');
  res.json({ ok:true, jobs });
});
