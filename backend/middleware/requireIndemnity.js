const User = require('../models/User');
module.exports = async function(req, res, next){
  const user = await User.findById(req.user.id);
  if(!user) return res.status(401).json({ error: 'User not found' });
  if(!user.indemnityAccepted){
    return res.status(423).json({ error: 'Indemnity not accepted', code: 'INDEMNITY_REQUIRED' });
  }
  next();
}
