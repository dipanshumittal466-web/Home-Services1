const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  action: String,
  details: mongoose.Schema.Types.Mixed,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DocLog', LogSchema);
