
const router = require('express').Router();
const Notification = require('../models/Notification');

router.get('/user/:userId', async (req,res)=>{
  const list = await Notification.find({ user: req.params.userId }).sort('-createdAt');
  res.json({ ok:true, notifications: list });
});

router.post('/', async (req,res)=>{
  const n = await Notification.create(req.body);
  res.json({ ok:true, notification: n });
});

router.post('/:id/read', async (req,res)=>{
  const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json({ ok:true, notification: n });
});

module.exports = router;
