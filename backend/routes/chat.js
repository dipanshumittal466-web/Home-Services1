
module.exports = function(io){
  const router = require('express').Router();
  const Message = require('../models/Message');

  router.get('/:roomId', async (req,res)=>{
    const msgs = await Message.find({roomId: req.params.roomId}).sort('createdAt');
    res.json({ ok:true, messages: msgs });
  });

  router.post('/:roomId', async (req,res)=>{
    const msg = await Message.create({ roomId: req.params.roomId, ...req.body });
    io.to(req.params.roomId).emit('chatMessage', msg);
    res.json({ ok:true, message: msg });
  });

  return router;
}
