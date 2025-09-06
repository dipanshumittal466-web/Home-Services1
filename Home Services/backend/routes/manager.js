const router = require('express').Router();
const Property = require('../models/Property');
const Job = require('../models/Job');

// Create property
router.post('/properties', async (req,res)=>{
  try{
    const p = await Property.create(req.body);
    res.json({ ok:true, property: p });
  }catch(e){ res.status(400).json({ ok:false, error: e.message }); }
});

// List properties for a manager
router.get('/properties', async (req,res)=>{
  const { manager } = req.query;
  const q = manager ? { manager } : {};
  const props = await Property.find(q).sort('-createdAt');
  res.json({ ok:true, properties: props });
});

// Create a job under a property
router.post('/properties/:id/jobs', async (req,res)=>{
  try{
    const job = await Job.create({ ...req.body, property: req.params.id });
    res.json({ ok:true, job });
  }catch(e){ res.status(400).json({ ok:false, error: e.message }); }
});

module.exports = router;
