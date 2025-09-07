
const router = require('express').Router();
const VerificationDoc = require('../models/VerificationDoc');

router.post('/upload', upload.single('file'), async (req,res)=>{
  try{
    const { user, type, expiresAt } = req.body;
    const fileUrl = getPublicUrl(req.file);
    const doc = await VerificationDoc.create({ user, type, expiresAt, filePath: fileUrl });
    res.json({ ok:true, doc });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error: 'Upload failed' });
  }
});

router.get('/user/:userId', async (req,res)=>{
  const docs = await VerificationDoc.find({ user: req.params.userId }).sort('-createdAt');
  res.json({ ok:true, docs });
});

module.exports = router;
