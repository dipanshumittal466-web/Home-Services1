const router = require('express').Router();
const Testimonial = require('../models/Testimonial');

router.get('/', async (req,res)=>{
  const list = await Testimonial.find({ active: true }).sort('-createdAt').limit(20);
  res.json({ ok:true, testimonials: list });
});

router.post('/', async (req,res)=>{
  try{
    const t = await Testimonial.create(req.body);
    res.json({ ok:true, testimonial: t });
  }catch(e){ res.status(400).json({ ok:false, error: e.message }); }
});

router.put('/:id', async (req,res)=>{
  try{
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ok:true, testimonial: t });
  }catch(e){ res.status(400).json({ ok:false, error: e.message }); }
});

router.delete('/:id', async (req,res)=>{
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

module.exports = router;
